#!/usr/bin/env bash
# Regenerates the house sound effects in public/sfx with ffmpeg (no downloads).
# Add new effects here so every video draws from the same palette.
set -euo pipefail
cd "$(dirname "$0")/../public/sfx"
g(){ out=$1; shift; ffmpeg -v error -y -f lavfi -i "$1" ${2:+-af "$2"} -ar 48000 -ac 2 "$out"; }
g whoosh.wav "anoisesrc=d=0.7:c=pink:a=0.9:r=48000:seed=1" "highpass=f=300,lowpass=f=3500,afade=t=in:d=0.35:curve=exp,afade=t=out:st=0.35:d=0.35:curve=exp"
g pop.wav    "aevalsrc=0.8*sin(2*PI*(500*t+4000*t*t))*exp(-t*40):d=0.12:s=48000"
g tick.wav   "aevalsrc=0.6*sin(2*PI*2400*t)*exp(-t*220):d=0.04:s=48000"
g ding.wav   "aevalsrc=0.45*(sin(2*PI*1318*t)+0.5*sin(2*PI*2636*t)+0.25*sin(2*PI*3954*t))*exp(-t*3.2):d=1.4:s=48000"
g click.wav  "aevalsrc=0.7*(random(0)*2-1)*exp(-t*600)+0.6*(random(1)*2-1)*exp(-(t-0.05)*600)*gte(t\,0.05):d=0.1:s=48000" "highpass=f=1200"
g thud.wav   "aevalsrc=0.9*sin(2*PI*(90-40*t)*t)*exp(-t*9)+0.3*(random(0)*2-1)*exp(-t*60):d=0.45:s=48000" "lowpass=f=1800"
g riser.wav  "aevalsrc=0.35*sin(2*PI*(300*t+700*t*t))*min(1\,t*4)*(1-t):d=1.0:s=48000"
echo "sfx written to $(pwd)"
