// dice.js — Physics-Driven 3D Flying & Bouncing Dice Engine

import { sound } from './sound.js';

const PIP_LAYOUTS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8]
};

const TARGET_FACE_ROTATION = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 0, y: 180 }
};

export function renderPipsInto(el, value) {
  if (!el) return;
  const active = new Set(PIP_LAYOUTS[value] || PIP_LAYOUTS[1]);
  el.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('span');
    if (active.has(i)) {
      cell.className = 'dice-pip';
    }
    el.appendChild(cell);
  }
}

export class DiceController {
  constructor() {
    this.overlay = document.getElementById('dice-board-overlay');
    this.wrapper = document.getElementById('flying-dice-wrapper');
    this.cube = document.getElementById('dice-cube');
    this.shadow = document.getElementById('dice-shadow');
    this.miniFace = document.getElementById('mini-dice-face');
    this.lastRollValue = document.getElementById('last-roll-value');

    this._initFaces();
    renderPipsInto(this.miniFace, 6);
  }

  _initFaces() {
    if (!this.cube) return;
    for (let f = 1; f <= 6; f++) {
      const faceEl = this.cube.querySelector(`.face-${f}`);
      renderPipsInto(faceEl, f);
    }
  }

  async roll() {
    const result = Math.floor(Math.random() * 6) + 1;
    sound.playDiceThrow();

    // Reset previous animation states cleanly
    this.wrapper.classList.remove('is-rolling', 'is-result-pop');
    this.shadow.classList.remove('is-rolling');
    this.cube.classList.remove('is-rolling', 'is-settled');
    void this.cube.offsetWidth;

    const target = TARGET_FACE_ROTATION[result];
    const dirX = Math.random() < 0.5 ? 1 : -1;
    const dirY = Math.random() < 0.5 ? 1 : -1;
    const spinTurnsX = (2 + Math.floor(Math.random() * 2)) * dirX;
    const spinTurnsY = (2 + Math.floor(Math.random() * 2)) * dirY;

    const rx0 = Math.round((Math.random() - 0.5) * 90);
    const ry0 = Math.round((Math.random() - 0.5) * 90);
    const rz0 = Math.round((Math.random() - 0.5) * 50);

    const endRotX = spinTurnsX * 360 + target.x;
    const endRotY = spinTurnsY * 360 + target.y;

    // Randomized intermediate X/Y angles for natural unpredictable 3D tumble
    const rx1 = Math.round(rx0 + (endRotX - rx0) * 0.34 + (Math.random() - 0.5) * 70);
    const ry1 = Math.round(ry0 + (endRotY - ry0) * 0.34 + (Math.random() - 0.5) * 70);
    const rz1 = Math.round((Math.random() < 0.5 ? 1 : -1) * (30 + Math.random() * 40));

    const rx2 = Math.round(rx0 + (endRotX - rx0) * 0.72 + (Math.random() - 0.5) * 45);
    const ry2 = Math.round(ry0 + (endRotY - ry0) * 0.72 + (Math.random() - 0.5) * 45);
    const rz2 = Math.round((Math.random() < 0.5 ? -1 : 1) * (15 + Math.random() * 20));

    const rx3 = Math.round(endRotX + (Math.random() - 0.5) * 18);
    const ry3 = Math.round(endRotY + (Math.random() - 0.5) * 18);

    this.cube.style.setProperty('--rx-0', `${rx0}deg`);
    this.cube.style.setProperty('--ry-0', `${ry0}deg`);
    this.cube.style.setProperty('--rz-0', `${rz0}deg`);
    this.cube.style.setProperty('--rx-1', `${rx1}deg`);
    this.cube.style.setProperty('--ry-1', `${ry1}deg`);
    this.cube.style.setProperty('--rz-1', `${rz1}deg`);
    this.cube.style.setProperty('--rx-2', `${rx2}deg`);
    this.cube.style.setProperty('--ry-2', `${ry2}deg`);
    this.cube.style.setProperty('--rz-2', `${rz2}deg`);
    this.cube.style.setProperty('--rx-3', `${rx3}deg`);
    this.cube.style.setProperty('--ry-3', `${ry3}deg`);
    this.cube.style.setProperty('--rx-end', `${endRotX}deg`);
    this.cube.style.setProperty('--ry-end', `${endRotY}deg`);

    this.overlay.classList.add('is-visible');

    // Trigger CSS keyframe animations for jump, shadow, and 3D X/Y tumble
    this.wrapper.classList.add('is-rolling');
    this.shadow.classList.add('is-rolling');
    this.cube.classList.add('is-rolling');

    // Randomize HUD dice preview during flight
    const shuffleInterval = window.setInterval(() => {
      const randVal = Math.floor(Math.random() * 6) + 1;
      renderPipsInto(this.miniFace, randVal);
      if (this.lastRollValue) this.lastRollValue.textContent = String(randVal);
    }, 68);

    // Synchronize bounce impact audio with CSS keyframe impact points (44%, 68%, 86% of 1180ms)
    const tBounce1 = window.setTimeout(() => sound.playDiceBounce(1.0), 515);
    const tBounce2 = window.setTimeout(() => sound.playDiceBounce(0.62), 800);
    const tBounce3 = window.setTimeout(() => sound.playDiceBounce(0.32), 1015);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 120 : 1180));

    clearInterval(shuffleInterval);
    clearTimeout(tBounce1);
    clearTimeout(tBounce2);
    clearTimeout(tBounce3);

    // Transition to settled bounce effect on dice-cube
    this.wrapper.classList.remove('is-rolling');
    this.shadow.classList.remove('is-rolling');
    this.cube.classList.remove('is-rolling');
    void this.cube.offsetWidth;

    this.cube.style.transform = `rotateX(${endRotX}deg) rotateY(${endRotY}deg)`;
    this.cube.classList.add('is-settled');
    this.wrapper.classList.add('is-result-pop');

    renderPipsInto(this.miniFace, result);
    if (this.lastRollValue) this.lastRollValue.textContent = String(result);

    await new Promise((r) => setTimeout(r, reducedMotion ? 160 : 500));
    this.overlay.classList.remove('is-visible');
    this.cube.classList.remove('is-settled');
    this.wrapper.classList.remove('is-result-pop');

    return result;
  }
}
