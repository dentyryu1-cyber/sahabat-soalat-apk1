// snake.js — Expressive Cartoon SVG Snakes & Interactive Eat/Slide Sequence

import { getTileGridInfo } from './player.js';
import { sound } from './sound.js';

export const SNAKES = [
  { head: 27, tail: 5, body: '#10b981', belly: '#a7f3d0', spot: '#047857' },
  { head: 40, tail: 3, body: '#f59e0b', belly: '#fef3c7', spot: '#b45309' },
  { head: 43, tail: 18, body: '#fb7185', belly: '#ffe4e6', spot: '#be123c' },
  { head: 54, tail: 31, body: '#14b8a6', belly: '#ccfbf1', spot: '#0f766e' },
  { head: 66, tail: 45, body: '#eab308', belly: '#fef9c3', spot: '#a16207' },
  { head: 89, tail: 53, body: '#8b5cf6', belly: '#ede9fe', spot: '#5b21b6' },
  { head: 97, tail: 78, body: '#0ea5e9', belly: '#e0f2fe', spot: '#0369a1' }
];

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  return el;
}

function buildWavyPath(hx, hy, tx, ty, index) {
  const dx = tx - hx;
  const dy = ty - hy;
  const len = Math.hypot(dx, dy) || 1;
  // Normal perpendicular vector for S-curves
  const nx = -dy / len;
  const ny = dx / len;
  const amp = Math.min(72, Math.max(36, len * 0.22)) * (index % 2 === 0 ? 1 : -1);

  const p1x = hx + dx * 0.28 + nx * amp;
  const p1y = hy + dy * 0.28 + ny * amp;
  const p2x = hx + dx * 0.68 - nx * amp;
  const p2y = hy + dy * 0.68 - ny * amp;

  return `M ${hx} ${hy} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${tx} ${ty}`;
}

export class SnakeManager {
  constructor(layerEl) {
    this.layerEl = layerEl;
    this.snakeEls = new Map();
    this.render();
  }

  getSnakeAt(tileNum) {
    return SNAKES.find((s) => s.head === tileNum) || null;
  }

  render() {
    if (!this.layerEl) return;
    this.layerEl.innerHTML = '';
    this.snakeEls.clear();

    SNAKES.forEach((snake, idx) => {
      const h = getTileGridInfo(snake.head);
      const t = getTileGridInfo(snake.tail);
      const pathD = buildWavyPath(h.svgX, h.svgY, t.svgX, t.svgY, idx);

      const group = createSvgEl('g', {
        class: 'snake-group',
        id: `snake-${snake.head}-${snake.tail}`,
        filter: 'url(#softShadow)'
      });

      const bodyGroup = createSvgEl('g', { class: 'snake-body-path' });

      // Dark outline for 2D cartoon crispness
      const outlinePath = createSvgEl('path', {
        d: pathD,
        fill: 'none',
        stroke: '#022c22',
        'stroke-width': 32,
        'stroke-linecap': 'round',
        opacity: 0.72
      });

      // Main colored body
      const mainPath = createSvgEl('path', {
        d: pathD,
        fill: 'none',
        stroke: snake.body,
        'stroke-width': 25,
        'stroke-linecap': 'round'
      });

      // Playful cartoon belly dashes
      const patternPath = createSvgEl('path', {
        d: pathD,
        fill: 'none',
        stroke: snake.belly,
        'stroke-width': 10,
        'stroke-linecap': 'round',
        'stroke-dasharray': '10 18',
        opacity: 0.85
      });

      // Tapered cute tail tip
      const tailTip = createSvgEl('circle', {
        cx: t.svgX,
        cy: t.svgY,
        r: 9,
        fill: snake.spot,
        stroke: '#ffffff',
        'stroke-width': 2
      });

      // Bulge circle that slides down the body during swallowing
      const bulge = createSvgEl('circle', {
        class: 'snake-swallow-bulge',
        cx: h.svgX,
        cy: h.svgY,
        r: 22,
        fill: snake.body,
        stroke: snake.belly,
        'stroke-width': 4
      });

      bodyGroup.appendChild(outlinePath);
      bodyGroup.appendChild(mainPath);
      bodyGroup.appendChild(patternPath);
      bodyGroup.appendChild(tailTip);
      bodyGroup.appendChild(bulge);
      group.appendChild(bodyGroup);

      // Cute Expressive Snake Head
      const headGroup = createSvgEl('g', {
        class: 'snake-head-group',
        transform: `translate(${h.svgX}, ${h.svgY})`
      });

      // Forked tongue (behind lower jaw)
      const tongue = createSvgEl('path', {
        class: 'snake-tongue',
        d: 'M -3 16 L 0 34 L -5 41 M 0 34 L 5 41',
        fill: 'none',
        stroke: '#f43f5e',
        'stroke-width': 3.5,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });

      // Mouth interior cavity (visible when open)
      const mouthCavity = createSvgEl('ellipse', {
        class: 'snake-mouth-cavity',
        cx: 0,
        cy: 11,
        rx: 17,
        ry: 13,
        fill: '#881337',
        stroke: '#4c0519',
        'stroke-width': 2
      });

      // Lower jaw that drops open
      const lowerJaw = createSvgEl('path', {
        class: 'snake-jaw-lower',
        d: 'M -17 6 Q 0 24 17 6 Q 15 20 0 21 Q -15 20 -17 6 Z',
        fill: snake.belly,
        stroke: '#022c22',
        'stroke-width': 2.5
      });

      // Upper cute cartoon head dome
      const headShape = createSvgEl('path', {
        d: 'M -22 2 C -24 -22, 24 -22, 22 2 C 22 14, -22 14, -22 2 Z',
        fill: snake.body,
        stroke: '#022c22',
        'stroke-width': 2.8
      });

      // Cute round cheeks
      const cheekL = createSvgEl('circle', { cx: -14, cy: 3, r: 4, fill: '#fda4af', opacity: 0.7 });
      const cheekR = createSvgEl('circle', { cx: 14, cy: 3, r: 4, fill: '#fda4af', opacity: 0.7 });

      // Big Goofy Cartoon Eyes
      const eyeL = createSvgEl('circle', { cx: -9, cy: -8, r: 7.5, fill: '#ffffff', stroke: '#022c22', 'stroke-width': 2 });
      const eyeR = createSvgEl('circle', { cx: 9, cy: -8, r: 7.5, fill: '#ffffff', stroke: '#022c22', 'stroke-width': 2 });

      const pupilL = createSvgEl('circle', { class: 'snake-eye-pupil', cx: -8.5, cy: -7.5, r: 3.8, fill: '#0f172a' });
      const pupilR = createSvgEl('circle', { class: 'snake-eye-pupil', cx: 8.5, cy: -7.5, r: 3.8, fill: '#0f172a' });

      const glintL = createSvgEl('circle', { cx: -7, cy: -9, r: 1.5, fill: '#ffffff' });
      const glintR = createSvgEl('circle', { cx: 10, cy: -9, r: 1.5, fill: '#ffffff' });

      // Tiny friendly fangs visible inside open mouth
      const fangL = createSvgEl('polygon', {
        class: 'snake-mouth-cavity',
        points: '-9,10 -6,17 -3,10',
        fill: '#ffffff'
      });
      const fangR = createSvgEl('polygon', {
        class: 'snake-mouth-cavity',
        points: '3,10 6,17 9,10',
        fill: '#ffffff'
      });

      headGroup.appendChild(tongue);
      headGroup.appendChild(mouthCavity);
      headGroup.appendChild(fangL);
      headGroup.appendChild(fangR);
      headGroup.appendChild(lowerJaw);
      headGroup.appendChild(headShape);
      headGroup.appendChild(cheekL);
      headGroup.appendChild(cheekR);
      headGroup.appendChild(eyeL);
      headGroup.appendChild(eyeR);
      headGroup.appendChild(pupilL);
      headGroup.appendChild(pupilR);
      headGroup.appendChild(glintL);
      headGroup.appendChild(glintR);

      group.appendChild(headGroup);
      this.layerEl.appendChild(group);

      this.snakeEls.set(snake.head, {
        snake,
        group,
        mainPath,
        bulge,
        headPos: h,
        tailPos: t
      });
    });
  }

  async animateEat(player, snake, particles) {
    const entry = this.snakeEls.get(snake.head);
    const tailInfo = getTileGridInfo(snake.tail);
    const headInfo = getTileGridInfo(snake.head);

    if (!entry) {
      player.position = snake.tail;
      player.setBoardPercent(tailInfo.leftPct, tailInfo.topPct);
      return;
    }

    const { group, mainPath, bulge } = entry;

    // 1. Eyes move/blink + 2. Lift head + 4. Tongue flicks
    sound.playSnakeHiss();
    group.classList.add('is-alert');
    await new Promise((r) => setTimeout(r, 340));

    // 3. Open mouth wide
    group.classList.add('is-mouth-open', 'is-eating');
    await new Promise((r) => setTimeout(r, 260));

    // 5. Cartoon swallow: player shrinks into snake mouth
    sound.playSnakeGulp();
    if (player.element) {
      player.setBoardPercent(headInfo.leftPct, headInfo.topPct - 1.2);
      player.element.classList.add('is-swallowed');
    }
    await new Promise((r) => setTimeout(r, 420));

    // 6. Player disappears temporarily inside snake
    if (player.element) {
      player.element.style.opacity = '0';
    }
    group.classList.remove('is-mouth-open');
    group.classList.add('is-digesting');

    // Travel bulge down the wavy snake body
    const pathLen = mainPath.getTotalLength();
    const slideMs = 820;
    const startTime = performance.now();

    await new Promise((resolve) => {
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / slideMs);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const pt = mainPath.getPointAtLength(pathLen * eased);
        bulge.setAttribute('cx', pt.x.toFixed(1));
        bulge.setAttribute('cy', pt.y.toFixed(1));

        // Keep hidden token synced with tail
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });

    // 7. Snake returns to normal resting pose
    group.classList.remove('is-digesting', 'is-eating', 'is-alert');

    // 8. Player pops out at snake tail!
    player.position = snake.tail;
    player.setBoardPercent(tailInfo.leftPct, tailInfo.topPct, true);
    if (player.element) {
      player.element.classList.remove('is-swallowed');
      player.element.style.opacity = '1';
      player.element.classList.add('is-popping-out');
    }

    if (particles) {
      particles.burstPercent(tailInfo.leftPct, tailInfo.topPct, 'emerald', 22);
    }

    await new Promise((r) => setTimeout(r, 460));
    if (player.element) {
      player.element.classList.remove('is-popping-out');
    }
  }
}
