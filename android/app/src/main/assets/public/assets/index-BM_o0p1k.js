// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// player.js
var AVATAR_CATALOG = [
	{
		id: "ahmad",
		label: "Ahmad",
		color: "#059669",
		accent: "#fbbf24",
		type: "boy-peci"
	},
	{
		id: "aisyah",
		label: "Aisyah",
		color: "#d97706",
		accent: "#fef3c7",
		type: "girl-hijab"
	},
	{
		id: "umar",
		label: "Umar",
		color: "#0284c7",
		accent: "#fde68a",
		type: "boy-kopiah"
	},
	{
		id: "fatimah",
		label: "Fatimah",
		color: "#db2777",
		accent: "#fce7f3",
		type: "girl-hijab-flower"
	},
	{
		id: "zaid",
		label: "Zaid",
		color: "#7c3aed",
		accent: "#ddd6fe",
		type: "boy-glasses"
	},
	{
		id: "khadijah",
		label: "Khadijah",
		color: "#0d9488",
		accent: "#ccfbf1",
		type: "girl-hijab-star"
	}
];
function buildAvatarSVG(avatarId, includeLimbs = true) {
	const av = AVATAR_CATALOG.find((a) => a.id === avatarId) || AVATAR_CATALOG[0];
	const skin = "#f7cba4";
	const skinShadow = "#e6af82";
	const c = av.color;
	const ac = av.accent;
	const isGirl = av.type.startsWith("girl");
	const hasGlasses = av.type === "boy-glasses";
	const hasFlower = av.type === "girl-hijab-flower";
	const hasStar = av.type === "girl-hijab-star";
	return `
    <svg viewBox="0 0 80 88" class="token-avatar-svg" aria-hidden="true">
      <defs>
        <filter id="avShadow-${av.id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#022c22" flood-opacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#avShadow-${av.id})">
        ${includeLimbs ? `
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
          </g>` : ""}

        <!-- Torso / Baju -->
        <rect x="23" y="42" width="34" height="27" rx="12" fill="${c}" stroke="#ffffff" stroke-width="2" />
        <path d="M35 44 L40 53 L45 44" fill="${ac}" opacity="0.9" />

        ${isGirl ? `
          <!-- Hijab Outer Hood -->
          <path d="M18 32 C18 11, 62 11, 62 32 L64 49 Q40 56 16 49 Z" fill="${c}" stroke="#ffffff" stroke-width="2" />
          <path d="M24 31 C24 17, 56 17, 56 31 C56 42, 48 45, 40 45 C32 45, 24 42, 24 31 Z" fill="${ac}" opacity="0.35" />
        ` : ""}

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

        ${hasGlasses ? `
          <circle cx="34" cy="28" r="4.6" fill="none" stroke="#1e293b" stroke-width="1.7" />
          <circle cx="46" cy="28" r="4.6" fill="none" stroke="#1e293b" stroke-width="1.7" />
          <line x1="38.6" y1="28" x2="41.4" y2="28" stroke="#1e293b" stroke-width="1.7" />
        ` : ""}

        ${!isGirl ? `
          <!-- Peci / Kopiah -->
          <path d="M24 22 C24 10, 56 10, 56 22 Z" fill="${av.type === "boy-kopiah" ? "#fffbeb" : "#022c22"}" stroke="${ac}" stroke-width="2" />
          <rect x="24" y="19" width="32" height="4" rx="2" fill="${ac}" />
        ` : `
          <!-- Hijab Inner Rim -->
          <path d="M24.5 28 C24.5 14, 55.5 14, 55.5 28" fill="none" stroke="#ffffff" stroke-width="2.4" />
          ${hasFlower ? `<circle cx="54" cy="18" r="4.5" fill="#fde047" stroke="#f59e0b" stroke-width="1.2" /><circle cx="54" cy="18" r="1.8" fill="#ef4444" />` : ""}
          ${hasStar ? `<polygon points="53,13 54.6,16.5 58.5,17 55.5,19.5 56.3,23.2 53,21.3 49.7,23.2 50.5,19.5 47.5,17 51.4,16.5" fill="#fcd34d" />` : ""}
        `}
      </g>
    </svg>
  `;
}
function getTileGridInfo(tileNum) {
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
var PION_PALETTES = [
	{
		primary: "#059669",
		dark: "#064e3b",
		rim: "#fde047",
		label: "P1"
	},
	{
		primary: "#e11d48",
		dark: "#881337",
		rim: "#fde68a",
		label: "P2"
	},
	{
		primary: "#0284c7",
		dark: "#0c4a6e",
		rim: "#bae6fd",
		label: "P3"
	},
	{
		primary: "#7c3aed",
		dark: "#4c1d95",
		rim: "#ddd6fe",
		label: "P4"
	}
];
var Player = class {
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
		const token = document.createElement("div");
		token.className = "player-token";
		token.dataset.playerId = String(this.id);
		token.style.setProperty("--pion-color", this.pion.primary);
		token.style.setProperty("--pion-dark", this.pion.dark);
		token.style.setProperty("--pion-rim", this.pion.rim);
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
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#39;"
		})[ch]);
	}
	setBoardPercent(leftPct, topPct, immediate = false) {
		if (!this.element) return;
		if (immediate) this.element.style.transition = "none";
		else this.element.style.transition = "";
		this.element.style.left = `${leftPct}%`;
		this.element.style.top = `${topPct}%`;
		if (immediate) {
			this.element.offsetWidth;
			this.element.style.transition = "";
		}
	}
};
function layoutAllTokens(players, activePlayerId) {
	const groups = /* @__PURE__ */ new Map();
	players.forEach((p) => {
		const key = p.position;
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(p);
	});
	const offsets = [
		[{
			dx: 0,
			dy: 0
		}],
		[{
			dx: -2.2,
			dy: -.5
		}, {
			dx: 2.2,
			dy: .7
		}],
		[
			{
				dx: -2.3,
				dy: -1.6
			},
			{
				dx: 2.3,
				dy: -1.6
			},
			{
				dx: 0,
				dy: 2.1
			}
		],
		[
			{
				dx: -2.3,
				dy: -1.8
			},
			{
				dx: 2.3,
				dy: -1.8
			},
			{
				dx: -2.3,
				dy: 2
			},
			{
				dx: 2.3,
				dy: 2
			}
		]
	];
	groups.forEach((group, tileNum) => {
		const base = getTileGridInfo(tileNum);
		const pattern = offsets[Math.min(group.length, 4) - 1];
		group.forEach((player, idx) => {
			const off = pattern[idx] || {
				dx: 0,
				dy: 0
			};
			player.setBoardPercent(base.leftPct + off.dx, base.topPct + off.dy);
			if (player.element) player.element.classList.toggle("is-active-turn", player.id === activePlayerId);
		});
	});
}
// sound.js
var AUDIO_STORAGE_KEY = "sahabat_salat_audio_prefs";
var SoundEngine = class {
	constructor() {
		this.ctx = null;
		this.masterGain = null;
		this.bgmGain = null;
		this.sfxGain = null;
		this.muted = false;
		this.volume = .7;
		this.bgmInterval = null;
		this.bgmPlaying = false;
		this.bgmStep = 0;
		this._loadPrefs();
	}
	_loadPrefs() {
		try {
			const saved = localStorage.getItem(AUDIO_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (typeof parsed.muted === "boolean") this.muted = parsed.muted;
				if (typeof parsed.volume === "number") this.volume = Math.max(0, Math.min(1, parsed.volume));
			}
		} catch {}
	}
	_savePrefs() {
		try {
			localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify({
				muted: this.muted,
				volume: this.volume
			}));
		} catch {}
	}
	init() {
		if (!this.ctx) {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!AudioCtx) return false;
			this.ctx = new AudioCtx();
			this.masterGain = this.ctx.createGain();
			this.bgmGain = this.ctx.createGain();
			this.sfxGain = this.ctx.createGain();
			this.bgmGain.gain.value = .24;
			this.sfxGain.gain.value = .88;
			this.bgmGain.connect(this.masterGain);
			this.sfxGain.connect(this.masterGain);
			this.masterGain.connect(this.ctx.destination);
			this._applyGain();
		}
		if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
		return true;
	}
	_applyGain() {
		if (!this.masterGain || !this.ctx) return;
		const target = this.muted ? 0 : this.volume;
		this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, .02);
	}
	setMuted(isMuted) {
		this.muted = Boolean(isMuted);
		this._applyGain();
		this._savePrefs();
	}
	toggleMute() {
		this.setMuted(!this.muted);
		return this.muted;
	}
	setVolume(val) {
		this.volume = Math.max(0, Math.min(1, Number(val)));
		if (this.volume > 0 && this.muted) this.muted = false;
		this._applyGain();
		this._savePrefs();
	}
	_playTone(freq, duration, type = "sine", startTimeOffset = 0, peakGain = .25, dest = "sfx", slideTo = null) {
		if (!this.init()) return;
		const now = this.ctx.currentTime + startTimeOffset;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, now);
		if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
		gain.gain.setValueAtTime(.001, now);
		gain.gain.linearRampToValueAtTime(peakGain, now + .015);
		gain.gain.exponentialRampToValueAtTime(8e-4, now + duration);
		osc.connect(gain);
		gain.connect(dest === "bgm" ? this.bgmGain : this.sfxGain);
		osc.start(now);
		osc.stop(now + duration + .02);
	}
	_playNoiseBurst(duration, filterFreq, q = 2, startTimeOffset = 0, peakGain = .2) {
		if (!this.init()) return;
		const now = this.ctx.currentTime + startTimeOffset;
		const bufferSize = Math.floor(this.ctx.sampleRate * duration);
		const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
		const noise = this.ctx.createBufferSource();
		noise.buffer = buffer;
		const filter = this.ctx.createBiquadFilter();
		filter.type = "bandpass";
		filter.frequency.setValueAtTime(filterFreq, now);
		filter.Q.setValueAtTime(q, now);
		const gain = this.ctx.createGain();
		gain.gain.setValueAtTime(.001, now);
		gain.gain.linearRampToValueAtTime(peakGain, now + .02);
		gain.gain.exponentialRampToValueAtTime(.001, now + duration);
		noise.connect(filter);
		filter.connect(gain);
		gain.connect(this.sfxGain);
		noise.start(now);
		noise.stop(now + duration + .02);
	}
	playClick() {
		this._playTone(620, .07, "triangle", 0, .16, "sfx", 760);
	}
	playDiceThrow() {
		this._playNoiseBurst(.22, 1200, 1.4, 0, .24);
		this._playTone(260, .18, "triangle", 0, .2, "sfx", 680);
		this._playTone(420, .06, "sine", .08, .12, "sfx", 540);
	}
	playDiceBounce(intensity = 1) {
		const gain = Math.max(.08, Math.min(.32, .28 * intensity));
		const baseFreq = 220 + (1 - intensity) * 160;
		this._playTone(baseFreq, .09, "triangle", 0, gain, "sfx", baseFreq * .55);
		this._playNoiseBurst(.045, 900, 2.5, 0, gain * .55);
	}
	playStep(stepIndex = 0) {
		const pitch = 390 + stepIndex % 4 * 35;
		this._playTone(pitch, .09, "sine", 0, .18, "sfx", pitch * 1.18);
	}
	playBump() {
		this._playTone(210, .16, "sawtooth", 0, .16, "sfx", 110);
	}
	playLadderClimb() {
		[
			392,
			440,
			523.25,
			587.33,
			659.25,
			783.99,
			880
		].forEach((n, idx) => {
			this._playTone(n, .18, "triangle", idx * .11, .2, "sfx");
		});
	}
	playSnakeHiss() {
		this._playNoiseBurst(.55, 3400, 3.2, 0, .26);
		this._playTone(540, .22, "sine", .05, .12, "sfx", 280);
	}
	playSnakeGulp() {
		this._playTone(460, .12, "sine", 0, .22, "sfx", 180);
		this._playTone(210, .14, "sine", .1, .24, "sfx", 480);
		this._playTone(620, .48, "triangle", .25, .22, "sfx", 165);
	}
	playCorrect() {
		[
			523.25,
			659.25,
			783.99,
			1046.5
		].forEach((f, idx) => {
			this._playTone(f, .28, "triangle", idx * .075, .24, "sfx");
		});
	}
	playWrong() {
		this._playTone(280, .2, "sawtooth", 0, .15, "sfx", 220);
		this._playTone(220, .28, "sawtooth", .16, .15, "sfx", 150);
	}
	playVictory() {
		[
			{
				f: 523.25,
				d: .16,
				t: 0
			},
			{
				f: 659.25,
				d: .16,
				t: .15
			},
			{
				f: 783.99,
				d: .16,
				t: .3
			},
			{
				f: 1046.5,
				d: .38,
				t: .46
			},
			{
				f: 880,
				d: .16,
				t: .85
			},
			{
				f: 1046.5,
				d: .55,
				t: 1.02
			}
		].forEach((n) => {
			this._playTone(n.f, n.d, "triangle", n.t, .28, "sfx");
			this._playTone(n.f * .5, n.d, "sine", n.t, .15, "sfx");
		});
	}
	startBgm() {
		if (this.bgmPlaying) return;
		if (!this.init()) return;
		this.bgmPlaying = true;
		const melody = [
			293.66,
			349.23,
			440,
			392,
			349.23,
			329.63,
			293.66,
			220,
			293.66,
			349.23,
			440,
			523.25,
			440,
			392,
			349.23,
			329.63
		];
		this.bgmInterval = window.setInterval(() => {
			if (!this.bgmPlaying || this.muted || !this.ctx || this.ctx.state !== "running") return;
			const note = melody[this.bgmStep % melody.length];
			this._playTone(note, .34, "sine", 0, .18, "bgm");
			if (this.bgmStep % 4 === 0) this._playTone(note * .5, .55, "triangle", 0, .1, "bgm");
			this.bgmStep += 1;
		}, 460);
	}
	stopBgm() {
		this.bgmPlaying = false;
		if (this.bgmInterval) {
			clearInterval(this.bgmInterval);
			this.bgmInterval = null;
		}
	}
};
var sound = new SoundEngine();
// dice.js
var PIP_LAYOUTS = {
	1: [4],
	2: [0, 8],
	3: [
		0,
		4,
		8
	],
	4: [
		0,
		2,
		6,
		8
	],
	5: [
		0,
		2,
		4,
		6,
		8
	],
	6: [
		0,
		2,
		3,
		5,
		6,
		8
	]
};
var TARGET_FACE_ROTATION = {
	1: {
		x: 0,
		y: 0
	},
	2: {
		x: 0,
		y: -90
	},
	3: {
		x: -90,
		y: 0
	},
	4: {
		x: 90,
		y: 0
	},
	5: {
		x: 0,
		y: 90
	},
	6: {
		x: 0,
		y: 180
	}
};
function renderPipsInto(el, value) {
	if (!el) return;
	const active = new Set(PIP_LAYOUTS[value] || PIP_LAYOUTS[1]);
	el.innerHTML = "";
	for (let i = 0; i < 9; i++) {
		const cell = document.createElement("span");
		if (active.has(i)) cell.className = "dice-pip";
		el.appendChild(cell);
	}
}
var DiceController = class {
	constructor() {
		this.overlay = document.getElementById("dice-board-overlay");
		this.wrapper = document.getElementById("flying-dice-wrapper");
		this.cube = document.getElementById("dice-cube");
		this.shadow = document.getElementById("dice-shadow");
		this.miniFace = document.getElementById("mini-dice-face");
		this.lastRollValue = document.getElementById("last-roll-value");
		this._initFaces();
		renderPipsInto(this.miniFace, 6);
	}
	_initFaces() {
		if (!this.cube) return;
		for (let f = 1; f <= 6; f++) renderPipsInto(this.cube.querySelector(`.face-${f}`), f);
	}
	async roll() {
		const result = Math.floor(Math.random() * 6) + 1;
		sound.playDiceThrow();
		this.wrapper.classList.remove("is-rolling", "is-result-pop");
		this.shadow.classList.remove("is-rolling");
		this.cube.classList.remove("is-rolling", "is-settled");
		this.cube.offsetWidth;
		const target = TARGET_FACE_ROTATION[result];
		const dirX = Math.random() < .5 ? 1 : -1;
		const dirY = Math.random() < .5 ? 1 : -1;
		const spinTurnsX = (2 + Math.floor(Math.random() * 2)) * dirX;
		const spinTurnsY = (2 + Math.floor(Math.random() * 2)) * dirY;
		const rx0 = Math.round((Math.random() - .5) * 90);
		const ry0 = Math.round((Math.random() - .5) * 90);
		const rz0 = Math.round((Math.random() - .5) * 50);
		const endRotX = spinTurnsX * 360 + target.x;
		const endRotY = spinTurnsY * 360 + target.y;
		const rx1 = Math.round(rx0 + (endRotX - rx0) * .34 + (Math.random() - .5) * 70);
		const ry1 = Math.round(ry0 + (endRotY - ry0) * .34 + (Math.random() - .5) * 70);
		const rz1 = Math.round((Math.random() < .5 ? 1 : -1) * (30 + Math.random() * 40));
		const rx2 = Math.round(rx0 + (endRotX - rx0) * .72 + (Math.random() - .5) * 45);
		const ry2 = Math.round(ry0 + (endRotY - ry0) * .72 + (Math.random() - .5) * 45);
		const rz2 = Math.round((Math.random() < .5 ? -1 : 1) * (15 + Math.random() * 20));
		const rx3 = Math.round(endRotX + (Math.random() - .5) * 18);
		const ry3 = Math.round(endRotY + (Math.random() - .5) * 18);
		this.cube.style.setProperty("--rx-0", `${rx0}deg`);
		this.cube.style.setProperty("--ry-0", `${ry0}deg`);
		this.cube.style.setProperty("--rz-0", `${rz0}deg`);
		this.cube.style.setProperty("--rx-1", `${rx1}deg`);
		this.cube.style.setProperty("--ry-1", `${ry1}deg`);
		this.cube.style.setProperty("--rz-1", `${rz1}deg`);
		this.cube.style.setProperty("--rx-2", `${rx2}deg`);
		this.cube.style.setProperty("--ry-2", `${ry2}deg`);
		this.cube.style.setProperty("--rz-2", `${rz2}deg`);
		this.cube.style.setProperty("--rx-3", `${rx3}deg`);
		this.cube.style.setProperty("--ry-3", `${ry3}deg`);
		this.cube.style.setProperty("--rx-end", `${endRotX}deg`);
		this.cube.style.setProperty("--ry-end", `${endRotY}deg`);
		this.overlay.classList.add("is-visible");
		this.wrapper.classList.add("is-rolling");
		this.shadow.classList.add("is-rolling");
		this.cube.classList.add("is-rolling");
		const shuffleInterval = window.setInterval(() => {
			const randVal = Math.floor(Math.random() * 6) + 1;
			renderPipsInto(this.miniFace, randVal);
			if (this.lastRollValue) this.lastRollValue.textContent = String(randVal);
		}, 68);
		const tBounce1 = window.setTimeout(() => sound.playDiceBounce(1), 515);
		const tBounce2 = window.setTimeout(() => sound.playDiceBounce(.62), 800);
		const tBounce3 = window.setTimeout(() => sound.playDiceBounce(.32), 1015);
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 120 : 1180));
		clearInterval(shuffleInterval);
		clearTimeout(tBounce1);
		clearTimeout(tBounce2);
		clearTimeout(tBounce3);
		this.wrapper.classList.remove("is-rolling");
		this.shadow.classList.remove("is-rolling");
		this.cube.classList.remove("is-rolling");
		this.cube.offsetWidth;
		this.cube.style.transform = `rotateX(${endRotX}deg) rotateY(${endRotY}deg)`;
		this.cube.classList.add("is-settled");
		this.wrapper.classList.add("is-result-pop");
		renderPipsInto(this.miniFace, result);
		if (this.lastRollValue) this.lastRollValue.textContent = String(result);
		await new Promise((r) => setTimeout(r, reducedMotion ? 160 : 500));
		this.overlay.classList.remove("is-visible");
		this.cube.classList.remove("is-settled");
		this.wrapper.classList.remove("is-result-pop");
		return result;
	}
};
// ladder.js
var LADDERS = [
	{
		from: 4,
		to: 25,
		color: "#d97706",
		highlight: "#fde68a"
	},
	{
		from: 13,
		to: 46,
		color: "#b45309",
		highlight: "#fcd34d"
	},
	{
		from: 33,
		to: 49,
		color: "#d97706",
		highlight: "#fef08a"
	},
	{
		from: 42,
		to: 63,
		color: "#b45309",
		highlight: "#fde68a"
	},
	{
		from: 50,
		to: 69,
		color: "#d97706",
		highlight: "#fcd34d"
	},
	{
		from: 74,
		to: 92,
		color: "#b45309",
		highlight: "#fef08a"
	}
];
var SVG_NS$1 = "http://www.w3.org/2000/svg";
function createSvgEl$1(tag, attrs = {}) {
	const el = document.createElementNS(SVG_NS$1, tag);
	Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
	return el;
}
var LadderManager = class {
	constructor(layerEl) {
		this.layerEl = layerEl;
		this.ladderEls = /* @__PURE__ */ new Map();
		this.render();
	}
	getLadderAt(tileNum) {
		return LADDERS.find((l) => l.from === tileNum) || null;
	}
	render() {
		if (!this.layerEl) return;
		this.layerEl.innerHTML = "";
		this.ladderEls.clear();
		LADDERS.forEach((ladder, idx) => {
			const start = getTileGridInfo(ladder.from);
			const end = getTileGridInfo(ladder.to);
			const dx = end.svgX - start.svgX;
			const dy = end.svgY - start.svgY;
			const len = Math.hypot(dx, dy);
			const nx = -dy / len * 16;
			const ny = dx / len * 16;
			const group = createSvgEl$1("g", {
				class: "ladder-group",
				id: `ladder-${ladder.from}-${ladder.to}`,
				filter: "url(#softShadow)"
			});
			const aura = createSvgEl$1("line", {
				class: "ladder-glow-aura",
				x1: start.svgX,
				y1: start.svgY,
				x2: end.svgX,
				y2: end.svgY,
				stroke: "#fde047",
				"stroke-width": 44,
				"stroke-linecap": "round"
			});
			group.appendChild(aura);
			const railLeft = createSvgEl$1("line", {
				x1: start.svgX - nx,
				y1: start.svgY - ny,
				x2: end.svgX - nx,
				y2: end.svgY - ny,
				stroke: ladder.color,
				"stroke-width": 9,
				"stroke-linecap": "round"
			});
			const railRight = createSvgEl$1("line", {
				x1: start.svgX + nx,
				y1: start.svgY + ny,
				x2: end.svgX + nx,
				y2: end.svgY + ny,
				stroke: ladder.color,
				"stroke-width": 9,
				"stroke-linecap": "round"
			});
			const railLeftHi = createSvgEl$1("line", {
				x1: start.svgX - nx,
				y1: start.svgY - ny,
				x2: end.svgX - nx,
				y2: end.svgY - ny,
				stroke: ladder.highlight,
				"stroke-width": 3,
				"stroke-linecap": "round",
				opacity: .75
			});
			const railRightHi = createSvgEl$1("line", {
				x1: start.svgX + nx,
				y1: start.svgY + ny,
				x2: end.svgX + nx,
				y2: end.svgY + ny,
				stroke: ladder.highlight,
				"stroke-width": 3,
				"stroke-linecap": "round",
				opacity: .75
			});
			const rungCount = Math.max(4, Math.floor(len / 38));
			const rungsGroup = createSvgEl$1("g");
			for (let i = 1; i < rungCount; i++) {
				const t = i / rungCount;
				const cx = start.svgX + dx * t;
				const cy = start.svgY + dy * t;
				const rung = createSvgEl$1("line", {
					x1: cx - nx * .95,
					y1: cy - ny * .95,
					x2: cx + nx * .95,
					y2: cy + ny * .95,
					stroke: "#f59e0b",
					"stroke-width": 6.5,
					"stroke-linecap": "round"
				});
				const rungHi = createSvgEl$1("line", {
					x1: cx - nx * .85,
					y1: cy - ny * .85,
					x2: cx + nx * .85,
					y2: cy + ny * .85,
					stroke: "#fef3c7",
					"stroke-width": 2.2,
					"stroke-linecap": "round"
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
			this.ladderEls.set(ladder.from, {
				ladder,
				group,
				idx
			});
		});
	}
	async animateClimb(player, ladder, particles) {
		const entry = this.ladderEls.get(ladder.from);
		const start = getTileGridInfo(ladder.from);
		const end = getTileGridInfo(ladder.to);
		if (entry) entry.group.classList.add("is-active");
		sound.playLadderClimb();
		if (player.element) player.element.classList.add("is-climbing", "is-active-turn");
		const totalMs = 1250;
		const startTime = performance.now();
		await new Promise((resolve) => {
			const step = (now) => {
				const elapsed = now - startTime;
				const t = Math.min(1, elapsed / totalMs);
				const steppedT = t + Math.sin(t * Math.PI * 8) * .014;
				const clampedT = Math.max(0, Math.min(1, steppedT));
				const curLeft = start.leftPct + (end.leftPct - start.leftPct) * clampedT;
				const curTop = start.topPct + (end.topPct - start.topPct) * clampedT;
				player.setBoardPercent(curLeft, curTop, true);
				if (t < 1) requestAnimationFrame(step);
				else resolve();
			};
			requestAnimationFrame(step);
		});
		player.position = ladder.to;
		player.setBoardPercent(end.leftPct, end.topPct, false);
		if (player.element) player.element.classList.remove("is-climbing");
		if (entry) entry.group.classList.remove("is-active");
		if (particles) particles.burstPercent(end.leftPct, end.topPct, "gold", 28);
		await new Promise((r) => setTimeout(r, 260));
	}
};
// snake.js
var SNAKES = [
	{
		head: 27,
		tail: 5,
		body: "#10b981",
		belly: "#a7f3d0",
		spot: "#047857"
	},
	{
		head: 40,
		tail: 3,
		body: "#f59e0b",
		belly: "#fef3c7",
		spot: "#b45309"
	},
	{
		head: 43,
		tail: 18,
		body: "#fb7185",
		belly: "#ffe4e6",
		spot: "#be123c"
	},
	{
		head: 54,
		tail: 31,
		body: "#14b8a6",
		belly: "#ccfbf1",
		spot: "#0f766e"
	},
	{
		head: 66,
		tail: 45,
		body: "#eab308",
		belly: "#fef9c3",
		spot: "#a16207"
	},
	{
		head: 89,
		tail: 53,
		body: "#8b5cf6",
		belly: "#ede9fe",
		spot: "#5b21b6"
	},
	{
		head: 97,
		tail: 78,
		body: "#0ea5e9",
		belly: "#e0f2fe",
		spot: "#0369a1"
	}
];
var SVG_NS = "http://www.w3.org/2000/svg";
function createSvgEl(tag, attrs = {}) {
	const el = document.createElementNS(SVG_NS, tag);
	Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
	return el;
}
function buildWavyPath(hx, hy, tx, ty, index) {
	const dx = tx - hx;
	const dy = ty - hy;
	const len = Math.hypot(dx, dy) || 1;
	const nx = -dy / len;
	const ny = dx / len;
	const amp = Math.min(72, Math.max(36, len * .22)) * (index % 2 === 0 ? 1 : -1);
	return `M ${hx} ${hy} C ${hx + dx * .28 + nx * amp} ${hy + dy * .28 + ny * amp}, ${hx + dx * .68 - nx * amp} ${hy + dy * .68 - ny * amp}, ${tx} ${ty}`;
}
var SnakeManager = class {
	constructor(layerEl) {
		this.layerEl = layerEl;
		this.snakeEls = /* @__PURE__ */ new Map();
		this.render();
	}
	getSnakeAt(tileNum) {
		return SNAKES.find((s) => s.head === tileNum) || null;
	}
	render() {
		if (!this.layerEl) return;
		this.layerEl.innerHTML = "";
		this.snakeEls.clear();
		SNAKES.forEach((snake, idx) => {
			const h = getTileGridInfo(snake.head);
			const t = getTileGridInfo(snake.tail);
			const pathD = buildWavyPath(h.svgX, h.svgY, t.svgX, t.svgY, idx);
			const group = createSvgEl("g", {
				class: "snake-group",
				id: `snake-${snake.head}-${snake.tail}`,
				filter: "url(#softShadow)"
			});
			const bodyGroup = createSvgEl("g", { class: "snake-body-path" });
			const outlinePath = createSvgEl("path", {
				d: pathD,
				fill: "none",
				stroke: "#022c22",
				"stroke-width": 32,
				"stroke-linecap": "round",
				opacity: .72
			});
			const mainPath = createSvgEl("path", {
				d: pathD,
				fill: "none",
				stroke: snake.body,
				"stroke-width": 25,
				"stroke-linecap": "round"
			});
			const patternPath = createSvgEl("path", {
				d: pathD,
				fill: "none",
				stroke: snake.belly,
				"stroke-width": 10,
				"stroke-linecap": "round",
				"stroke-dasharray": "10 18",
				opacity: .85
			});
			const tailTip = createSvgEl("circle", {
				cx: t.svgX,
				cy: t.svgY,
				r: 9,
				fill: snake.spot,
				stroke: "#ffffff",
				"stroke-width": 2
			});
			const bulge = createSvgEl("circle", {
				class: "snake-swallow-bulge",
				cx: h.svgX,
				cy: h.svgY,
				r: 22,
				fill: snake.body,
				stroke: snake.belly,
				"stroke-width": 4
			});
			bodyGroup.appendChild(outlinePath);
			bodyGroup.appendChild(mainPath);
			bodyGroup.appendChild(patternPath);
			bodyGroup.appendChild(tailTip);
			bodyGroup.appendChild(bulge);
			group.appendChild(bodyGroup);
			const headGroup = createSvgEl("g", {
				class: "snake-head-group",
				transform: `translate(${h.svgX}, ${h.svgY})`
			});
			const tongue = createSvgEl("path", {
				class: "snake-tongue",
				d: "M -3 16 L 0 34 L -5 41 M 0 34 L 5 41",
				fill: "none",
				stroke: "#f43f5e",
				"stroke-width": 3.5,
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			});
			const mouthCavity = createSvgEl("ellipse", {
				class: "snake-mouth-cavity",
				cx: 0,
				cy: 11,
				rx: 17,
				ry: 13,
				fill: "#881337",
				stroke: "#4c0519",
				"stroke-width": 2
			});
			const lowerJaw = createSvgEl("path", {
				class: "snake-jaw-lower",
				d: "M -17 6 Q 0 24 17 6 Q 15 20 0 21 Q -15 20 -17 6 Z",
				fill: snake.belly,
				stroke: "#022c22",
				"stroke-width": 2.5
			});
			const headShape = createSvgEl("path", {
				d: "M -22 2 C -24 -22, 24 -22, 22 2 C 22 14, -22 14, -22 2 Z",
				fill: snake.body,
				stroke: "#022c22",
				"stroke-width": 2.8
			});
			const cheekL = createSvgEl("circle", {
				cx: -14,
				cy: 3,
				r: 4,
				fill: "#fda4af",
				opacity: .7
			});
			const cheekR = createSvgEl("circle", {
				cx: 14,
				cy: 3,
				r: 4,
				fill: "#fda4af",
				opacity: .7
			});
			const eyeL = createSvgEl("circle", {
				cx: -9,
				cy: -8,
				r: 7.5,
				fill: "#ffffff",
				stroke: "#022c22",
				"stroke-width": 2
			});
			const eyeR = createSvgEl("circle", {
				cx: 9,
				cy: -8,
				r: 7.5,
				fill: "#ffffff",
				stroke: "#022c22",
				"stroke-width": 2
			});
			const pupilL = createSvgEl("circle", {
				class: "snake-eye-pupil",
				cx: -8.5,
				cy: -7.5,
				r: 3.8,
				fill: "#0f172a"
			});
			const pupilR = createSvgEl("circle", {
				class: "snake-eye-pupil",
				cx: 8.5,
				cy: -7.5,
				r: 3.8,
				fill: "#0f172a"
			});
			const glintL = createSvgEl("circle", {
				cx: -7,
				cy: -9,
				r: 1.5,
				fill: "#ffffff"
			});
			const glintR = createSvgEl("circle", {
				cx: 10,
				cy: -9,
				r: 1.5,
				fill: "#ffffff"
			});
			const fangL = createSvgEl("polygon", {
				class: "snake-mouth-cavity",
				points: "-9,10 -6,17 -3,10",
				fill: "#ffffff"
			});
			const fangR = createSvgEl("polygon", {
				class: "snake-mouth-cavity",
				points: "3,10 6,17 9,10",
				fill: "#ffffff"
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
		sound.playSnakeHiss();
		group.classList.add("is-alert");
		await new Promise((r) => setTimeout(r, 340));
		group.classList.add("is-mouth-open", "is-eating");
		await new Promise((r) => setTimeout(r, 260));
		sound.playSnakeGulp();
		if (player.element) {
			player.setBoardPercent(headInfo.leftPct, headInfo.topPct - 1.2);
			player.element.classList.add("is-swallowed");
		}
		await new Promise((r) => setTimeout(r, 420));
		if (player.element) player.element.style.opacity = "0";
		group.classList.remove("is-mouth-open");
		group.classList.add("is-digesting");
		const pathLen = mainPath.getTotalLength();
		const slideMs = 820;
		const startTime = performance.now();
		await new Promise((resolve) => {
			const tick = (now) => {
				const t = Math.min(1, (now - startTime) / slideMs);
				const eased = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
				const pt = mainPath.getPointAtLength(pathLen * eased);
				bulge.setAttribute("cx", pt.x.toFixed(1));
				bulge.setAttribute("cy", pt.y.toFixed(1));
				if (t < 1) requestAnimationFrame(tick);
				else resolve();
			};
			requestAnimationFrame(tick);
		});
		group.classList.remove("is-digesting", "is-eating", "is-alert");
		player.position = snake.tail;
		player.setBoardPercent(tailInfo.leftPct, tailInfo.topPct, true);
		if (player.element) {
			player.element.classList.remove("is-swallowed");
			player.element.style.opacity = "1";
			player.element.classList.add("is-popping-out");
		}
		if (particles) particles.burstPercent(tailInfo.leftPct, tailInfo.topPct, "emerald", 22);
		await new Promise((r) => setTimeout(r, 460));
		if (player.element) player.element.classList.remove("is-popping-out");
	}
};
// questions.js
var RUKUN_SALAT_LIST = [
	{
		num: 1,
		name: "Niat",
		category: "Rukun Qalbi (Hati)",
		desc: "Menyengaja mengerjakan salat di dalam hati bersamaan dengan mengucap Takbiratul Ihram."
	},
	{
		num: 2,
		name: "Berdiri bagi yang Mampu",
		category: "Rukun Fi'li (Gerakan)",
		desc: "Wajib berdiri tegak pada salat fardu bagi yang mampu. Jika tidak mampu, boleh duduk atau berbaring."
	},
	{
		num: 3,
		name: "Takbiratul Ihram",
		category: "Rukun Qauli (Ucapan)",
		desc: "Mengucapkan lafaz \"Allahu Akbar\" sebagai pembuka salat yang mengharamkan hal-hal di luar salat."
	},
	{
		num: 4,
		name: "Membaca Surah Al-Fatihah",
		category: "Rukun Qauli (Ucapan)",
		desc: "Membaca Surah Al-Fatihah beserta Basmalah secara lengkap pada setiap rakaat salat."
	},
	{
		num: 5,
		name: "Rukuk serta Tuma'ninah",
		category: "Rukun Fi'li (Gerakan)",
		desc: "Membungkukkan badan sehingga kedua telapak tangan dapat mencapai lutut, disertai diam sejenak (tuma'ninah)."
	},
	{
		num: 6,
		name: "I'tidal serta Tuma'ninah",
		category: "Rukun Fi'li (Gerakan)",
		desc: "Bangun dari rukuk hingga kembali berdiri tegak dengan tenang sejenak sebelum turun sujud."
	},
	{
		num: 7,
		name: "Sujud Dua Kali serta Tuma'ninah",
		category: "Rukun Fi'li (Gerakan)",
		desc: "Meletakkan tujuh anggota sujud (dahi, 2 telapak tangan, 2 lutut, ujung 2 kaki) ke lantai sebanyak dua kali tiap rakaat."
	},
	{
		num: 8,
		name: "Duduk di Antara Dua Sujud serta Tuma'ninah",
		category: "Rukun Fi'li (Gerakan)",
		desc: "Bangun dari sujud pertama untuk duduk sejenak dengan tenang sebelum melakukan sujud kedua."
	},
	{
		num: 9,
		name: "Duduk Tasyahud Akhir",
		category: "Rukun Fi'li (Gerakan)",
		desc: "Duduk pada rakaat terakhir salat (disunnahkan duduk tawarruk) untuk membaca tasyahud akhir dan salawat."
	},
	{
		num: 10,
		name: "Membaca Tasyahud Akhir",
		category: "Rukun Qauli (Ucapan)",
		desc: "Membaca bacaan tahiyat/tasyahud akhir pada posisi duduk terakhir sebelum salam."
	},
	{
		num: 11,
		name: "Membaca Salawat kepada Nabi Muhammad SAW",
		category: "Rukun Qauli (Ucapan)",
		desc: "Membaca salawat kepada Nabi Muhammad SAW setelah bacaan tasyahud akhir (minimal: Allahumma shalli 'ala Muhammad)."
	},
	{
		num: 12,
		name: "Mengucapkan Salam yang Pertama",
		category: "Rukun Qauli (Ucapan)",
		desc: "Mengucapkan \"Assalamu'alaikum\" yang pertama sambil menoleh ke kanan sebagai penutup salat."
	},
	{
		num: 13,
		name: "Tertib",
		category: "Rukun Ma'nawi",
		desc: "Melaksanakan seluruh rukun salat secara berurutan dari niat hingga salam tanpa membolak-balik urutannya."
	}
];
var QUESTION_BANK = JSON.parse(`[
  {
    "id": "rk-01",
    "rukunNumber": 1,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [2, 11],
    "points": 25,
    "question": "Rukun ke-1 adalah Niat. Di dalam hati, kapankah waktu yang tepat menghadirkan niat salat?",
    "options": [
      "Setelah selesai membaca Al-Fatihah",
      "Saat sedang duduk tasyahud",
      "Bersamaan dengan ucapan Takbiratul Ihram",
      "Sebelum mengambil air wudu"
    ],
    "answer": 2,
    "explanation": "Niat merupakan rukun qalbi yang dihadirkan di dalam hati bersamaan dengan ucapan Takbiratul Ihram (Allahu Akbar)."
  },
  {
    "id": "rk-02",
    "rukunNumber": 2,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [7],
    "points": 25,
    "question": "Rukun ke-2 adalah Berdiri bagi yang mampu. Jika seseorang sakit dan tidak kuat berdiri saat salat fardu, maka ia boleh salat dengan cara...",
    "options": [
      "Meninggalkan salat hingga sembuh",
      "Duduk atau berbaring sesuai kemampuannya",
      "Cukup membayangkan gerakan saja",
      "Menggantinya dengan puasa"
    ],
    "answer": 1,
    "explanation": "Berdiri adalah rukun salat fardu bagi yang mampu. Bila tidak mampu, syariat memberi keringanan untuk duduk atau berbaring."
  },
  {
    "id": "rk-03",
    "rukunNumber": 3,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [15],
    "points": 25,
    "question": "Rukun ke-3 adalah Takbiratul Ihram. Lafaz wajib yang diucapkan untuk membuka salat adalah...",
    "options": [
      "Subhanallah",
      "Alhamdulillah",
      "Allahu Akbar",
      "Astaghfirullah"
    ],
    "answer": 2,
    "explanation": "Takbiratul Ihram wajib mengucapkan lafaz Allahu Akbar sebagai pembuka salat yang mengharamkan aktivitas di luar salat."
  },
  {
    "id": "rk-04",
    "rukunNumber": 4,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [19, 23],
    "points": 25,
    "question": "Rukun ke-4 adalah membaca Surah Al-Fatihah. Dalam Mazhab Syafi'i, ayat pertama Surah Al-Fatihah yang wajib dibaca adalah...",
    "options": [
      "Alhamdulillahi rabbil 'alamin",
      "Bismillahirrahmanirrahim",
      "Maliki yaumiddin",
      "Iyyaka na'budu wa iyyaka nasta'in"
    ],
    "answer": 1,
    "explanation": "Mazhab Syafi'i menetapkan Basmalah (Bismillahirrahmanirrahim) sebagai ayat pertama Surah Al-Fatihah yang wajib dibaca di setiap rakaat."
  },
  {
    "id": "rk-05",
    "rukunNumber": 5,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [29],
    "points": 25,
    "question": "Rukun ke-5 adalah Rukuk serta tuma'ninah. Bagaimanakah syarat posisi rukuk yang sempurna?",
    "options": [
      "Membungkuk hingga kedua telapak tangan mencapai lutut dengan tenang sejenak",
      "Menundukkan kepala sedikit saja tanpa membungkuk",
      "Langsung turun ke lantai tanpa berhenti",
      "Mengangkat kedua tangan ke atas kepala"
    ],
    "answer": 0,
    "explanation": "Rukuk dilakukan dengan membungkukkan badan hingga kedua telapak tangan dapat mencapai lutut, disertai tuma'ninah (diam sejenak)."
  },
  {
    "id": "rk-06",
    "rukunNumber": 6,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [36],
    "points": 20,
    "question": "Rukun ke-6 (I'tidal) berarti bangkit dari rukuk hingga berdiri tegak kembali disertai tuma'ninah sebelum turun sujud.",
    "answer": true,
    "explanation": "Benar! I'tidal mewajibkan badan kembali tegak seperti sebelum rukuk dan diam tenang sejenak (tuma'ninah)."
  },
  {
    "id": "rk-07",
    "rukunNumber": 7,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [38, 47],
    "points": 20,
    "question": "Pada Rukun ke-7, sujud dalam setiap satu rakaat salat cukup dikerjakan satu kali saja.",
    "answer": false,
    "explanation": "Salah! Rukun ke-7 mewajibkan sujud dua kali pada setiap rakaat dengan meletakkan tujuh anggota sujud dan tuma'ninah."
  },
  {
    "id": "rk-08",
    "rukunNumber": 8,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [52],
    "points": 20,
    "question": "Duduk di antara dua sujud serta tuma'ninah termasuk salah satu dari 13 Rukun Salat (Rukun ke-8).",
    "answer": true,
    "explanation": "Benar! Duduk di antara sujud pertama dan sujud kedua disertai tuma'ninah adalah rukun salat ke-8."
  },
  {
    "id": "rk-09",
    "rukunNumber": 9,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [58],
    "points": 20,
    "question": "Duduk Tasyahud Awal termasuk dalam 13 Rukun Salat wajib dalam Mazhab Syafi'i.",
    "answer": false,
    "explanation": "Salah! Duduk Tasyahud Awal hukumnya sunnah ab'adh, sedangkan yang menjadi Rukun ke-9 adalah Duduk Tasyahud Akhir."
  },
  {
    "id": "rk-10",
    "rukunNumber": 10,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [61, 67],
    "points": 25,
    "question": "Rukun ke-10 adalah Membaca Tasyahud Akhir. Kapan bacaan tasyahud akhir wajib dibaca?",
    "options": [
      "Pada duduk di antara dua sujud",
      "Pada rakaat terakhir sebelum salawat dan salam",
      "Setiap kali selesai rukuk",
      "Setelah mengucapkan salam pertama"
    ],
    "answer": 1,
    "explanation": "Bacaan Tasyahud Akhir wajib dibaca saat duduk tasyahud akhir pada rakaat terakhir salat sebelum membaca salawat Nabi."
  },
  {
    "id": "rk-11",
    "rukunNumber": 11,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [72, 76],
    "points": 25,
    "question": "Rukun ke-11 adalah membaca Salawat kepada Nabi Muhammad SAW, yang wajib dibaca pada saat...",
    "options": [
      "Setelah membaca Surah Al-Fatihah",
      "Ketika duduk di antara dua sujud",
      "Duduk Tasyahud Akhir setelah bacaan tahiyat akhir",
      "Saat berdiri i'tidal"
    ],
    "answer": 2,
    "explanation": "Membaca salawat kepada Nabi Muhammad SAW adalah rukun ke-11 yang dibaca saat duduk tasyahud akhir sebelum salam."
  },
  {
    "id": "rk-12",
    "rukunNumber": 12,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [81, 85],
    "points": 20,
    "question": "Pada Rukun ke-12, baik salam pertama (kanan) maupun salam kedua (kiri) keduanya wajib hukumnya sebagai rukun salat.",
    "answer": false,
    "explanation": "Salah! Yang termasuk Rukun ke-12 hanyalah mengucapkan Salam yang pertama ke kanan. Salam kedua hukumnya sunnah."
  },
  {
    "id": "rk-13",
    "rukunNumber": 13,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [90, 99],
    "points": 20,
    "question": "Rukun ke-13 adalah Tertib, yaitu melaksanakan seluruh rukun salat secara berurutan dari niat hingga salam.",
    "answer": true,
    "explanation": "Benar! Tertib adalah rukun ke-13. Jika urutan rukun dibolak-balik dengan sengaja, maka salat menjadi tidak sah."
  },
  {
    "id": "ord-01",
    "rukunNumber": 1,
    "category": "Urutan",
    "type": "ordering",
    "tiles": [11, 19],
    "points": 35,
    "question": "Susunlah 4 Rukun Salat pertama secara berurutan dari awal!",
    "items": ["Niat", "Berdiri bagi yang Mampu", "Takbiratul Ihram", "Membaca Al-Fatihah"],
    "explanation": "Urutan 4 rukun pertama adalah: 1. Niat, 2. Berdiri bagi yang mampu, 3. Takbiratul Ihram, 4. Membaca Al-Fatihah."
  },
  {
    "id": "ord-02",
    "rukunNumber": 5,
    "category": "Urutan",
    "type": "ordering",
    "tiles": [36, 52],
    "points": 35,
    "question": "Susunlah urutan gerakan Rukun Salat setelah membaca Surah Al-Fatihah!",
    "items": ["Rukuk", "I'tidal", "Sujud Pertama", "Duduk Antara Dua Sujud"],
    "explanation": "Setelah membaca Al-Fatihah: Rukuk (5) -> I'tidal (6) -> Sujud Pertama (7) -> Duduk di Antara Dua Sujud (8)."
  },
  {
    "id": "ord-03",
    "rukunNumber": 9,
    "category": "Urutan",
    "type": "ordering",
    "tiles": [76, 94],
    "points": 35,
    "question": "Susunlah urutan 4 Rukun Salat terakhir menjelang penutup salat!",
    "items": ["Duduk Tasyahud Akhir", "Membaca Tasyahud Akhir", "Salawat Nabi", "Salam Pertama"],
    "explanation": "Menjelang akhir salat: Duduk Tasyahud Akhir (9) -> Membaca Tasyahud Akhir (10) -> Salawat Nabi SAW (11) -> Salam Pertama (12)."
  },
  {
    "id": "pose-01",
    "rukunNumber": 3,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [15, 23],
    "points": 30,
    "poseKey": "takbir",
    "question": "Perhatikan ilustrasi gerakan salat di bawah ini! Rukun apakah yang sedang dilakukan?",
    "options": ["Takbiratul Ihram", "Rukuk", "Duduk Tasyahud", "Sujud"],
    "answer": 0,
    "explanation": "Mengangkat kedua telapak tangan sejajar telinga/bahu sambil mengucap Allahu Akbar adalah Takbiratul Ihram (Rukun ke-3)."
  },
  {
    "id": "pose-02",
    "rukunNumber": 5,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [29, 47],
    "points": 30,
    "poseKey": "rukuk",
    "question": "Tebak gerakan rukun salat pada gambar! Punggung lurus rata dan tangan memegang lutut.",
    "options": ["I'tidal", "Rukuk", "Sujud", "Duduk Antara Dua Sujud"],
    "answer": 1,
    "explanation": "Membungkukkan badan dengan punggung rata dan telapak tangan memegang lutut adalah Rukuk (Rukun ke-5)."
  },
  {
    "id": "pose-03",
    "rukunNumber": 6,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [38, 67],
    "points": 30,
    "poseKey": "itidal",
    "question": "Gerakan bangkit dari rukuk hingga berdiri tegak kembali dengan tenang disebut...",
    "options": ["Takbiratul Ihram", "Tasyahud Akhir", "I'tidal", "Salam"],
    "answer": 2,
    "explanation": "Bangun dari rukuk dan kembali berdiri tegak dengan tuma'ninah disebut I'tidal (Rukun ke-6)."
  },
  {
    "id": "pose-04",
    "rukunNumber": 7,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [58, 72],
    "points": 30,
    "poseKey": "sujud",
    "question": "Tebak gerakan rukun salat ini! Dahi, hidung, telapak tangan, lutut, dan ujung kaki menyentuh lantai.",
    "options": ["Rukuk", "Sujud", "Duduk Iftirasy", "Berdiri Tegak"],
    "answer": 1,
    "explanation": "Meletakkan tujuh anggota sujud ke lantai dengan tuma'ninah adalah Sujud (Rukun ke-7)."
  },
  {
    "id": "pose-05",
    "rukunNumber": 8,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [61, 85, 90],
    "points": 30,
    "poseKey": "duduk",
    "question": "Gerakan duduk tenang setelah sujud pertama sebelum sujud kedua atau saat tahiyat disebut...",
    "options": ["Berdiri Tegak", "Duduk dalam Salat", "Rukuk", "I'tidal"],
    "answer": 1,
    "explanation": "Duduk dalam salat menjadi rukun pada Duduk di Antara Dua Sujud (Rukun ke-8) dan Duduk Tasyahud Akhir (Rukun ke-9)."
  }
]`);
function getPoseSVG(poseKey) {
	const skin = "#f5cba7";
	const robe = "#047857";
	const robeDark = "#064e3b";
	const cap = "#fef3c7";
	const mat = "#d97706";
	switch (poseKey) {
		case "takbir": return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Takbiratul Ihram">
          <rect x="25" y="114" width="110" height="8" rx="4" fill="${mat}" />
          <rect x="66" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="83" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="62" y="42" width="36" height="42" rx="12" fill="${robe}" />
          <path d="M62 48 L44 36 L44 22" stroke="${robe}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M98 48 L116 36 L116 22" stroke="${robe}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="44" cy="19" r="6" fill="${skin}" />
          <circle cx="116" cy="19" r="6" fill="${skin}" />
          <circle cx="80" cy="26" r="14" fill="${skin}" />
          <path d="M67 21 Q80 10 93 21 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="75" cy="26" r="1.8" fill="#1f2937" />
          <circle cx="85" cy="26" r="1.8" fill="#1f2937" />
        </svg>`;
		case "rukuk": return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Rukuk">
          <rect x="20" y="114" width="120" height="8" rx="4" fill="${mat}" />
          <rect x="92" y="64" width="13" height="50" rx="6" fill="${robeDark}" />
          <rect x="46" y="52" width="56" height="22" rx="11" fill="${robe}" />
          <path d="M58 66 L76 86 L94 84" stroke="${robe}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="95" cy="84" r="6" fill="${skin}" />
          <circle cx="38" cy="63" r="13" fill="${skin}" />
          <path d="M27 56 Q38 46 49 56 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="34" cy="65" r="1.8" fill="#1f2937" />
        </svg>`;
		case "itidal": return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi I'tidal">
          <rect x="25" y="114" width="110" height="8" rx="4" fill="${mat}" />
          <rect x="67" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="82" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="63" y="42" width="34" height="42" rx="12" fill="${robe}" />
          <path d="M62 47 L53 76" stroke="${robe}" stroke-width="9" stroke-linecap="round" fill="none" />
          <path d="M98 47 L107 76" stroke="${robe}" stroke-width="9" stroke-linecap="round" fill="none" />
          <circle cx="52" cy="79" r="5" fill="${skin}" />
          <circle cx="108" cy="79" r="5" fill="${skin}" />
          <path d="M132 70 L132 35 M124 44 L132 34 L140 44" stroke="#059669" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="80" cy="26" r="14" fill="${skin}" />
          <path d="M67 21 Q80 10 93 21 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="75" cy="26" r="1.8" fill="#1f2937" />
          <circle cx="85" cy="26" r="1.8" fill="#1f2937" />
        </svg>`;
		case "sujud": return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Sujud">
          <rect x="18" y="112" width="124" height="8" rx="4" fill="${mat}" />
          <path d="M126 108 L108 108 L102 88" stroke="${robeDark}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M104 82 Q82 60 56 88" stroke="${robe}" stroke-width="22" stroke-linecap="round" fill="none" />
          <path d="M72 86 L48 106 L34 106" stroke="${robe}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="33" cy="106" r="5" fill="${skin}" />
          <circle cx="48" cy="99" r="12" fill="${skin}" />
          <path d="M40 90 Q52 84 58 95 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
        </svg>`;
		default: return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Duduk dalam Salat">
          <rect x="22" y="112" width="116" height="8" rx="4" fill="${mat}" />
          <path d="M62 106 L104 106 L96 92 L72 92" stroke="${robeDark}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <rect x="65" y="54" width="32" height="40" rx="11" fill="${robe}" />
          <path d="M66 64 L54 88 L72 92" stroke="${robe}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="74" cy="92" r="5" fill="${skin}" />
          <circle cx="80" cy="36" r="14" fill="${skin}" />
          <path d="M67 31 Q80 20 93 31 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="75" cy="36" r="1.8" fill="#1f2937" />
          <circle cx="85" cy="36" r="1.8" fill="#1f2937" />
        </svg>`;
	}
}
var QuestionManager = class {
	constructor() {
		this.usedIds = /* @__PURE__ */ new Set();
	}
	resetSession() {
		this.usedIds.clear();
	}
	getQuestionForTile(tileNum) {
		const tileMatches = QUESTION_BANK.filter((q) => Array.isArray(q.tiles) && q.tiles.includes(tileNum) && !this.usedIds.has(q.id));
		if (tileMatches.length > 0) {
			const pick = tileMatches[Math.floor(Math.random() * tileMatches.length)];
			this.usedIds.add(pick.id);
			return pick;
		}
		const targetRukun = Math.min(13, Math.max(1, Math.ceil(tileNum / 100 * 13)));
		const rukunMatches = QUESTION_BANK.filter((q) => !this.usedIds.has(q.id) && Math.abs(q.rukunNumber - targetRukun) <= 1);
		if (rukunMatches.length > 0) {
			const pick = rukunMatches[Math.floor(Math.random() * rukunMatches.length)];
			this.usedIds.add(pick.id);
			return pick;
		}
		let remaining = QUESTION_BANK.filter((q) => !this.usedIds.has(q.id));
		if (remaining.length === 0) {
			this.usedIds.clear();
			const fallbackByTile = QUESTION_BANK.filter((q) => Array.isArray(q.tiles) && q.tiles.includes(tileNum));
			remaining = fallbackByTile.length > 0 ? fallbackByTile : QUESTION_BANK;
		}
		const pick = remaining[Math.floor(Math.random() * remaining.length)];
		this.usedIds.add(pick.id);
		return pick;
	}
	drawQuestion(tileNum = null) {
		if (typeof tileNum === "number") return this.getQuestionForTile(tileNum);
		return this.getQuestionForTile(Math.floor(Math.random() * 100) + 1);
	}
};
// \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					const handleSettle = (e) => {
						link.removeEventListener("load", handleSettle);
						link.removeEventListener("error", handleSettle);
						if (e.type === "error") rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`));
						else res(e);
					};
					link.addEventListener("load", handleSettle);
					link.addEventListener("error", handleSettle);
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
// ../../@vite-plugin-pwa/virtual:pwa-register
var autoUpdateMode = "true";
var selfDestroying = "false";
var auto = autoUpdateMode === "true";
var autoDestroy = selfDestroying === "true";
function registerSW(options = {}) {
	const { immediate = false, onNeedReload, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError } = options;
	let wb;
	let registerPromise;
	let sendSkipWaitingMessage;
	const updateServiceWorker = async (_reloadPage = true) => {
		await registerPromise;
		if (!auto) sendSkipWaitingMessage?.();
	};
	async function register() {
		if ("serviceWorker" in navigator) {
			wb = await __vitePreload(async () => {
				const { Workbox } = await import("./workbox-window.prod.es5-CzJxx9q2.js");
				return { Workbox };
			}, []).then(({ Workbox }) => {
				return new Workbox("/sw.js", {
					scope: "/",
					type: "classic"
				});
			}).catch((e) => {
				onRegisterError?.(e);
			});
			if (!wb) return;
			sendSkipWaitingMessage = () => {
				wb?.messageSkipWaiting();
			};
			if (!autoDestroy) {
				if (auto) {
					wb.addEventListener("activated", (event) => {
						if (event.isUpdate || event.isExternal) {
							if (onNeedReload) onNeedReload();
							else window.location.reload();
						}
					});
					wb.addEventListener("installed", (event) => {
						if (!event.isUpdate) onOfflineReady?.();
					});
				} else {
					let onNeedRefreshCalled = false;
					const showSkipWaitingPrompt = () => {
						onNeedRefreshCalled = true;
						wb?.addEventListener("controlling", (event) => {
							if (event.isUpdate) {
								if (onNeedReload) onNeedReload();
								else window.location.reload();
							}
						});
						onNeedRefresh?.();
					};
					wb.addEventListener("installed", (event) => {
						if (typeof event.isUpdate === "undefined") {
							if (typeof event.isExternal !== "undefined") {
								if (event.isExternal) showSkipWaitingPrompt();
								else !onNeedRefreshCalled && onOfflineReady?.();
							} else !onNeedRefreshCalled && onOfflineReady?.();
						} else if (!event.isUpdate) onOfflineReady?.();
					});
					wb.addEventListener("waiting", showSkipWaitingPrompt);
				}
			}
			wb.register({ immediate }).then((r) => {
				if (onRegisteredSW) onRegisteredSW("/sw.js", r);
				else onRegistered?.(r);
			}).catch((e) => {
				onRegisterError?.(e);
			});
		}
	}
	registerPromise = register();
	return updateServiceWorker;
}
// game.js
if (typeof window !== "undefined") registerSW({ immediate: true });
var LEADERBOARD_KEY = "sahabat_salat_leaderboard_v1";
var QUIZ_TILES = /* @__PURE__ */ new Set([
	2,
	7,
	11,
	15,
	19,
	23,
	29,
	36,
	38,
	47,
	52,
	58,
	61,
	67,
	72,
	76,
	81,
	85,
	90,
	94,
	99
]);
var LADDER_FROM_SET = new Set(LADDERS.map((l) => l.from));
var SNAKE_HEAD_SET = new Set(SNAKES.map((s) => s.head));
var ParticleSystem = class {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas ? canvas.getContext("2d") : null;
		this.particles = [];
		this.running = false;
		this._resize();
		window.addEventListener("resize", () => this._resize());
	}
	_resize() {
		if (!this.canvas || !this.canvas.parentElement) return;
		const rect = this.canvas.parentElement.getBoundingClientRect();
		this.canvas.width = Math.max(300, Math.floor(rect.width));
		this.canvas.height = Math.max(300, Math.floor(rect.height));
	}
	burstPercent(leftPct, topPct, theme = "gold", count = 24) {
		if (!this.canvas || !this.ctx) return;
		this._resize();
		const cx = leftPct / 100 * this.canvas.width;
		const cy = topPct / 100 * this.canvas.height;
		const palettes = {
			gold: [
				"#fde047",
				"#f59e0b",
				"#fef3c7",
				"#10b981"
			],
			emerald: [
				"#34d399",
				"#10b981",
				"#a7f3d0",
				"#fbbf24"
			],
			victory: [
				"#fde047",
				"#10b981",
				"#fb7185",
				"#38bdf8",
				"#f59e0b"
			]
		};
		const colors = palettes[theme] || palettes.gold;
		for (let i = 0; i < count; i++) {
			const angle = Math.PI * 2 * i / count + (Math.random() - .5) * .4;
			const speed = 1.8 + Math.random() * 4.5;
			this.particles.push({
				x: cx,
				y: cy,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 1.5,
				size: 4 + Math.random() * 5,
				color: colors[i % colors.length],
				alpha: 1,
				decay: .018 + Math.random() * .015,
				gravity: .12
			});
		}
		if (!this.running) {
			this.running = true;
			requestAnimationFrame(() => this._loop());
		}
	}
	celebrateBoard() {
		this.burstPercent(25, 25, "victory", 32);
		setTimeout(() => this.burstPercent(75, 28, "victory", 32), 180);
		setTimeout(() => this.burstPercent(50, 50, "victory", 40), 360);
	}
	_loop() {
		if (!this.ctx || !this.canvas) return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.x += p.vx;
			p.y += p.vy;
			p.vy += p.gravity;
			p.alpha -= p.decay;
			if (p.alpha <= 0) {
				this.particles.splice(i, 1);
				continue;
			}
			this.ctx.save();
			this.ctx.globalAlpha = Math.max(0, p.alpha);
			this.ctx.fillStyle = p.color;
			this.ctx.beginPath();
			this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			this.ctx.fill();
			this.ctx.restore();
		}
		if (this.particles.length > 0) requestAnimationFrame(() => this._loop());
		else this.running = false;
	}
};
var SahabatSalatGame = class {
	constructor() {
		this.playerCount = 2;
		this.setupConfigs = [
			{
				name: "Ahmad",
				avatarId: "ahmad",
				isBot: false
			},
			{
				name: "Aisyah",
				avatarId: "aisyah",
				isBot: false
			},
			{
				name: "Umar",
				avatarId: "umar",
				isBot: false
			},
			{
				name: "Fatimah",
				avatarId: "fatimah",
				isBot: false
			}
		];
		this.players = [];
		this.currentTurnIdx = 0;
		this.roundNumber = 1;
		this.isBusy = false;
		this.gameOver = false;
		this.tileEls = /* @__PURE__ */ new Map();
		this.questionManager = new QuestionManager();
		this.dice = new DiceController();
		this.ladderManager = null;
		this.snakeManager = null;
		this.particles = null;
		this._quizResolver = null;
		this._bannerTimeout = null;
		this._cacheDOM();
		this._bindEvents();
		this._renderAudioUI();
		this._renderSetupCards();
		this._renderGuideModalContent();
		this._buildBoard();
	}
	_cacheDOM() {
		this.lobbyScreen = document.getElementById("lobby-screen");
		this.gameScreen = document.getElementById("game-screen");
		this.setupGrid = document.getElementById("player-setup-grid");
		this.boardGrid = document.getElementById("board-grid");
		this.laddersLayer = document.getElementById("ladders-layer");
		this.snakesLayer = document.getElementById("snakes-layer");
		this.tokensLayer = document.getElementById("tokens-layer");
		this.particlesCanvas = document.getElementById("particles-canvas");
		this.boardBanner = document.getElementById("board-banner");
		this.boardBannerIcon = document.getElementById("board-banner-icon");
		this.boardBannerText = document.getElementById("board-banner-text");
		this.topbarTurnText = document.getElementById("topbar-turn-text");
		this.hudActiveAvatar = document.getElementById("hud-active-avatar");
		this.hudActiveName = document.getElementById("hud-active-name");
		this.hudStatusMsg = document.getElementById("hud-status-msg");
		this.rollBtn = document.getElementById("roll-dice-btn");
		this.rollBtnLabel = document.getElementById("roll-btn-label");
		this.playersRoster = document.getElementById("players-roster");
		this.turnCounterText = document.getElementById("turn-counter-text");
		this.lobbyAudioBtn = document.getElementById("lobby-audio-btn");
		this.gameMuteBtn = document.getElementById("game-mute-btn");
		this.volumeSlider = document.getElementById("volume-slider");
		this.quizModal = document.getElementById("quiz-modal");
		this.quizTypeBadge = document.getElementById("quiz-type-badge");
		this.quizPointsBadge = document.getElementById("quiz-points-badge");
		this.quizTitle = document.getElementById("quiz-title");
		this.quizIllustration = document.getElementById("quiz-illustration");
		this.quizOptionsArea = document.getElementById("quiz-options-area");
		this.quizOrderControls = document.getElementById("quiz-order-controls");
		this.orderResetBtn = document.getElementById("order-reset-btn");
		this.orderSubmitBtn = document.getElementById("order-submit-btn");
		this.quizFeedback = document.getElementById("quiz-feedback");
		this.feedbackIcon = document.getElementById("feedback-icon");
		this.feedbackTitle = document.getElementById("feedback-title");
		this.feedbackExplanation = document.getElementById("feedback-explanation");
		this.quizContinueBtn = document.getElementById("quiz-continue-btn");
		this.guideModal = document.getElementById("guide-modal");
		this.guideList = document.getElementById("guide-list");
		this.leaderboardModal = document.getElementById("leaderboard-modal");
		this.leaderboardList = document.getElementById("leaderboard-list");
		this.victoryModal = document.getElementById("victory-modal");
		this.victoryTitle = document.getElementById("victory-title");
		this.victoryWinnerSpot = document.getElementById("victory-winner-spot");
		this.victoryStandings = document.getElementById("victory-standings");
	}
	_bindEvents() {
		document.querySelectorAll(".count-tab").forEach((btn) => {
			btn.addEventListener("click", () => {
				sound.playClick();
				this.playerCount = Number(btn.dataset.count) || 2;
				document.querySelectorAll(".count-tab").forEach((b) => b.classList.toggle("is-selected", b === btn));
				this._renderSetupCards();
			});
		});
		document.getElementById("start-game-btn").addEventListener("click", () => {
			sound.playClick();
			this.startNewMatch();
		});
		this.lobbyAudioBtn.addEventListener("click", () => {
			sound.toggleMute();
			sound.playClick();
			this._renderAudioUI();
		});
		this.gameMuteBtn.addEventListener("click", () => {
			sound.toggleMute();
			sound.playClick();
			this._renderAudioUI();
		});
		this.volumeSlider.addEventListener("input", (e) => {
			sound.setVolume(Number(e.target.value) / 100);
			this._renderAudioUI();
		});
		this.rollBtn.addEventListener("click", () => this.handleRollRequest());
		window.addEventListener("keydown", (e) => {
			if (this.gameScreen.hidden || this.isBusy || this.gameOver) return;
			if (!this.quizModal.hidden || !this.guideModal.hidden || !this.victoryModal.hidden) return;
			if (e.code === "Space" || e.code === "Enter") {
				const active = this.players[this.currentTurnIdx];
				if (active && !active.isBot) {
					e.preventDefault();
					this.handleRollRequest();
				}
			}
		});
		document.getElementById("restart-game-btn").addEventListener("click", () => {
			sound.playClick();
			this.startNewMatch();
		});
		document.getElementById("back-to-lobby-btn").addEventListener("click", () => {
			sound.playClick();
			this._returnToLobby();
		});
		document.getElementById("open-guide-lobby-btn").addEventListener("click", () => {
			sound.playClick();
			this.guideModal.hidden = false;
		});
		document.getElementById("open-guide-game-btn").addEventListener("click", () => {
			sound.playClick();
			this.guideModal.hidden = false;
		});
		document.getElementById("close-guide-btn").addEventListener("click", () => {
			sound.playClick();
			this.guideModal.hidden = true;
		});
		document.getElementById("open-leaderboard-btn").addEventListener("click", () => {
			sound.playClick();
			this._renderLeaderboardModal();
			this.leaderboardModal.hidden = false;
		});
		document.getElementById("close-lb-btn").addEventListener("click", () => {
			sound.playClick();
			this.leaderboardModal.hidden = true;
		});
		document.getElementById("clear-lb-btn").addEventListener("click", () => {
			sound.playClick();
			localStorage.removeItem(LEADERBOARD_KEY);
			this._renderLeaderboardModal();
		});
		document.getElementById("play-again-btn").addEventListener("click", () => {
			sound.playClick();
			this.victoryModal.hidden = true;
			this.startNewMatch();
		});
		document.getElementById("victory-menu-btn").addEventListener("click", () => {
			sound.playClick();
			this.victoryModal.hidden = true;
			this._returnToLobby();
		});
		[this.guideModal, this.leaderboardModal].forEach((modal) => {
			modal.addEventListener("click", (e) => {
				if (e.target === modal) modal.hidden = true;
			});
		});
		this.quizContinueBtn.addEventListener("click", () => {
			sound.playClick();
			this.quizModal.hidden = true;
			if (this._quizResolver) {
				const res = this._quizResolver;
				this._quizResolver = null;
				res();
			}
		});
	}
	_renderAudioUI() {
		const muted = sound.muted || sound.volume === 0;
		const icon = muted ? "🔇" : "🔊";
		if (this.gameMuteBtn) this.gameMuteBtn.textContent = icon;
		if (this.lobbyAudioBtn) {
			const span = this.lobbyAudioBtn.querySelector(".audio-icon");
			const lbl = this.lobbyAudioBtn.querySelector(".btn-label");
			if (span) span.textContent = icon;
			if (lbl) lbl.textContent = muted ? "Mati" : "Suara";
		}
		if (this.volumeSlider) this.volumeSlider.value = String(Math.round(sound.volume * 100));
	}
	_renderSetupCards() {
		this.setupGrid.innerHTML = "";
		for (let i = 0; i < this.playerCount; i++) {
			const cfg = this.setupConfigs[i];
			const card = document.createElement("div");
			card.className = "player-setup-card";
			card.innerHTML = `
        <div class="setup-card-top">
          <span class="setup-player-tag">Pemain ${i + 1}</span>
          ${i > 0 ? `<button type="button" class="bot-toggle-btn ${cfg.isBot ? "is-bot" : ""}" data-slot="${i}">
                  ${cfg.isBot ? "🤖 Bot Pintar" : "👤 Manusia"}
                 </button>` : `<span class="bot-toggle-btn">👤 Pemain Utama</span>`}
        </div>
        <div class="setup-avatar-preview">
          <div class="avatar-circle-preview">${buildAvatarSVG(cfg.avatarId, false)}</div>
          <input
            type="text"
            class="player-name-input"
            maxlength="14"
            value="${cfg.name}"
            placeholder="Nama Pemain ${i + 1}"
            aria-label="Nama Pemain ${i + 1}"
          />
        </div>
        <div class="avatar-picker-row">
          ${AVATAR_CATALOG.map((av) => `
            <button
              type="button"
              class="avatar-choice-btn ${av.id === cfg.avatarId ? "is-selected" : ""}"
              data-avatar="${av.id}"
              title="Pilih ${av.label}"
              aria-label="Pilih karakter ${av.label}"
            >
              ${buildAvatarSVG(av.id, false)}
            </button>`).join("")}
        </div>
      `;
			card.querySelector(".player-name-input").addEventListener("input", (e) => {
				this.setupConfigs[i].name = e.target.value;
			});
			const botBtn = card.querySelector(".bot-toggle-btn[data-slot]");
			if (botBtn) botBtn.addEventListener("click", () => {
				sound.playClick();
				this.setupConfigs[i].isBot = !this.setupConfigs[i].isBot;
				this._renderSetupCards();
			});
			card.querySelectorAll(".avatar-choice-btn").forEach((avBtn) => {
				avBtn.addEventListener("click", () => {
					sound.playClick();
					this.setupConfigs[i].avatarId = avBtn.dataset.avatar;
					this._renderSetupCards();
				});
			});
			this.setupGrid.appendChild(card);
		}
	}
	_buildBoard() {
		this.boardGrid.innerHTML = "";
		this.tileEls.clear();
		for (let rowTop = 0; rowTop < 10; rowTop++) for (let col = 0; col < 10; col++) {
			const rowFromBottom = 9 - rowTop;
			const colInRow = rowFromBottom % 2 === 0 ? col : 9 - col;
			const tileNum = rowFromBottom * 10 + colInRow + 1;
			const cell = document.createElement("div");
			cell.className = "board-tile";
			cell.dataset.tile = String(tileNum);
			if (tileNum === 1) cell.classList.add("tile-start");
			else if (tileNum === 100) cell.classList.add("tile-finish");
			else if (QUIZ_TILES.has(tileNum)) cell.classList.add("tile-gold-soft");
			else if ((rowTop + col) % 2 === 0) cell.classList.add("tile-cream");
			else cell.classList.add("tile-mint");
			let badgeHtml = "";
			if (tileNum === 1) badgeHtml = "<span class=\"tile-start-label\">Mulai</span>";
			else if (tileNum === 100) badgeHtml = "<span class=\"tile-finish-label\">Finis 🏆</span>";
			else if (QUIZ_TILES.has(tileNum)) badgeHtml = "<span class=\"tile-badge\" title=\"Kuis Rukun Salat\">⭐</span>";
			else if (LADDER_FROM_SET.has(tileNum)) badgeHtml = "<span class=\"tile-badge\" title=\"Tangga Naik\">🪜</span>";
			else if (SNAKE_HEAD_SET.has(tileNum)) badgeHtml = "<span class=\"tile-badge\" title=\"Kepala Ular\">🐍</span>";
			cell.innerHTML = `<span class="tile-num">${tileNum}</span>${badgeHtml}`;
			this.boardGrid.appendChild(cell);
			this.tileEls.set(tileNum, cell);
		}
		this.ladderManager = new LadderManager(this.laddersLayer);
		this.snakeManager = new SnakeManager(this.snakesLayer);
		this.particles = new ParticleSystem(this.particlesCanvas);
	}
	startNewMatch() {
		this.lobbyScreen.hidden = true;
		this.lobbyScreen.classList.remove("is-active");
		this.gameScreen.hidden = false;
		this.gameScreen.classList.add("is-active");
		this.isBusy = false;
		this.gameOver = false;
		this.currentTurnIdx = 0;
		this.roundNumber = 1;
		this.questionManager.resetSession();
		this.tokensLayer.innerHTML = "";
		this.players = [];
		for (let i = 0; i < this.playerCount; i++) {
			const cfg = this.setupConfigs[i];
			const cleanName = (cfg.name || "").trim() || `Pemain ${i + 1}`;
			const p = new Player({
				id: i + 1,
				name: cleanName,
				avatarId: cfg.avatarId,
				isBot: cfg.isBot
			});
			p.createTokenElement(this.tokensLayer);
			const startInfo = getTileGridInfo(1);
			p.setBoardPercent(startInfo.leftPct, startInfo.topPct, true);
			this.players.push(p);
		}
		layoutAllTokens(this.players, this.players[0].id);
		this._updateHUD("Siap melempar dadu!");
		this.particles._resize();
		sound.startBgm();
	}
	_returnToLobby() {
		this.isBusy = false;
		this.gameOver = true;
		sound.stopBgm();
		this.gameScreen.hidden = true;
		this.gameScreen.classList.remove("is-active");
		this.lobbyScreen.hidden = false;
		this.lobbyScreen.classList.add("is-active");
	}
	_showBanner(icon, text, durationMs = 1900) {
		if (this._bannerTimeout) clearTimeout(this._bannerTimeout);
		this.boardBannerIcon.textContent = icon;
		this.boardBannerText.textContent = text;
		this.boardBanner.hidden = false;
		this._bannerTimeout = setTimeout(() => {
			this.boardBanner.hidden = true;
		}, durationMs);
	}
	_updateHUD(statusText) {
		const active = this.players[this.currentTurnIdx];
		if (!active) return;
		this.topbarTurnText.textContent = `Giliran ${active.pion.label}: ${active.name} (Kotak ${active.position})`;
		this.hudActiveAvatar.innerHTML = buildAvatarSVG(active.avatarId, false);
		this.hudActiveAvatar.style.borderColor = active.pion.primary;
		this.hudActiveName.textContent = active.isBot ? `${active.name} 🤖` : active.name;
		this.hudStatusMsg.textContent = statusText;
		this.turnCounterText.textContent = `Putaran ${this.roundNumber}`;
		this.rollBtn.disabled = this.isBusy || this.gameOver || active.isBot;
		this.rollBtnLabel.textContent = active.isBot ? "Giliran Bot..." : this.isBusy ? "Berjalan..." : "Lempar Dadu";
		this.playersRoster.innerHTML = this.players.map((p, idx) => `
      <div class="roster-item ${idx === this.currentTurnIdx ? "is-turn" : ""}">
        <div class="roster-avatar" style="border: 2.5px solid ${p.pion.primary};">${buildAvatarSVG(p.avatarId, false)}</div>
        <div class="roster-meta">
          <div class="roster-name">${this._escape(p.name)}${p.isBot ? " 🤖" : ""}</div>
          <div class="roster-sub">${p.pion.label} · Kotak ${p.position}/100</div>
        </div>
        <div class="roster-score">${p.score} pt</div>
      </div>`).join("");
	}
	_escape(str) {
		return str.replace(/[&<>"']/g, (ch) => ({
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#39;"
		})[ch]);
	}
	async handleRollRequest() {
		if (this.isBusy || this.gameOver) return;
		const active = this.players[this.currentTurnIdx];
		if (!active) return;
		this.isBusy = true;
		this._updateHUD("Melempar dadu...");
		const rolled = await this.dice.roll();
		this._updateHUD(`Dadu menunjukkan angka ${rolled}!`);
		const remaining = 100 - active.position;
		if (rolled > remaining) {
			sound.playBump();
			this._showBanner("🚧", `Butuh angka ${remaining} untuk pas di Finis!`, 2100);
			this._updateHUD(`Terlalu besar! Butuh tepat ${remaining} langkah.`);
			await new Promise((r) => setTimeout(r, 1100));
			this._advanceTurn();
			return;
		}
		await this._walkSteps(active, rolled);
		const ladder = this.ladderManager.getLadderAt(active.position);
		if (ladder) {
			this._showBanner("🪜", `${active.name} naik tangga ke kotak ${ladder.to}!`, 2e3);
			this._updateHUD(`Asyik! Memanjat tangga ke kotak ${ladder.to}...`);
			await this.ladderManager.animateClimb(active, ladder, this.particles);
			active.score += 10;
			layoutAllTokens(this.players, active.id);
		}
		const snake = this.snakeManager.getSnakeAt(active.position);
		if (snake) {
			this._showBanner("🐍", `Ups! Ular lucu menelan ${active.name} ke kotak ${snake.tail}!`, 2400);
			this._updateHUD(`Hati-hati! Turun ke kotak ${snake.tail}...`);
			await this.snakeManager.animateEat(active, snake, this.particles);
			layoutAllTokens(this.players, active.id);
		}
		if (active.position === 100) {
			await this._handleVictory(active);
			return;
		}
		if (QUIZ_TILES.has(active.position)) {
			this._updateHUD("Menjawab Tantangan Rukun Salat...");
			await this._runQuizForPlayer(active);
		}
		this._advanceTurn();
	}
	async _walkSteps(player, steps) {
		if (player.element) player.element.classList.add("is-walking", "is-active-turn");
		for (let s = 1; s <= steps; s++) {
			player.position += 1;
			const info = getTileGridInfo(player.position);
			player.setBoardPercent(info.leftPct, info.topPct);
			sound.playStep(s);
			const tileEl = this.tileEls.get(player.position);
			if (tileEl) {
				tileEl.classList.add("is-highlighted");
				setTimeout(() => tileEl.classList.remove("is-highlighted"), 260);
			}
			await new Promise((r) => setTimeout(r, 250));
		}
		if (player.element) player.element.classList.remove("is-walking");
		layoutAllTokens(this.players, player.id);
		await new Promise((r) => setTimeout(r, 150));
	}
	_advanceTurn() {
		if (this.gameOver) return;
		this.currentTurnIdx = (this.currentTurnIdx + 1) % this.players.length;
		if (this.currentTurnIdx === 0) this.roundNumber += 1;
		this.isBusy = false;
		const nextPlayer = this.players[this.currentTurnIdx];
		layoutAllTokens(this.players, nextPlayer.id);
		this._updateHUD(nextPlayer.isBot ? "Bot bersiap melempar dadu..." : "Giliranmu! Tekan Lempar Dadu.");
		if (nextPlayer.isBot) setTimeout(() => {
			if (!this.gameOver && !this.lobbyScreen.classList.contains("is-active")) this.handleRollRequest();
		}, 750);
	}
	async _runQuizForPlayer(player) {
		const q = this.questionManager.getQuestionForTile(player.position);
		this._renderQuizModal(q, player);
		this.quizModal.hidden = false;
		if (player.isBot) await this._simulateBotQuizAnswer(q, player);
		await new Promise((resolve) => {
			this._quizResolver = resolve;
		});
		this._updateHUD("Melanjutkan perjalanan...");
	}
	_renderQuizModal(q, player) {
		const catLabel = q.category || {
			multiple_choice: "Pilihan Ganda",
			true_false: "Benar/Salah",
			ordering: "Urutan",
			guess_pose: "Tebak Gerakan"
		}[q.type] || "Kuis";
		const rukunTag = q.rukunNumber ? ` · Rukun #${q.rukunNumber}` : "";
		this.quizTypeBadge.textContent = `Kotak ${player.position}${rukunTag} · ${catLabel} · ${player.name}`;
		this.quizPointsBadge.textContent = `+${q.points} Poin`;
		this.quizTitle.textContent = q.question;
		this.quizFeedback.hidden = true;
		this.quizFeedback.className = "quiz-feedback";
		this.quizOptionsArea.innerHTML = "";
		this.quizOrderControls.hidden = true;
		if (q.type === "guess_pose" && q.poseKey) {
			this.quizIllustration.hidden = false;
			this.quizIllustration.innerHTML = getPoseSVG(q.poseKey);
		} else {
			this.quizIllustration.hidden = true;
			this.quizIllustration.innerHTML = "";
		}
		if (q.type === "multiple_choice" || q.type === "guess_pose") {
			const keys = [
				"A",
				"B",
				"C",
				"D"
			];
			q.options.forEach((optText, idx) => {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "quiz-option-btn";
				btn.innerHTML = `<span class="option-key">${keys[idx]}</span><span>${optText}</span>`;
				btn.addEventListener("click", () => {
					this._lockQuizOptions();
					const isCorrect = idx === q.answer;
					btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
					if (!isCorrect) {
						const correctBtn = this.quizOptionsArea.children[q.answer];
						if (correctBtn) correctBtn.classList.add("is-correct");
					}
					this._finishQuizAnswer(player, q, isCorrect);
				});
				this.quizOptionsArea.appendChild(btn);
			});
		} else if (q.type === "true_false") {
			const grid = document.createElement("div");
			grid.className = "tf-grid";
			[{
				label: "✓ Benar",
				val: true
			}, {
				label: "✕ Salah",
				val: false
			}].forEach((choice) => {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "quiz-option-btn tf-btn";
				btn.textContent = choice.label;
				btn.addEventListener("click", () => {
					this._lockQuizOptions();
					const isCorrect = choice.val === q.answer;
					btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
					this._finishQuizAnswer(player, q, isCorrect);
				});
				grid.appendChild(btn);
			});
			this.quizOptionsArea.appendChild(grid);
		} else if (q.type === "ordering") this._renderOrderingQuiz(q, player);
	}
	_renderOrderingQuiz(q, player) {
		const shuffled = [...q.items].sort(() => Math.random() - .5);
		if (shuffled.every((item, idx) => item === q.items[idx])) shuffled.reverse();
		const selected = [];
		const slotsWrap = document.createElement("div");
		slotsWrap.className = "order-slots";
		const poolWrap = document.createElement("div");
		poolWrap.className = "order-pool";
		this.quizOptionsArea.appendChild(slotsWrap);
		this.quizOptionsArea.appendChild(poolWrap);
		this.quizOrderControls.hidden = false;
		const refreshOrderingUI = () => {
			slotsWrap.innerHTML = selected.length === 0 ? "<span style=\"color:#557268;font-size:0.85rem;font-weight:600;\">Ketuk pilihan di bawah secara berurutan (1 → 4)...</span>" : "";
			selected.forEach((item, idx) => {
				const chip = document.createElement("button");
				chip.type = "button";
				chip.className = "order-slot-chip";
				chip.textContent = `${idx + 1}. ${item} ✕`;
				chip.addEventListener("click", () => {
					sound.playClick();
					selected.splice(idx, 1);
					refreshOrderingUI();
				});
				slotsWrap.appendChild(chip);
			});
			poolWrap.innerHTML = "";
			shuffled.forEach((item) => {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "order-pool-btn";
				btn.textContent = item;
				btn.disabled = selected.includes(item);
				btn.addEventListener("click", () => {
					sound.playClick();
					selected.push(item);
					refreshOrderingUI();
				});
				poolWrap.appendChild(btn);
			});
			this.orderSubmitBtn.disabled = selected.length !== q.items.length;
		};
		this.orderResetBtn.onclick = () => {
			sound.playClick();
			selected.length = 0;
			refreshOrderingUI();
		};
		this.orderSubmitBtn.onclick = () => {
			this.quizOrderControls.hidden = true;
			slotsWrap.querySelectorAll("button").forEach((b) => b.disabled = true);
			const isCorrect = q.items.every((val, idx) => selected[idx] === val);
			this._finishQuizAnswer(player, q, isCorrect);
		};
		refreshOrderingUI();
	}
	_lockQuizOptions() {
		this.quizOptionsArea.querySelectorAll("button").forEach((b) => {
			b.disabled = true;
		});
	}
	_finishQuizAnswer(player, q, isCorrect) {
		player.answeredCount += 1;
		if (isCorrect) {
			player.correctCount += 1;
			player.streak += 1;
			const bonus = player.streak >= 2 ? 5 : 0;
			const earned = q.points + bonus;
			player.score += earned;
			sound.playCorrect();
			const pos = getTileGridInfo(player.position);
			this.particles.burstPercent(pos.leftPct, pos.topPct, "gold", 20);
			this.quizFeedback.className = "quiz-feedback is-success";
			this.feedbackIcon.textContent = "🎉";
			this.feedbackTitle.textContent = `Benar! +${earned} Poin${bonus > 0 ? " (Bonus Beruntun!)" : ""}`;
		} else {
			player.streak = 0;
			sound.playWrong();
			this.quizFeedback.className = "quiz-feedback is-error";
			this.feedbackIcon.textContent = "💡";
			this.feedbackTitle.textContent = "Kurang Tepat — Mari Pelajari!";
		}
		this.feedbackExplanation.textContent = q.explanation;
		this.quizFeedback.hidden = false;
		this._updateHUD(isCorrect ? "Jawaban tepat!" : "Belajar bersama rukun salat!");
	}
	async _simulateBotQuizAnswer(q, botPlayer) {
		await new Promise((r) => setTimeout(r, 950));
		const botSmart = Math.random() < .72;
		if (q.type === "ordering") {
			this.quizOrderControls.hidden = true;
			this._finishQuizAnswer(botPlayer, q, botSmart);
		} else {
			this._lockQuizOptions();
			this._finishQuizAnswer(botPlayer, q, botSmart);
		}
		await new Promise((r) => setTimeout(r, 1500));
		this.quizModal.hidden = true;
		if (this._quizResolver) {
			const res = this._quizResolver;
			this._quizResolver = null;
			res();
		}
	}
	async _handleVictory(winner) {
		this.gameOver = true;
		this.isBusy = false;
		winner.score += 50;
		this._updateHUD(`Alhamdulillah! ${winner.name} mencapai Finis!`);
		sound.stopBgm();
		sound.playVictory();
		this.particles.celebrateBoard();
		this._saveMatchToLeaderboard(winner);
		await new Promise((r) => setTimeout(r, 650));
		this.victoryTitle.textContent = `${winner.name} Menang!`;
		this.victoryWinnerSpot.innerHTML = `
      <div class="roster-avatar" style="width:54px;height:54px;">${buildAvatarSVG(winner.avatarId, false)}</div>
      <div style="text-align:left;">
        <div style="font-family:var(--font-display);font-size:1.15rem;color:#064e3b;">${this._escape(winner.name)}</div>
        <div style="font-size:0.86rem;font-weight:700;color:#92400e;">Skor Akhir: ${winner.score} Poin · Kuis Benar: ${winner.correctCount}/${winner.answeredCount}</div>
      </div>
    `;
		const ranked = [...this.players].sort((a, b) => {
			if (a.id === winner.id) return -1;
			if (b.id === winner.id) return 1;
			if (b.position !== a.position) return b.position - a.position;
			return b.score - a.score;
		});
		this.victoryStandings.innerHTML = ranked.map((p, idx) => `
      <div class="lb-row">
        <span class="lb-rank">#${idx + 1}</span>
        <div class="roster-avatar">${buildAvatarSVG(p.avatarId, false)}</div>
        <div class="lb-info">
          <div class="lb-name">${this._escape(p.name)}</div>
          <div class="lb-meta">Kotak ${p.position} · Benar ${p.correctCount}/${p.answeredCount}</div>
        </div>
        <div class="lb-score">${p.score} pt</div>
      </div>`).join("");
		this.victoryModal.hidden = false;
	}
	_saveMatchToLeaderboard(winner) {
		try {
			const raw = localStorage.getItem(LEADERBOARD_KEY);
			const list = raw ? JSON.parse(raw) : [];
			list.unshift({
				name: winner.name,
				avatarId: winner.avatarId,
				score: winner.score,
				correct: winner.correctCount,
				answered: winner.answeredCount,
				date: (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "short",
					year: "numeric"
				})
			});
			localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 15)));
		} catch {}
	}
	_renderLeaderboardModal() {
		let list = [];
		try {
			const raw = localStorage.getItem(LEADERBOARD_KEY);
			list = raw ? JSON.parse(raw) : [];
		} catch {
			list = [];
		}
		if (list.length === 0) {
			this.leaderboardList.innerHTML = "<div class=\"lb-empty\">Belum ada catatan kemenangan. Ayo mainkan satu babak!</div>";
			return;
		}
		const sorted = [...list].sort((a, b) => b.score - a.score);
		this.leaderboardList.innerHTML = sorted.map((entry, idx) => `
      <div class="lb-row">
        <span class="lb-rank">${idx + 1}</span>
        <div class="roster-avatar">${buildAvatarSVG(entry.avatarId || "ahmad", false)}</div>
        <div class="lb-info">
          <div class="lb-name">${this._escape(entry.name || "Sahabat")}</div>
          <div class="lb-meta">${entry.date || ""} · Kuis ${entry.correct ?? 0}/${entry.answered ?? 0}</div>
        </div>
        <div class="lb-score">${entry.score} pt</div>
      </div>`).join("");
	}
	_renderGuideModalContent() {
		this.guideList.innerHTML = RUKUN_SALAT_LIST.map((item) => `
      <div class="guide-item">
        <div class="guide-num">${item.num}</div>
        <div class="guide-body">
          <h4>${item.name}<span class="guide-cat">· ${item.category}</span></h4>
          <p>${item.desc}</p>
        </div>
      </div>`).join("");
	}
};
function initPWAInstallAndOffline() {
	const installBtn = document.getElementById("install-app-btn");
	const installModal = document.getElementById("install-modal");
	const installBody = document.getElementById("install-guide-body");
	const closeInstallBtn = document.getElementById("close-install-btn");
	const offlineToast = document.getElementById("offline-indicator");
	const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true || Boolean(window.Capacitor?.isNativePlatform?.());
	const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
	let deferredPrompt = null;
	const updateOfflineUI = () => {
		if (offlineToast) offlineToast.hidden = navigator.onLine;
	};
	window.addEventListener("online", updateOfflineUI);
	window.addEventListener("offline", updateOfflineUI);
	updateOfflineUI();
	if (!installBtn || isStandalone) return;
	installBtn.hidden = false;
	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		deferredPrompt = e;
		installBtn.hidden = false;
	});
	window.addEventListener("appinstalled", () => {
		deferredPrompt = null;
		installBtn.hidden = true;
		if (installModal) installModal.hidden = true;
	});
	installBtn.addEventListener("click", async () => {
		sound.playClick();
		if (deferredPrompt) {
			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === "accepted") {
				deferredPrompt = null;
				installBtn.hidden = true;
			}
			return;
		}
		if (!installModal || !installBody) return;
		if (isIOS) installBody.innerHTML = `
        <div class="guide-item"><div class="guide-num">1</div><div class="guide-body"><h4>Buka Menu Bagikan (Share)</h4><p>Ketuk ikon Bagikan di bilah bawah Safari.</p></div></div>
        <div class="guide-item"><div class="guide-num">2</div><div class="guide-body"><h4>Tambahkan ke Layar Utama</h4><p>Pilih <strong>Add to Home Screen</strong> lalu ketuk <strong>Add</strong> untuk bermain offline seperti aplikasi native.</p></div></div>
      `;
		else installBody.innerHTML = `
        <div class="guide-item"><div class="guide-num">1</div><div class="guide-body"><h4>Pasang Langsung di Android Chrome</h4><p>Ketuk menu titik tiga (⋮) di pojok kanan atas browser lalu pilih <strong>Instal aplikasi</strong> atau <strong>Tambahkan ke layar utama</strong>.</p></div></div>
        <div class="guide-item"><div class="guide-num">2</div><div class="guide-body"><h4>Kompilasi File APK Android (Capacitor)</h4><p>Proyek Capacitor sudah siap di folder <code>android/</code>. Jalankan <code>npm run android:apk</code> pada komputer dengan Android Studio / Java SDK untuk menghasilkan file <code>app-debug.apk</code>.</p></div></div>
      `;
		installModal.hidden = false;
	});
	if (closeInstallBtn && installModal) {
		closeInstallBtn.addEventListener("click", () => {
			sound.playClick();
			installModal.hidden = true;
		});
		installModal.addEventListener("click", (e) => {
			if (e.target === installModal) installModal.hidden = true;
		});
	}
}
window.addEventListener("DOMContentLoaded", () => {
	new SahabatSalatGame();
	initPWAInstallAndOffline();
});
