import { COLOR_SHIFT_KEYFRAMES } from '../constants/colors';

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

export function getColorForProgress(progress: number): { ring: string; bg: string } {
  const kf = COLOR_SHIFT_KEYFRAMES;
  const clamped = Math.max(0, Math.min(progress, kf[kf.length - 1].progress));

  for (let i = 0; i < kf.length - 1; i++) {
    if (clamped >= kf[i].progress && clamped <= kf[i + 1].progress) {
      const t = (clamped - kf[i].progress) / (kf[i + 1].progress - kf[i].progress);
      return {
        ring: lerpColor(kf[i].ring, kf[i + 1].ring, t),
        bg: lerpColor(kf[i].bg, kf[i + 1].bg, t),
      };
    }
  }

  return { ring: kf[kf.length - 1].ring, bg: kf[kf.length - 1].bg };
}
