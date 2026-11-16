// ladder.js — SVG Ladders Renderer & Animated Climbing Sequence

import { getTileGridInfo } from './player.js';
import { sound } from './sound.js';

export const LADDERS = [
  { from: 4, to: 25, color: '#d97706', highlight: '#fde68a' },
  { from: 13, to: 46, color: '#b45309', highlight: '#fcd34d' },
  { from: 33, to: 49, color: '#d97706', highlight: '#fef08a' },
  { from: 42, to: 63, color: '#b45309', highlight: '#fde68a' },
  { from: 50, to: 69, color: '#d97706', highlight: '#fcd34d' },
  { from: 74, to: 92, color: '#b45309', highlight: '#fef08a' }
];

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  return el;
}

export class LadderManager {
  constructor(layerEl) {
    this.layerEl = layerEl;
    this.ladderEls = new Map();
    this.render();
  }

  getLadderAt(tileNum) {
    return LADDERS.find((l) => l.from === tileNum) || null;
  }

  render() {
    if (!this.layerEl) return;
    this.layerEl.innerHTML = '';
    this.ladderEls.clear();

    LADDERS.forEach((ladder, idx) => {
      const start = getTileGridInfo(ladder.from);
      const end = getTileGridInfo(ladder.to);

      const dx = end.svgX - start.svgX;
      const dy = end.svgY - start.svgY;
      const len = Math.hypot(dx, dy);

      // Perpendicular unit vector for ladder rail width
      const nx = (-dy / len) * 16;
      const ny = (dx / len) * 16;

      const group = createSvgEl('g', {
        class: 'ladder-group',
        id: `ladder-${ladder.from}-${ladder.to}`,
        filter: 'url(#softShadow)'
      });

      // Soft golden glow aura (activated while climbing)
      const aura = createSvgEl('line', {
        class: 'ladder-glow-aura',
        x1: start.svgX,
        y1: start.svgY,
        x2: end.svgX,
        y2: end.svgY,
        stroke: '#fde047',
        'stroke-width': 44,
        'stroke-linecap': 'round'
      });
      group.appendChild(aura);

      // Left & Right wooden rails
      const railLeft = createSvgEl('line', {
        x1: start.svgX - nx,
        y1: start.svgY - ny,
        x2: end.svgX - nx,
        y2: end.svgY - ny,
        stroke: ladder.color,
        'stroke-width': 9,
        'stroke-linecap': 'round'
      });
      const railRight = createSvgEl('line', {
        x1: start.svgX + nx,
        y1: start.svgY + ny,
        x2: end.svgX + nx,
        y2: end.svgY + ny,
        stroke: ladder.color,
        'stroke-width': 9,
        'stroke-linecap': 'round'
      });

      // Inner rail highlights
      const railLeftHi = createSvgEl('line', {
        x1: start.svgX - nx,
        y1: start.svgY - ny,
        x2: end.svgX - nx,
        y2: end.svgY - ny,
        stroke: ladder.highlight,
        'stroke-width': 3,
        'stroke-linecap': 'round',
        opacity: 0.75
      });
      const railRightHi = createSvgEl('line', {
        x1: start.svgX + nx,
        y1: start.svgY + ny,
        x2: end.svgX + nx,
        y2: end.svgY + ny,
        stroke: ladder.highlight,
        'stroke-width': 3,
        'stroke-linecap': 'round',
        opacity: 0.75
      });

      // Rungs spaced evenly every ~38 SVG units
      const rungCount = Math.max(4, Math.floor(len / 38));
      const rungsGroup = createSvgEl('g');
      for (let i = 1; i < rungCount; i++) {
        const t = i / rungCount;
        const cx = start.svgX + dx * t;
        const cy = start.svgY + dy * t;
        const rung = createSvgEl('line', {
          x1: cx - nx * 0.95,
          y1: cy - ny * 0.95,
          x2: cx + nx * 0.95,
          y2: cy + ny * 0.95,
          stroke: '#f59e0b',
          'stroke-width': 6.5,
          'stroke-linecap': 'round'
        });
        const rungHi = createSvgEl('line', {
          x1: cx - nx * 0.85,
          y1: cy - ny * 0.85,
          x2: cx + nx * 0.85,
          y2: cy + ny * 0.85,
          stroke: '#fef3c7',
          'stroke-width': 2.2,
          'stroke-linecap': 'round'
        });
        rungsGroup.appendChild(rung);
        rungsGroup.appendChild(rungHi);
      }

      group.appendChild(rungsGroup);
      group.appendChild(railLeft);
      group.appendChild(railRight);
      group.appendChild(railLeftHi);
      group.appendChild(railRightHi);

      this.layerEl.appendChild(group);
      this.ladderEls.set(ladder.from, { ladder, group, idx });
    });
  }

  async animateClimb(player, ladder, particles) {
    const entry = this.ladderEls.get(ladder.from);
    const start = getTileGridInfo(ladder.from);
    const end = getTileGridInfo(ladder.to);

    if (entry) {
      entry.group.classList.add('is-active');
    }

    sound.playLadderClimb();

    if (player.element) {
      player.element.classList.add('is-climbing', 'is-active-turn');
    }

    const totalMs = 1250;
    const startTime = performance.now();

    await new Promise((resolve) => {
      const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / totalMs);
        // Subtle rhythmic climb stepping curve
        const steppedT = t + Math.sin(t * Math.PI * 8) * 0.014;
        const clampedT = Math.max(0, Math.min(1, steppedT));

        const curLeft = start.leftPct + (end.leftPct - start.leftPct) * clampedT;
        const curTop = start.topPct + (end.topPct - start.topPct) * clampedT;
        player.setBoardPercent(curLeft, curTop, true);

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });

    player.position = ladder.to;
    player.setBoardPercent(end.leftPct, end.topPct, false);

    if (player.element) {
      player.element.classList.remove('is-climbing');
    }
    if (entry) {
      entry.group.classList.remove('is-active');
    }

    if (particles) {
      particles.burstPercent(end.leftPct, end.topPct, 'gold', 28);
    }

    await new Promise((r) => setTimeout(r, 260));
  }
}
