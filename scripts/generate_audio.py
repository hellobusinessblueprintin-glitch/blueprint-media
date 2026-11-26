#!/usr/bin/env python3
"""
Synthesises the background score and sound effects for the RavanaCurses Short.

    python3 scripts/generate_audio.py

Writes:
  public/music/ravana-score.mp3   92s score (tanpura drone in D, low pad, dhol/taiko groove)
  public/sfx/*.wav                one-shot SFX

Everything is generated from maths (no samples), so it's royalty-free and reproducible.
The score's section boundaries mirror RAVANA_BEATS in src/data/ravanaScript.ts —
if you retime the beats there, update SECTIONS below and re-run.
"""
import os
import subprocess
import wave

import numpy as np

SR = 44100
ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
rng = np.random.default_rng(108)


def write(path, x, stereo=False):
    x = np.asarray(x, dtype=np.float64)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * 0.9
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        data = (x.T if stereo else x)
        w.writeframes((data * 32767).astype("<i2").tobytes())
    print("wrote", os.path.relpath(path), f"{x.shape[-1] / SR:.2f}s")


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def lowpass(x, cutoff):
    """One-pole low-pass (cutoff may be scalar or per-sample array)."""
    a = np.exp(-2 * np.pi * np.broadcast_to(cutoff, x.shape) / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def lp_fast(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    # vectorised via cumulative trick is unstable; use simple loop in chunks
    y = np.empty_like(x)
    acc = 0.0
    b = 1 - a
    for i in range(len(x)):
        acc = b * x[i] + a * acc
        y[i] = acc
    return y


def env_exp(t, attack, decay):
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


# ------------------------------------------------------------------ instruments
def tanpura_pluck(f, dur=3.2, bright=1.0):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for n in range(1, 24):
        # jawari: higher partials bloom slightly later, giving the buzzing shimmer
        bloom = np.minimum(1, t / (0.05 + 0.012 * n)) * np.exp(-t / (2.6 / (1 + n * 0.06)))
        amp = (1 / n) * (1 + 0.6 * np.sin(2 * np.pi * (0.7 + n * 0.13) * t)) * bright
        x += amp * bloom * np.sin(2 * np.pi * f * n * t * (1 + 0.0004 * n))
    return x * env_exp(t, 0.004, 1.8)


def drum_low(dur=0.9, f0=95, f1=48, decay=0.32):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env_exp(t, 0.002, decay)
    click = rng.uniform(-1, 1, len(t)) * env_exp(t, 0.0005, 0.012) * 0.5
    return body + click


def drum_tak(dur=0.25):
    t = t_axis(dur)
    n = rng.uniform(-1, 1, len(t))
    n = n - lp_fast(n, 900)  # crude high-pass
    tone = np.sin(2 * np.pi * 330 * t) * 0.6
    return (n * 0.8 + tone) * env_exp(t, 0.001, 0.05)


def bell(f, dur=4.0, decay=1.6):
    t = t_axis(dur)
    partials = [(1, 1), (2.76, 0.5), (5.4, 0.25), (8.93, 0.12), (0.5, 0.3)]
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * (1 + r * 0.4) / decay) for r, a in partials)
    return x * np.minimum(1, t / 0.002)


def place(buf, clip, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i] * gain


# ------------------------------------------------------------------ score
SECTIONS = [  # (start, end, name) — mirror of RAVANA_BEATS
    (0.0, 10.9, "hook"),
    (10.9, 28.8, "nandi"),
    (28.8, 47.9, "vedavati"),
    (47.9, 67.4, "nalakuvara"),
    (67.4, 82.4, "anaranya"),
    (82.4, 92.0, "payoff"),
]
DUR = 92.0
BPM = 84
BEAT = 60 / BPM

SA, PA, SA_LO = 146.83, 110.0, 73.42  # D3, A2, D2


def score():
    n = int(DUR * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    # 1) Tanpura drone throughout: Pa Sa Sa Sa_lo, one cycle every 2.4s
    cyc = 2.4
    k = 0
    while k * cyc < DUR:
        base = k * cyc
        for off, f in [(0, PA), (0.6, SA), (1.2, SA), (1.8, SA_LO)]:
            p = tanpura_pluck(f, bright=0.9)
            place(L, p, base + off, 0.55)
            place(R, p, base + off + 0.012, 0.5)
        k += 1

    # 2) Low pad (D + A), intensity follows the story
    t = np.arange(n) / SR
    inten = np.interp(
        t,
        [0, 10.9, 11.5, 21.6, 28.8, 29.5, 38.3, 45.5, 47.9, 48.5, 61.3, 67.4, 68, 80.7, 82.4, 85.6, 91, 92],
        [0.35, 0.5, 0.55, 0.8, 0.6, 0.45, 0.85, 0.5, 0.55, 0.6, 0.9, 0.6, 0.55, 1.0, 0.9, 1.0, 0.7, 0.0],
    )
    saw = np.zeros(n)
    for f, a in [(SA_LO, 1.0), (SA_LO * 1.5, 0.6), (SA_LO * 0.5, 0.7)]:
        for h in range(1, 9):
            saw += a / h * np.sin(2 * np.pi * f * h * t * (1 + 0.0015 * np.sin(0.3 * t)))
    pad = lp_fast(saw, 420) * inten * 0.22
    L += pad
    R += pad * 0.95

    # 3) Percussion per section
    def bars(start, end):
        b = start
        while b < end - 0.05:
            yield b
            b += BEAT * 4

    low = drum_low()
    big = drum_low(dur=2.2, f0=80, f1=38, decay=0.9)
    tak = drum_tak()
    for s, e, name in SECTIONS:
        place(L, big, s, 1.0)
        place(R, big, s, 1.0)
        for bar in bars(s, e):
            if name == "hook":  # heartbeat
                for o, g in [(0, 0.5), (0.28, 0.35)]:
                    place(L, low, bar + o, g)
                    place(R, low, bar + o, g)
            elif name == "nandi":  # dhol groove
                for o, g in [(0, 0.8), (1.5, 0.5), (2, 0.8)]:
                    place(L, low, bar + o * BEAT, g)
                    place(R, low, bar + o * BEAT, g)
                for o in [1, 2.5, 3]:
                    place(L, tak, bar + o * BEAT, 0.35)
                    place(R, tak, bar + o * BEAT + 0.004, 0.35)
            elif name == "vedavati":  # sparse, devotional; roll under the fire
                place(L, low, bar, 0.55)
                place(R, low, bar, 0.55)
                if 38.3 <= bar < 45.5:
                    for o in np.arange(0, 4, 0.5):
                        place(L, low, bar + o * BEAT, 0.45)
                        place(R, tak, bar + o * BEAT + 0.12, 0.25)
            elif name == "nalakuvara":  # tense 8ths
                for o in np.arange(0, 4, 0.5):
                    acc = 0.8 if o in (0, 2) else 0.4
                    if 61.0 <= bar + o * BEAT < 61.9:  # silence right after the hit
                        continue
                    place(L, low, bar + o * BEAT, acc * 0.8)
                    place(R, low, bar + o * BEAT, acc * 0.8)
                for o in [1, 3]:
                    place(L, tak, bar + o * BEAT, 0.4)
                    place(R, tak, bar + o * BEAT, 0.4)
            elif name == "anaranya":  # march building to the hero reveal
                for o in range(4):
                    place(L, low, bar + o * BEAT, 0.7)
                    place(R, low, bar + o * BEAT, 0.7)
                if bar > 75:
                    for o in np.arange(0, 4, 0.25):
                        place(L, tak, bar + o * BEAT, 0.22)
                        place(R, tak, bar + o * BEAT, 0.22)
            elif name == "payoff":
                if bar < 89:
                    for o in [0, 2]:
                        place(L, low, bar + o * BEAT, 0.7)
                        place(R, low, bar + o * BEAT, 0.7)

    # Big accents on the dramatic hits
    for at in [21.6, 45.5, 61.3, 80.7, 85.6]:
        place(L, big, at, 0.9)
        place(R, big, at, 0.9)
    # Temple bells on the reveals
    for at, f in [(45.6, SA * 2), (80.7, SA * 2), (85.6, PA * 4)]:
        b = bell(f)
        place(L, b, at, 0.35)
        place(R, b, at + 0.01, 0.35)

    # Gentle fade in / out for the loop seam
    fade = np.ones(n)
    fi, fo = int(0.3 * SR), int(1.2 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo)
    return np.vstack([L * fade, R * fade])


# ------------------------------------------------------------------ SFX
def sfx_chain_lock():
    t = t_axis(0.9)
    metal = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in [(620, 1, 9), (1710, 0.6, 12), (2930, 0.4, 16), (4120, 0.3, 22)])
    rattle = rng.uniform(-1, 1, len(t)) * np.exp(-t * 25) * 0.8
    clunk = drum_low(0.9, 160, 70, 0.08) * 0.8
    return metal * np.minimum(1, t / 0.001) + rattle + clunk


def sfx_thud():
    return drum_low(1.4, 110, 35, 0.35) + 0.3 * lp_fast(rng.uniform(-1, 1, int(1.4 * SR)), 300) * env_exp(t_axis(1.4), 0.002, 0.25)


def sfx_fire(dur=7.5):
    t = t_axis(dur)
    roar = lp_fast(rng.uniform(-1, 1, len(t)), 500) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t) ** 2)
    pops = np.zeros(len(t))
    for _ in range(int(dur * 22)):
        at = rng.uniform(0, dur - 0.05)
        i = int(at * SR)
        ln = int(0.012 * SR)
        pops[i : i + ln] += rng.uniform(-1, 1, ln) * np.exp(-np.arange(ln) / (ln / 4)) * rng.uniform(0.3, 1)
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 0.8)
    return (roar * 2.2 + pops) * env


def sfx_shimmer():
    t = t_axis(2.2)
    x = np.zeros_like(t)
    notes = [SA * 4, SA * 4 * 9 / 8, SA * 4 * 5 / 4, SA * 4 * 3 / 2, SA * 8, SA * 8 * 9 / 8]
    for i, f in enumerate(notes):
        place(x, bell(f, 1.6, 0.5), i * 0.09, 0.5)
    return x


def sfx_zap():
    t = t_axis(0.8)
    f = 90 + 60 * rng.standard_normal(len(t)).cumsum() / np.sqrt(SR) * 40
    ph = 2 * np.pi * np.cumsum(np.abs(f) + 60) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    crackle = rng.uniform(-1, 1, len(t)) * (rng.uniform(0, 1, len(t)) > 0.97)
    return (saw * 0.6 + crackle) * env_exp(t, 0.002, 0.25) + sfx_thud()[: len(t)] * 0.7


def sfx_alarm():
    t = t_axis(0.9)
    tone = np.where((t % 0.3) < 0.15, np.sin(2 * np.pi * 880 * t), np.sin(2 * np.pi * 660 * t))
    gate = ((t % 0.15) < 0.12).astype(float)
    return tone * gate * np.minimum(1, (0.9 - t) / 0.1)


def sfx_chime():
    return bell(SA * 4, 2.5, 0.9)


def sfx_gong():
    t = t_axis(5.0)
    x = sum(a * np.sin(2 * np.pi * f * t + 3 * np.sin(2 * np.pi * 0.5 * t)) * np.exp(-t / d) for f, a, d in [(98, 1, 2.5), (196.5, 0.6, 1.8), (311, 0.5, 1.4), (467, 0.3, 1.0), (741, 0.2, 0.7)])
    return x * np.minimum(1, t / 0.01) + drum_low(5.0, 70, 40, 0.6) * 0.5


def sfx_pop():
    t = t_axis(0.5)
    f = 400 + 900 * np.exp(-t * 30)
    pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(t, 0.001, 0.06)
    return pop + bell(1320, 0.5, 0.25) * 0.4


def sfx_riser(dur=1.6):
    t = t_axis(dur)
    n = rng.uniform(-1, 1, len(t))
    cut = 200 + 7000 * (t / dur) ** 2
    out = np.zeros_like(n)
    acc = 0.0
    for i in range(len(n)):
        a = np.exp(-2 * np.pi * cut[i] / SR)
        acc = (1 - a) * n[i] + a * acc
        out[i] = acc
    tone = np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / dur) ** 2) / SR) * 0.3
    return (out * 3 + tone) * (t / dur) ** 1.5


def sfx_swish():
    t = t_axis(0.6)
    n = rng.uniform(-1, 1, len(t))
    band = lp_fast(n, 2500) - lp_fast(n, 600)
    return band * np.sin(np.pi * np.minimum(t / 0.5, 1)) ** 2


if __name__ == "__main__":
    wav = os.path.join(ROOT, "music", "ravana-score.wav")
    write(wav, score(), stereo=True)
    # Compress to MP3 with Remotion's bundled ffmpeg (16 MB WAV -> ~2 MB).
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-c:a", "libmp3lame", "-b:a", "192k", wav[:-4] + ".mp3"],
        check=True,
    )
    os.remove(wav)
    for name, fn in [
        ("chain-lock", sfx_chain_lock),
        ("thud", sfx_thud),
        ("fire", sfx_fire),
        ("shimmer", sfx_shimmer),
        ("zap", sfx_zap),
        ("alarm", sfx_alarm),
        ("chime", sfx_chime),
        ("gong", sfx_gong),
        ("pop", sfx_pop),
        ("riser", sfx_riser),
        ("swish", sfx_swish),
    ]:
        write(os.path.join(ROOT, "sfx", f"{name}.wav"), fn())
