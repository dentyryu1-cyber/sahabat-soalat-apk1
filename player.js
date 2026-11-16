// player.js — Player State, Board Coordinate Math & Animated 2D Cartoon SVG Avatars

export const AVATAR_CATALOG = [
  {
    id: 'ahmad',
    label: 'Ahmad',
    color: '#059669',
    accent: '#fbbf24',
    type: 'boy-peci'
  },
  {
    id: 'aisyah',
    label: 'Aisyah',
    color: '#d97706',
    accent: '#fef3c7',
    type: 'girl-hijab'
  },
  {
    id: 'umar',
    label: 'Umar',
    color: '#0284c7',
    accent: '#fde68a',
    type: 'boy-kopiah'
  },
  {
    id: 'fatimah',
    label: 'Fatimah',
    color: '#db2777',
    accent: '#fce7f3',
    type: 'girl-hijab-flower'
  },
  {
    id: 'zaid',
    label: 'Zaid',
    color: '#7c3aed',
    accent: '#ddd6fe',
    type: 'boy-glasses'
  },
  {
    id: 'khadijah',
    label: 'Khadijah',
    color: '#0d9488',
    accent: '#ccfbf1',
    type: 'girl-hijab-star'
  }
];

export function buildAvatarSVG(avatarId, includeLimbs = true) {
  const av = AVATAR_CATALOG.find((a) => a.id === avatarId) || AVATAR_CATALOG[0];
  const skin = '#f7cba4';
  const skinShadow = '#e6af82';
  const c = av.color;
  const ac = av.accent;

  const isGirl = av.type.startsWith('girl');
  const hasGlasses = av.type === 'boy-glasses';
  const hasFlower = av.type === 'girl-hijab-flower';
  const hasStar = av.type === 'girl-hijab-star';

  return `
    <svg viewBox="0 0 80 88" class="token-avatar-svg" aria-hidden="true">
      <defs>
        <filter id="avShadow-${av.id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#022c22" flood-opacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#avShadow-${av.id})">
        ${
          includeLimbs
            ? `
          <!-- Legs -->
          <g class="avatar-leg-left" style="transform-origin: 33px 64px;">
            <rect x="28" y="64" width="9" height="16" rx="4.5" fill="#1e293b" />
            <ellipse cx="32.5" cy="80" rx="6" ry="3.5" fill="#78350f" />
          </g>
          <g class="avatar-leg-right" style="transform-origin: 47px 64px;">
            <rect x="43" y="64" width="9" height="16" rx="4.5" fill="#1e293b" />
            <ellipse cx="47.5" cy="80" rx="6" ry="3.5" fill="#78350f" />
          </g>
          <!-- Arms -->
          <g class="avatar-arm-left" style="transform-origin: 24px 48px;">
            <path d="M24 48 Q14 55 16 63" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none" />
            <circle cx="16" cy="64" r="4.5" fill="${skin}" />
          </g>
          <g class="avatar-arm-right" style="transform-origin: 56px 48px;">
            <path d="M56 48 Q66 55 64 63" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none" />
            <circle cx="64" cy="64" r="4.5" fill="${skin}" />
          </g>`
            : ''
        }

        <!-- Torso / Baju -->
        <rect x="23" y="42" width="34" height="27" rx="12" fill="${c}" stroke="#ffffff" stroke-width="2" />
        <path d="M35 44 L40 53 L45 44" fill="${ac}" opacity="0.9" />

        ${
          isGirl
            ? `
          <!-- Hijab Outer Hood -->
          <path d="M18 32 C18 11, 62 11, 62 32 L64 49 Q40 56 16 49 Z" fill="${c}" stroke="#ffffff" stroke-width="2" />
          <path d="M24 31 C24 17, 56 17, 56 31 C56 42, 48 45, 40 45 C32 45, 24 42, 24 31 Z" fill="${ac}" opacity="0.35" />
        `
            : ''
        }

        <!-- Face -->
        <circle cx="40" cy="29" r="15.5" fill="${skin}" stroke="${skinShadow}" stroke-width="1.2" />

        <!-- Rosy Cheeks -->
        <ellipse cx="30.5" cy="33" rx="3" ry="1.8" fill="#fb7185" opacity="0.55" />
        <ellipse cx="49.5" cy="33" rx="3" ry="1.8" fill="#fb7185" opacity="0.55" />

        <!-- Eyes & Cheerful Smile -->
        <circle cx="34" cy="28" r="2.4" fill="#0f172a" />
        <circle cx="46" cy="28" r="2.4" fill="#0f172a" />
        <circle cx="34.8" cy="27.2" r="0.85" fill="#ffffff" />
        <circle cx="46.8" cy="27.2" r="0.85" fill="#ffffff" />
        <path d="M35 35 Q40 39.5 45 35" stroke="#9a3412" stroke-width="2.1" stroke-linecap="round" fill="none" />

        ${
          hasGlasses
            ? `
          <circle cx="34" cy="28" r="4.6" fill="none" stroke="#1e293b" stroke-width="1.7" />
          <circle cx="46" cy="28" r="4.6" fill="none" stroke="#1e293b" stroke-width="1.7" />
          <line x1="38.6" y1="28" x2="41.4" y2="28" stroke="#1e293b" stroke-width="1.7" />
        `
            : ''
        }

        ${
          !isGirl
            ? `
          <!-- Peci / Kopiah -->
          <path d="M24 22 C24 10, 56 10, 56 22 Z" fill="${av.type === 'boy-kopiah' ? '#fffbeb' : '#022c22'}" stroke="${ac}" stroke-width="2" />
          <rect x="24" y="19" width="32" height="4" rx="2" fill="${ac}" />
        `
            : `
          <!-- Hijab Inner Rim -->
          <path d="M24.5 28 C24.5 14, 55.5 14, 55.5 28" fill="none" stroke="#ffffff" stroke-width="2.4" />
          ${
            hasFlower
              ? `<circle cx="54" cy="18" r="4.5" fill="#fde047" stroke="#f59e0b" stroke-width="1.2" /><circle cx="54" cy="18" r="1.8" fill="#ef4444" />`
              : ''
          }
          ${
            hasStar
              ? `<polygon points="53,13 54.6,16.5 58.5,17 55.5,19.5 56.3,23.2 53,21.3 49.7,23.2 50.5,19.5 47.5,17 51.4,16.5" fill="#fcd34d" />`
              : ''
          }
        `
        }
      </g>
    </svg>
  `;
}

export function getTileGridInfo(tileNum) {
  const clamped = Math.max(1, Math.min(100, tileNum));
  const zero = clamped - 1;
  const rowFromBottom = Math.floor(zero / 10);
  const colInRow = zero % 10;
  const col = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow;
  const rowFromTop = 9 - rowFromBottom;

  return {
    tile: clamped,
    col,
    rowFromTop,
    leftPct: col * 10 + 5,
    topPct: rowFromTop * 10 + 5,
    svgX: col * 100 + 50,
    svgY: rowFromTop * 100 + 50
  };
}

export const PION_PALETTES = [
  { primary: '#059669', dark: '#064e3b', rim: '#fde047', label: 'P1' },
  { primary: '#e11d48', dark: '#881337', rim: '#fde68a', label: 'P2' },
  { primary: '#0284c7', dark: '#0c4a6e', rim: '#bae6fd', label: 'P3' },
  { primary: '#7c3aed', dark: '#4c1d95', rim: '#ddd6fe', label: 'P4' }
];

export class Player {
  constructor({ id, name, avatarId, isBot = false }) {
    this.id = id;
    this.name = name;
    this.avatarId = avatarId;
    this.isBot = isBot;
    this.pion = PION_PALETTES[(id - 1) % PION_PALETTES.length];
    this.position = 1;
    this.score = 0;
    this.correctCount = 0;
    this.answeredCount = 0;
    this.streak = 0;
    this.element = null;
  }

  createTokenElement(tokensLayer) {
    const token = document.createElement('div');
    token.className = 'player-token';
    token.dataset.playerId = String(this.id);
    token.style.setProperty('--pion-color', this.pion.primary);
    token.style.setProperty('--pion-dark', this.pion.dark);
    token.style.setProperty('--pion-rim', this.pion.rim);

    token.innerHTML = `
      <div class="token-inner">
        <div class="token-ring"></div>
        <div class="pion-pedestal" aria-hidden="true">
          <span class="pion-badge">${this.pion.label}</span>
        </div>
        <div class="pion-character">
          ${buildAvatarSVG(this.avatarId, true)}
        </div>
      </div>
      <span class="token-name-tag">${this._escape(this.name)}</span>
    `;
    tokensLayer.appendChild(token);
    this.element = token;
    return token;
  }

  _escape(str) {
    return str.replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  setBoardPercent(leftPct, topPct, immediate = false) {
    if (!this.element) return;
    if (immediate) {
      this.element.style.transition = 'none';
    } else {
      this.element.style.transition = '';
    }
    this.element.style.left = `${leftPct}%`;
    this.element.style.top = `${topPct}%`;
    if (immediate) {
      // Force reflow so subsequent transitions animate cleanly
      void this.element.offsetWidth;
      this.element.style.transition = '';
    }
  }
}

export function layoutAllTokens(players, activePlayerId) {
  const groups = new Map();
  players.forEach((p) => {
    const key = p.position;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  });

  const offsets = [
    [{ dx: 0, dy: 0 }],
    [{ dx: -2.2, dy: -0.5 }, { dx: 2.2, dy: 0.7 }],
    [{ dx: -2.3, dy: -1.6 }, { dx: 2.3, dy: -1.6 }, { dx: 0, dy: 2.1 }],
    [{ dx: -2.3, dy: -1.8 }, { dx: 2.3, dy: -1.8 }, { dx: -2.3, dy: 2.0 }, { dx: 2.3, dy: 2.0 }]
  ];

  groups.forEach((group, tileNum) => {
    const base = getTileGridInfo(tileNum);
    const pattern = offsets[Math.min(group.length, 4) - 1];
    group.forEach((player, idx) => {
      const off = pattern[idx] || { dx: 0, dy: 0 };
      player.setBoardPercent(base.leftPct + off.dx, base.topPct + off.dy);
      if (player.element) {
        player.element.classList.toggle('is-active-turn', player.id === activePlayerId);
      }
    });
  });
}
