#!/usr/bin/env python3
"""Builds the film soundtrack and muxes it onto film.mp4 without re-encoding video.

  narration : audio/vo/*.aiff placed at the times in audio/vo/lines.json,
              time-fitted so each clip ends before its chapter's wipe.
  music     : Apple Loops (royalty-free, ship with GarageBand/Logic) looped into a
              126 bpm military-snare bed with orchestra hits, ducked under the voice.
  song      : if audio/track.mp3 exists it replaces the loop bed (still ducked).

Usage: python3 render/mix.py   (reads film-silent.mp4, writes film.mp4 + audio/soundtrack.m4a)
"""
import json, os, subprocess, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FF = ROOT / "render/node_modules/ffmpeg-static/ffmpeg"
VO = ROOT / "audio/vo"
LOOPS = pathlib.Path("/Library/Audio/Apple Loops/Apple")
SONG = ROOT / "audio/track.mp3"
VIDEO_IN = ROOT / "film-silent.mp4"
VIDEO = ROOT / "film.mp4"
OUT_AUDIO = ROOT / "audio/soundtrack.m4a"
DUR = 105.0
CHAPTER = 8.0
FIT = 7.0          # each narration clip must fit in this many seconds
MAX_SPEED = 1.6

def probe(path):
    r = subprocess.run([FF, "-i", str(path)], capture_output=True, text=True)
    for line in r.stderr.splitlines():
        if "Duration:" in line:
            h, m, s = line.split("Duration:")[1].split(",")[0].strip().split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise SystemExit(f"no duration for {path}")

lines = json.load(open(VO / "lines.json"))
inputs, filters, voice_labels = [], [], []

# ---------- narration ----------
for i, l in enumerate(lines):
    f = VO / f"{l['id']}.aiff"
    d = probe(f)
    speed = min(MAX_SPEED, max(1.0, d / FIT))
    inputs += ["-i", str(f)]
    idx = len(inputs) // 2 - 1
    # atempo accepts 0.5..2.0 per stage; we cap at 1.6 so one stage is enough
    filters.append(f"[{idx}:a]atempo={speed:.4f},aformat=sample_rates=48000:channel_layouts=stereo,"
                   f"adelay={int(l['t']*1000)}|{int(l['t']*1000)},volume=1.0[v{i}]")
    voice_labels.append(f"[v{i}]")
filters.append("".join(voice_labels) + f"amix=inputs={len(voice_labels)}:normalize=0:dropout_transition=0,"
               "highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=5:release=120,volume=2.2,"
               f"apad=whole_dur={DUR}[voice]")

# ---------- music ----------
def add_loop(path, speed=1.0, gain=1.0, fade_in=(0, 0), fade_out=(DUR - 3, 3), start=0.0, end=DUR):
    inputs.extend(["-stream_loop", "-1", "-i", str(path)])
    idx = len([x for x in inputs if x == "-i"]) - 1
    chain = f"[{idx}:a]"
    if abs(speed - 1) > 1e-3:
        chain += f"atempo={speed:.4f},"
    chain += (f"aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{DUR},asetpts=PTS-STARTPTS,"
              f"volume='if(between(t,{start},{end}),{gain},0)':eval=frame,"
              f"afade=t=in:st={fade_in[0]}:d={max(fade_in[1],0.01)},afade=t=out:st={fade_out[0]}:d={fade_out[1]}")
    return chain

music_labels = []
if SONG.exists():
    inputs.extend(["-i", str(SONG)])
    idx = len([x for x in inputs if x == "-i"]) - 1
    filters.append(f"[{idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{DUR},asetpts=PTS-STARTPTS,"
                   f"afade=t=in:st=0:d=1.5,afade=t=out:st={DUR-3}:d=3,volume=0.9[music]")
else:
    # 126 bpm bed: Electro House toppers are 2 bars = 3.81 s; Epoch Orchestra Hits is 8 bars @ ~121.6 bpm
    bed = [
        (LOOPS / "02 Electro House/Marching Drum Topper.caf", 1.0, 0.9, 7.0, 95.0),
        (LOOPS / "02 Electro House/Military Roll Topper.caf", 1.0, 0.55, 15.0, 95.0),
        (LOOPS / "02 Electro House/Titanic Snare Beat.caf",   1.0, 0.7, 31.0, 95.0),
        (LOOPS / "01 Hip Hop/Epoch Orchestra Hits.caf", 126 / 121.6, 0.8, 0.0, DUR),
    ]
    for k, (p, sp, g, st, en) in enumerate(bed):
        if not p.exists():
            print("missing loop:", p, file=sys.stderr); continue
        filters.append(add_loop(p, sp, g, fade_in=(st, 0.5), fade_out=(en - 2, 2), start=st, end=en) + f"[m{k}]")
        music_labels.append(f"[m{k}]")
    filters.append("".join(music_labels) + f"amix=inputs={len(music_labels)}:normalize=0,volume=0.9[music]")

# duck music under the voice, then sum
filters.append("[voice]asplit=2[vA][vB]")
filters.append("[music][vB]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400:makeup=1[ducked]")
filters.append("[ducked][vA]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95[out]")

cmd = [str(FF), "-y", *inputs, "-filter_complex", ";".join(filters), "-map", "[out]",
       "-t", str(DUR), "-c:a", "aac", "-b:a", "192k", str(OUT_AUDIO)]
print("building soundtrack …")
subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

tmp = VIDEO.with_name("film.tmp.mp4")
subprocess.run([str(FF), "-y", "-i", str(VIDEO_IN), "-i", str(OUT_AUDIO), "-map", "0:v:0", "-map", "1:a:0",
                "-c:v", "copy", "-c:a", "copy", "-shortest", "-movflags", "+faststart", str(tmp)],
               check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
os.replace(tmp, VIDEO)
print("done:", VIDEO, "(music:", "track.mp3" if SONG.exists() else "apple loops bed", ")")
