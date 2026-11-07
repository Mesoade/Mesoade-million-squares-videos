#!/usr/bin/env bash
# Usage: scripts/contact-sheet.sh <clip.mp4> <out-dir> [fps=2]
# Writes timestamped 20-frame contact sheets (sheet0.jpg, sheet1.jpg, ...).
# Read them to (a) transcribe burned-in captions with timings and (b) measure
# where the face and captions sit, which sets the video's panelH.
set -euo pipefail
clip=$1; out=$2; fps=${3:-2}
mkdir -p "$out/frames"
ffmpeg -v error -y -i "$clip" -vf "fps=$fps,scale=270:480,drawtext=text='%{pts\:hms}':x=5:y=5:fontsize=18:fontcolor=yellow:box=1:boxcolor=black" "$out/frames/f%04d.jpg"
n=$(ls "$out/frames" | wc -l); i=0
while [ $((i*20)) -lt "$n" ]; do
  ffmpeg -v error -y -start_number $((i*20+1)) -i "$out/frames/f%04d.jpg" -frames:v 1 -vf "tile=10x2" "$out/sheet$i.jpg"
  i=$((i+1))
done
echo "$i sheets in $out"
