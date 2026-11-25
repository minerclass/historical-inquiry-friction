#!/usr/bin/env python3
"""Synthesizes the soundtracks for the deck clips. Standard library only.

    python3 tools/clip-audio.py <output-dir>

Writes one 16-bit WAV per clip. The Inquiry Quest clips get an original
chiptune score with sound effects timed to the scenes in assets/inquiry-quest.js;
the three earlier 18-second clips get a quiet ambient bed. tools/add-audio.sh
turns each WAV into AAC and adds it to the matching MP4.

Every note here is generated from the patterns below. Nothing is sampled.
"""
import array
import math
import os
import random
import sys
import wave

SR = 44100
SEMI = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}


def hz(name):
    return 440.0 * 2 ** ((SEMI[name[:-1]] - 9) / 12 + (int(name[-1]) - 4))


class Track:
    def __init__(self, seconds):
        self.n = int(seconds * SR)
        self.buf = array.array('d', [0.0]) * self.n

    def tone(self, t, dur, freq, vol, shape='sq', duty=0.5, attack=0.004, release=0.03, slide=0.0, decay=0.0):
        """One note. slide is the relative pitch change by the end; decay is a time constant in seconds."""
        i0 = int(t * SR)
        n = min(int(dur * SR), self.n - i0)
        if i0 < 0 or n <= 0:
            return
        a = max(1, int(attack * SR))
        r = max(1, int(release * SR))
        buf, ph, two_pi = self.buf, 0.0, 2 * math.pi
        for k in range(n):
            ph += freq * (1 + slide * k / n) / SR
            x = ph - int(ph)
            if shape == 'sq':
                s = 1.0 if x < duty else -1.0
            elif shape == 'tri':
                s = 4 * abs(x - 0.5) - 1
            else:
                s = math.sin(two_pi * x)
            env = k / a if k < a else ((n - k) / r if k > n - r else 1.0)
            if decay:
                env *= math.exp(-k / (decay * SR))
            buf[i0 + k] += s * vol * env

    def noise(self, t, dur, vol, hold=1, rng=None):
        """Sample-and-hold noise that fades out; a larger hold sounds lower."""
        rng = rng or random
        i0 = int(t * SR)
        n = min(int(dur * SR), self.n - i0)
        if i0 < 0 or n <= 0:
            return
        s = 0.0
        for k in range(n):
            if k % hold == 0:
                s = rng.uniform(-1, 1)
            self.buf[i0 + k] += s * vol * (1 - k / n)

    def gain(self, t0, t1, g0, g1):
        """Ramp the gain from g0 at t0 to g1 at t1, and hold g1 afterwards."""
        i0, i1 = int(t0 * SR), min(self.n, int(t1 * SR))
        for i in range(i0, self.n):
            g = g1 if i >= i1 else g0 + (g1 - g0) * (i - i0) / max(1, i1 - i0)
            self.buf[i] *= g


def write_wav(path, tracks, seconds, fade_out=0.4, gain=1.0):
    n = int(seconds * SR)
    mix = [0.0] * n
    for tr in tracks:
        for i in range(min(n, tr.n)):
            mix[i] += tr.buf[i]
    # A fixed gain keeps every clip at the same loudness; the tanh below rounds off the peaks.
    scale = gain
    f0 = n - int(fade_out * SR)
    out = array.array('h')
    for i, v in enumerate(mix):
        v = math.tanh(v * scale * 1.2) / 1.2
        if i > f0:
            v *= (n - i) / (n - f0)
        out.append(int(max(-1, min(1, v)) * 32767))
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(out.tobytes())


# ---------- the Inquiry Quest score ----------
BEAT = 0.5  # 120 beats a minute; a bar is two seconds
CHORDS = {
    'C': ('C3', ['C4', 'E4', 'G4']), 'Am': ('A2', ['A3', 'C4', 'E4']), 'F': ('F2', ['F3', 'A3', 'C4']),
    'G': ('G2', ['G3', 'B3', 'D4']), 'Dm': ('D3', ['D4', 'F4', 'A4']), 'E': ('E2', ['E3', 'G#3', 'B3']),
    'Em': ('E2', ['E3', 'G3', 'B3']), 'D': ('D3', ['D4', 'F#4', 'A4']), 'B': ('B2', ['B3', 'D#4', 'F#4']),
}
# The quest theme (hopeful) and the gate theme (uneasy). Each bar: chord, then (note, beats).
BARS = {
    'T':  ('C',  [('C5', .5), ('E5', .5), ('G5', .5), ('C6', .5), ('E6', 2)]),
    'A0': ('C',  [('E5', .5), ('G5', .5), ('C6', 1), ('G5', .5), ('E5', .5), ('G5', 1)]),
    'A1': ('Am', [('A5', 1), ('G5', .5), ('E5', .5), ('C5', 1), ('D5', 1)]),
    'A2': ('F',  [('F5', .5), ('A5', .5), ('C6', 1), ('A5', .5), ('F5', .5), ('A5', 1)]),
    'A3': ('G',  [('G5', 1), ('B5', .5), ('D6', .5), ('B5', 1), ('G5', 1)]),
    'B0': ('Am', [('E5', .5), ('F5', .5), ('E5', 1), ('C5', .5), ('A4', .5), ('C5', 1)]),
    'B1': ('F',  [('F5', .5), ('G5', .5), ('F5', 1), ('C5', .5), ('A4', .5), ('C5', 1)]),
    'B2': ('Dm', [('D5', .5), ('E5', .5), ('F5', 1), ('D5', .5), ('A4', .5), ('D5', 1)]),
    'B3': ('E',  [('E5', 1), ('G#5', .5), ('B5', .5), ('G#5', 1), ('E5', 1)]),
    # The NCSS set has its own tune, in G: an archive theme (C bars) and an uneasy one (D bars).
    'U':  ('G',  [('G4', .5), ('B4', .5), ('D5', .5), ('G5', .5), ('B5', 2)]),
    'C0': ('G',  [('D5', 1), ('B4', .5), ('D5', .5), ('G5', 1), ('D5', 1)]),
    'C1': ('Em', [('E5', .5), ('G5', .5), ('B5', 1), ('G5', .5), ('E5', .5), ('B4', 1)]),
    'C2': ('C',  [('C5', 1), ('E5', .5), ('G5', .5), ('E5', 1), ('C5', 1)]),
    'C3': ('D',  [('D5', .5), ('F#5', .5), ('A5', 1), ('F#5', .5), ('A5', .5), ('D6', 1)]),
    'D0': ('Em', [('B4', .5), ('C5', .5), ('B4', 1), ('G4', .5), ('E4', .5), ('G4', 1)]),
    'D1': ('C',  [('C5', .5), ('D5', .5), ('C5', 1), ('G4', .5), ('E4', .5), ('G4', 1)]),
    'D2': ('Am', [('A4', .5), ('B4', .5), ('C5', 1), ('A4', .5), ('E4', .5), ('A4', 1)]),
    'D3': ('B',  [('B4', 1), ('D#5', .5), ('F#5', .5), ('D#5', 1), ('B4', 1)]),
}


def bar(m, t0, key, layers='lbad'):
    """One two-second bar. layers picks the parts: l lead, b bass, a arpeggio, d drums."""
    chord, lead = BARS[key]
    root, tones = CHORDS[chord]
    title, uneasy, archive = key in ('T', 'U'), key[0] in 'BD', key[0] in 'UCD'
    t = t0
    for note, beats in lead:
        duty = 0.5 if uneasy else (0.125 if archive else 0.25)   # a thinner lead for the archive theme
        m.tone(t, beats * BEAT * 0.92, hz(note), 0.12, 'sq', duty, release=0.05)
        if title:
            m.tone(t, beats * BEAT * 0.92, hz(note) / 2, 0.05, 'sq', 0.5, release=0.05)
        t += beats * BEAT
    for i in range(8 if 'b' in layers else 0):  # bass on the eighths, root then octave
        f = hz(root) * (2 if i % 2 else 1)
        m.tone(t0 + i * BEAT / 2, 0.2, f, 0.2, 'tri', release=0.04)
    if title:
        return
    for i in range(16 if 'a' in layers else 0):  # quiet sixteenth-note arpeggio
        m.tone(t0 + i * BEAT / 4, 0.1, hz(tones[i % 3]) * 2, 0.03, 'sq', 0.5, release=0.03)
    for b in range(4 if 'd' in layers else 0):
        tb = t0 + b * BEAT
        if b % 2 == 0:
            m.tone(tb, 0.12, 120, 0.26, 'sin', slide=-0.6, release=0.05)
        else:
            m.noise(tb, 0.08, 0.06, hold=3)
        m.noise(tb + BEAT / 2, 0.03, 0.035)
        if uneasy:
            m.noise(tb + BEAT / 4, 0.02, 0.02)
            m.noise(tb + 3 * BEAT / 4, 0.02, 0.02)


# ---------- sound effects ----------
def blip(s, t, f=1200, vol=0.07, dur=0.05):
    s.tone(t, dur, f, vol, 'sq', 0.5, release=0.02)


def typing(s, t0, chars, pitch, duty=0.5):
    for i in range(0, chars, 2):
        s.tone(t0 + i / 30, 0.014, pitch * (1.06 if i % 4 else 1), 0.022, 'sq', duty, attack=0.001, release=0.004)


def coin(s, t):
    s.tone(t, 0.07, hz('B5'), 0.09, 'sq', 0.5)
    s.tone(t + 0.07, 0.3, hz('E6'), 0.09, 'sq', 0.5, decay=0.12)


def jump(s, t):
    s.tone(t, 0.16, 320, 0.07, 'sq', 0.25, slide=1.0)


def thud(s, t):
    s.tone(t, 0.16, 110, 0.3, 'sin', slide=-0.55)
    s.noise(t, 0.05, 0.08, hold=6)


def alert(s, t):
    blip(s, t, 880, 0.08, 0.06)
    blip(s, t + 0.07, 1175, 0.08, 0.09)


def ask(s, t):
    blip(s, t, 700, 0.07, 0.07)
    blip(s, t + 0.09, 933, 0.07, 0.12)


def shimmer(s, t, dur, rng, vol=0.04):
    scale = [hz(n) for n in ('E6', 'G6', 'A6', 'C7', 'D7', 'E7')]
    k = 0
    while k * 0.05 < dur:
        s.tone(t + k * 0.05, 0.06, rng.choice(scale), vol, 'tri', decay=0.03)
        k += 1


def sweep(s, t, dur, up=True):
    s.tone(t, dur, 220 if up else 1500, 0.07, 'sq', 0.25, slide=5.5 if up else -0.82)


def rumble(s, t, dur, rng):
    s.noise(t, dur, 0.13, hold=24, rng=rng)
    s.tone(t, dur, 80, 0.16, 'sin', slide=-0.5)


def womp(s, t, f=196):
    s.tone(t, 0.32, f, 0.1, 'sq', 0.5, slide=-0.3, release=0.1)


def jingle(s, t):
    for i, n in enumerate(('G5', 'C6', 'E6')):
        s.tone(t + i * 0.07, 0.09 if i < 2 else 0.25, hz(n), 0.08, 'sq', 0.25, decay=0.2)


def fanfare(s, t):
    for i, n in enumerate(('C5', 'E5', 'G5', 'C6')):
        s.tone(t + i * 0.09, 0.09, hz(n), 0.1, 'sq', 0.25)
    for n in ('C6', 'E6', 'G6'):
        s.tone(t + 0.36, 0.9, hz(n), 0.075, 'sq', 0.5, release=0.3)


def flip(s, t):
    s.noise(t, 0.04, 0.09, hold=4)
    s.tone(t + 0.25, 0.12, 500, 0.07, 'sq', 0.5, slide=0.8)


def whoosh(s, t, rng):
    s.noise(t, 0.3, 0.07, hold=2, rng=rng)


def ending(e, t, warm, total=20, archive=False):
    """A two-note pause chime and a held chord under the end card."""
    a, b = (('D5', 'G5') if warm else ('B4', 'E5')) if archive else (('G5', 'C6') if warm else ('E5', 'A5'))
    e.tone(t + 0.15, 0.5, hz(a), 0.11, 'tri', decay=0.25)
    e.tone(t + 0.4, 0.9, hz(b), 0.11, 'tri', decay=0.4)
    chord = (('G2', 'D3', 'B3', 'G4') if warm else ('E2', 'B2', 'F#3', 'B3')) if archive else (('C3', 'G3', 'E4', 'C5') if warm else ('A2', 'E3', 'B3', 'E4'))
    for n in chord:
        e.tone(t + 0.5, total - 0.6 - t - 0.5, hz(n), 0.05, 'sin', attack=0.5, release=1.4)
        e.tone(t + 0.5, total - 0.6 - t - 0.5, hz(n) * 1.003, 0.03, 'tri', attack=0.5, release=1.4)


# ---------- the six episodes: score, end card, and events from assets/inquiry-quest.js ----------
VALE, PIP, GATE, LANE = 880, 1320, 440, 660


def ncss1(s, rng):
    typing(s, 2.9, 81, VALE); shimmer(s, 6.0, 0.6, rng); typing(s, 6.4, 48, GATE, 0.125)
    sweep(s, 9.0, 0.6); shimmer(s, 9.0, 0.6, rng)
    for i in range(9):
        blip(s, 9.65 + i * 0.105, 1000, 0.05, 0.02)
    sweep(s, 10.6, 0.3, up=False); jingle(s, 11.0); blip(s, 11.6)
    womp(s, 12.3); womp(s, 13.0, 147); typing(s, 13.4, 46, VALE)


def ncss2(s, rng):
    thud(s, 4.2); alert(s, 4.35); typing(s, 4.5, 27, PIP); typing(s, 6.5, 68, VALE)
    blip(s, 7.45, 1568, 0.08, 0.2); rumble(s, 7.9, 0.8, rng); coin(s, 9.6)
    shimmer(s, 10.2, 0.5, rng); typing(s, 10.3, 46, GATE, 0.125); ask(s, 10.7)
    sweep(s, 11.7, 0.25, up=False); jingle(s, 11.95); typing(s, 12.0, 56, VALE)
    jump(s, 12.1); coin(s, 12.5); jump(s, 13.0); coin(s, 13.4)


def ncss3(s, rng):
    typing(s, 2.5, 16, 1000); typing(s, 4.8, 71, PIP)
    for i, n in enumerate(('E6', 'G6', 'C7')):
        blip(s, 5.0 + i * 0.6, hz(n), 0.07, 0.09)
    fanfare(s, 8.25); shimmer(s, 8.6, 0.7, rng, 0.03); alert(s, 8.9)
    jingle(s, 9.3); blip(s, 9.9); blip(s, 10.5); blip(s, 11.1, 1568); typing(s, 11.8, 73, VALE)


def nssla1(s, rng):
    typing(s, 2.9, 29, 740); typing(s, 5.6, 30, VALE)
    for k in range(12):
        s.tone(7.8 + k * 0.3, 0.09, 392 * 2 ** (-k / 12), 0.08, 'sq', 0.5, slide=-0.1)
    typing(s, 8.0, 54, VALE); ask(s, 11.4); typing(s, 11.8, 46, LANE)


def nssla2(s, rng):
    for k in range(6):  # the clock counts down
        blip(s, 2.6 + k / 1.4, 1000 + k * 60, 0.06, 0.03)
    typing(s, 3.2, 54, VALE); ask(s, 3.5)
    for k in range(4):
        blip(s, 5.5 + k * 0.18, 1319 if k % 2 else 988, 0.07, 0.1)
    sweep(s, 6.2, 0.4); shimmer(s, 6.2, 0.4, rng); typing(s, 6.8, 35, VALE)
    sweep(s, 7.4, 0.3, up=False); womp(s, 7.8)
    typing(s, 9.4, 43, LANE)
    for i in range(4):
        flip(s, 9.8 + i * 0.9)
    jingle(s, 13.0); typing(s, 13.2, 32, VALE); coin(s, 14.5)


def nssla3(s, rng):
    penta = ('C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6', 'G6', 'A6', 'C7', 'D7')
    for k in range(12):
        s.tone(2.8 + k * 0.35, 0.14, hz(penta[k]), 0.07, 'sq', 0.25, decay=0.08)
    typing(s, 3.0, 55, VALE); typing(s, 6.1, 54, LANE); whoosh(s, 8.1, rng)
    fanfare(s, 8.85); shimmer(s, 9.2, 0.7, rng, 0.03); alert(s, 9.4); jingle(s, 9.9)
    for i in range(3):
        blip(s, 12.4 + i * 0.6, hz(('E6', 'G6', 'C7')[i]), 0.07, 0.09)


def stages(s, rng):
    """Five media environments, 4.4 seconds each from 2.4."""
    for k in range(5):
        t0 = 2.4 + k * 4.4
        if k:
            whoosh(s, t0 - 0.15, rng)
        typing(s, t0 + 0.3, 66, 1000)
    for k in range(4):            # a voice by the fire
        s.tone(3.2 + k * 0.7, 0.3, hz(('E4', 'G4', 'A4', 'G4')[k]), 0.06, 'tri', decay=0.2)
    for k in range(5):            # marks carved one at a time
        s.noise(7.6 + k * 0.5, 0.03, 0.06, hold=5)
    for k in range(6):            # the broadcast pulse
        blip(s, 11.7 + k * 0.55, 1568, 0.04, 0.04)
    for k in range(7):            # the feed lifts some posts
        blip(s, 16.1 + k * 0.5, 988 if k % 3 else 1319, 0.04, 0.03)
    shimmer(s, 20.3, 3.6, rng, 0.022)
    ask(s, 23.9)


def questions(s, rng):
    """Five technoskeptical questions, four seconds each from 2.2."""
    for k in range(5):
        t0 = 2.2 + k * 4.0
        ask(s, t0 + 0.4)
        typing(s, t0 + 0.6, (60, 50, 30, 70, 62)[k], LANE)
    coin(s, 3.0); womp(s, 4.2)
    coin(s, 7.2); alert(s, 8.0)
    for k in range(3):
        sweep(s, 10.7 + k * 0.7, 0.5, up=False)
    for k in range(3):
        womp(s, 15.1 + k * 0.7, 196 - k * 24)
    shimmer(s, 20.6, 1.4, rng, 0.02)


def paths(s, rng):
    """Two paths: AI as exit from 2.2, AI as entry from 10.2."""
    whoosh(s, 2.1, rng); blip(s, 3.6); sweep(s, 4.4, 0.6); shimmer(s, 4.4, 0.6, rng); sweep(s, 5.4, 0.3, up=False)
    womp(s, 6.0); womp(s, 6.7, 147); blip(s, 7.4); typing(s, 7.1, 62, VALE)
    whoosh(s, 10.1, rng); typing(s, 10.5, 62, PIP); coin(s, 11.7); blip(s, 12.8, 1568); ask(s, 14.2); jingle(s, 14.6)
    jump(s, 15.6); coin(s, 16.1); jump(s, 16.8); coin(s, 17.3); fanfare(s, 18.4); shimmer(s, 18.8, 0.7, rng, 0.03)


def moves(s, rng):
    """Four moves of inquiry, 4.5 seconds each from 2.2."""
    for k in range(4):
        t0 = 2.2 + k * 4.5
        if k:
            whoosh(s, t0 - 0.15, rng)
        typing(s, t0 + 0.3, (38, 42, 54, 62)[k], 1000)
    for k in range(4):
        blip(s, 2.8 + k * 0.75, hz(('E6', 'G6', 'A6', 'C7')[k]), 0.06, 0.07)
    for k in range(3):
        blip(s, 7.5 + k * 0.5, 1175, 0.05, 0.05)
    blip(s, 12.2, 1319, 0.06, 0.08); womp(s, 12.9, 220); blip(s, 13.6, 1319, 0.06, 0.08)
    fanfare(s, 17.3); shimmer(s, 17.7, 0.7, rng, 0.03)


def audit(s, rng):
    """The smooth answer from 2.2, then three audits of 4.4 seconds from 6.2."""
    shimmer(s, 2.6, 0.5, rng); typing(s, 3.2, 86, GATE, 0.125)
    for k in range(3):
        t0 = 6.2 + k * 4.4
        whoosh(s, t0 - 0.15, rng); alert(s, t0 + 0.5); typing(s, t0 + 0.4, (68, 56, 62)[k], VALE)
        jingle(s, t0 + 3.2)
    for k in range(3):
        blip(s, 7.2 + k * 0.6, 440 - k * 40, 0.05, 0.12)
        coin(s, 11.5 + k * 0.7)
    womp(s, 15.6)


def provenance(s, rng):
    """One document by three routes, 5.6 seconds each from 2.2."""
    for k in range(3):
        t0 = 2.2 + k * 5.6
        whoosh(s, t0 - 0.15, rng); typing(s, t0 + 0.3, 62, 1000)
        for j in range(3):
            if (1, 1, 1, 0, 1, 0, 0, 0, 0)[k * 3 + j]:
                blip(s, t0 + 1.4 + j * 0.8, 1568, 0.06, 0.08)
            else:
                womp(s, t0 + 1.4 + j * 0.8, 220 - j * 20)
    shimmer(s, 13.9, 1.2, rng, 0.03); alert(s, 17.0)


def seminar(s, rng):
    """A contested question from 2.2, the turn-taking from 8.2, common ground from 14.2."""
    alert(s, 3.0); alert(s, 3.4); thud(s, 3.8); shimmer(s, 4.6, 0.6, rng); typing(s, 5.0, 56, GATE, 0.125)
    whoosh(s, 8.1, rng); typing(s, 8.5, 52, VALE)
    for k in range(3):
        coin(s, 9.4 + k * 1.4)
    whoosh(s, 14.1, rng); fanfare(s, 15.2); typing(s, 14.9, 36, PIP)
    for k in range(3):
        blip(s, 16.4 + k * 0.5, hz(('G5', 'B5', 'D6')[k]), 0.07, 0.1)


def past(s, rng):
    """Five ways to meet the past, 4.4 seconds each from 2.4."""
    for k in range(5):
        t0 = 2.4 + k * 4.4
        if k:
            whoosh(s, t0 - 0.15, rng)
        typing(s, t0 + 0.3, (38, 56, 58, 64, 60)[k], 1000)
        blip(s, t0 + 1.6, 1568 if k < 4 else 330, 0.06, 0.1)
    for k in range(4):
        s.tone(3.1 + k * 0.7, 0.3, hz(('D4', 'G4', 'A4', 'G4')[k]), 0.06, 'tri', decay=0.2)
    for k in range(6):
        blip(s, 11.7 + k * 0.55, 1568, 0.04, 0.04)
    shimmer(s, 20.3, 3.4, rng, 0.022); ask(s, 23.8)


def press(s, rng):
    """Then and now: five questions, four seconds each from 2.2."""
    for k in range(5):
        t0 = 2.2 + k * 4.0
        ask(s, t0 + 0.3); typing(s, t0 + 0.5, (60, 50, 30, 70, 62)[k], 1000)
        thud(s, t0 + 0.9); thud(s, t0 + 1.5)
        shimmer(s, t0 + 2.1, 0.5, rng, 0.03); blip(s, t0 + 2.6, 1319, 0.06, 0.08)


EPISODES = {
    'inquiry-quest-past': (['U', 'C0', 'C1', 'C2', 'C3', 'C0', 'C1', 'C2', 'D0', 'D1', 'D2', 'D3'], 24.4, False, past,
                           30, ['', 'ld', 'ld', 'lbd', 'lbd']),
    'inquiry-quest-press': (['U', 'C0', 'D0', 'C1', 'D1', 'C2', 'D2', 'C3', 'D3', 'C0', 'D0'], 22.2, False, press, 28),
    'inquiry-quest-provenance': (['U', 'C0', 'C1', 'C2', 'D0', 'D1', 'D2', 'D3', 'D0', 'C3'], 19.0, False, provenance, 26),
    'inquiry-quest-seminar': (['U', 'D0', 'D1', 'D2', 'D3', 'C0', 'C1', 'C2', 'C3', 'C0'], 19.4, True, seminar, 26),
    'inquiry-quest-paths': (['U', 'D0', 'D1', 'D2', 'D3', 'C0', 'C1', 'C2', 'C3', 'C0'], 20.2, True, paths, 26),
    'inquiry-quest-moves': (['U', 'C0', 'C1', 'C2', 'C3', 'C0', 'C1', 'C2', 'C3', 'C0'], 20.2, True, moves, 26),
    'inquiry-quest-audit': (['U', 'D0', 'D1', 'C0', 'C1', 'D0', 'D1', 'C2', 'C3'], 19.4, True, audit, 26),
    'inquiry-quest-stages': (['T', 'A0', 'A1', 'A2', 'A3', 'A0', 'A1', 'A2', 'B0', 'B1', 'B2', 'B3'], 24.4, False, stages,
                             30, ['', 'ld', 'ld', 'lbd', 'lbd']),
    'inquiry-quest-questions': (['T', 'A0', 'A1', 'B0', 'B1', 'A2', 'A3', 'B2', 'B3', 'A0', 'A1'], 22.2, False, questions, 28),
    'inquiry-quest-ncss-1':  (['U', 'C0', 'C1', 'D0', 'D1', 'D2', 'D3', 'D0'], 15.2, False, ncss1),
    'inquiry-quest-ncss-2':  (['U', 'C0', 'D0', 'D1', 'C0', 'D0', 'C2', 'C3'], 15.0, True, ncss2),
    'inquiry-quest-ncss-3':  (['U', 'C0', 'C1', 'C2', 'C3', 'C0', 'C1', 'C3'], 14.8, True, ncss3),
    'inquiry-quest-nssla-1': (['T', 'A0', 'A1', 'A2', 'B0', 'B1', 'B3', 'B0'], 15.0, False, nssla1),
    'inquiry-quest-nssla-2': (['T', 'B0', 'B1', 'B3', 'A0', 'A1', 'A2', 'A3'], 15.0, True, nssla2),
    'inquiry-quest-nssla-3': (['T', 'A0', 'A1', 'A2', 'A3', 'A0', 'A1', 'A3'], 15.0, True, nssla3),
}


def episode(name, out_dir):
    bars, end, warm, events = EPISODES[name][:4]
    total = EPISODES[name][4] if len(EPISODES[name]) > 4 else 20
    layers = EPISODES[name][5] if len(EPISODES[name]) > 5 else []   # per-bar parts; missing bars play in full
    rng = random.Random(name)
    music, sfx, tail = Track(total), Track(total), Track(total)
    for i, key in enumerate(bars):
        bar(music, i * 2.0, key, layers[i] if i < len(layers) and layers[i] else 'lbad')
    music.gain(end - 0.1, end + 0.25, 1.0, 0.0)
    events(sfx, rng)
    ending(tail, end, warm, total, bars[0] == 'U')
    write_wav(os.path.join(out_dir, name + '.wav'), [music, sfx, tail], total)


# ---------- a quiet bed for the three earlier 18-second clips ----------
BEDS = {
    'how-a-student-meets-the-past': [('A3', 'C4', 'E4', 'B4'), ('F3', 'A3', 'C4', 'E4'), ('C3', 'G3', 'E4', 'G4'), ('E3', 'G3', 'B3', 'E4')],
    'twenty-eight-essays': [('D3', 'A3', 'D4', 'F4'), ('A#2', 'F3', 'A#3', 'D4'), ('F3', 'A3', 'C4', 'F4'), ('C3', 'G3', 'C4', 'E4')],
    'same-artifact-different-learning': [('E3', 'G3', 'B3', 'E4'), ('C3', 'G3', 'C4', 'E4'), ('G3', 'B3', 'D4', 'G4'), ('D3', 'A3', 'D4', 'F#4')],
}


def bed(name, out_dir):
    tr = Track(18)
    for c, chord in enumerate(BEDS[name]):
        t0 = c * 4.5
        for n in chord:
            tr.tone(t0, 4.9, hz(n), 0.04, 'sin', attack=0.9, release=1.2)
        for i in range(12):  # slow plucked arpeggio, up then down
            n = chord[(0, 1, 2, 3, 2, 1)[i % 6]]
            tr.tone(t0 + i * 0.375, 1.2, hz(n) * 2, 0.055, 'tri', attack=0.01, release=0.3, decay=0.35)
    write_wav(os.path.join(out_dir, name + '.wav'), [tr], 18, fade_out=1.6, gain=0.9)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    os.makedirs(sys.argv[1], exist_ok=True)
    for clip in EPISODES:
        episode(clip, sys.argv[1])
        print('wrote', clip + '.wav')
    for clip in BEDS:
        bed(clip, sys.argv[1])
        print('wrote', clip + '.wav')
