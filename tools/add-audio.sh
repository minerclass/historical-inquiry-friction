#!/bin/sh
# Generates the soundtracks and adds them to the nine clips in assets/.
# Run from the repository root on a Mac:  sh tools/add-audio.sh
# Safe to run again: each run replaces whatever sound a clip already has.
set -e
work=$(mktemp -d)
swiftc -O tools/add-audio.swift -o "$work/add-audio" 2>/dev/null
python3 tools/clip-audio.py "$work"
for wav in "$work"/*.wav; do
  name=$(basename "$wav" .wav)
  afconvert -f m4af -d aac -b 160000 "$wav" "$work/$name.m4a"
  "$work/add-audio" "assets/$name.mp4" "$work/$name.m4a" "$work/$name.mp4"
  mv "$work/$name.mp4" "assets/$name.mp4"
done
rm -rf "$work"
