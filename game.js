// game.js — Sahabat Salat Main Game State Machine, Board, Quiz, Particles & LocalStorage

import { AVATAR_CATALOG, buildAvatarSVG, getTileGridInfo, layoutAllTokens, Player } from './player.js';
import { DiceController } from './dice.js';
import { LADDERS, LadderManager } from './ladder.js';
import { SNAKES, SnakeManager } from './snake.js';
import { getPoseSVG, QuestionManager, RUKUN_SALAT_LIST } from './questions.js';
import { sound } from './sound.js';
import { registerSW } from 'virtual:pwa-register';

if (typeof window !== 'undefined') {
  registerSW({ immediate: true });
}

const LEADERBOARD_KEY = 'sahabat_salat_leaderboard_v1';

const QUIZ_TILES = new Set([
  2, 7, 11, 15, 19, 23, 29, 36, 38, 47, 52, 58, 61, 67, 72, 76, 81, 85, 90, 94, 99
]);

const LADDER_FROM_SET = new Set(LADDERS.map((l) => l.from));
const SNAKE_HEAD_SET = new Set(SNAKES.map((s) => s.head));

// ==================== CANVAS PARTICLE SYSTEM ====================
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.running = false;
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = Math.max(300, Math.floor(rect.width));
    this.canvas.height = Math.max(300, Math.floor(rect.height));
  }

  burstPercent(leftPct, topPct, theme = 'gold', count = 24) {
    if (!this.canvas || !this.ctx) return;
    this._resize();
    const cx = (leftPct / 100) * this.canvas.width;
    const cy = (topPct / 100) * this.canvas.height;

    const palettes = {
      gold: ['#fde047', '#f59e0b', '#fef3c7', '#10b981'],
      emerald: ['#34d399', '#10b981', '#a7f3d0', '#fbbf24'],
      victory: ['#fde047', '#10b981', '#fb7185', '#38bdf8', '#f59e0b']
    };
    const colors = palettes[theme] || palettes.gold;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.8 + Math.random() * 4.5;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 4 + Math.random() * 5,
        color: colors[i % colors.length],
        alpha: 1,
        decay: 0.018 + Math.random() * 0.015,
        gravity: 0.12
      });
    }

    if (!this.running) {
      this.running = true;
      requestAnimationFrame(() => this._loop());
    }
  }

  celebrateBoard() {
    this.burstPercent(25, 25, 'victory', 32);
    setTimeout(() => this.burstPercent(75, 28, 'victory', 32), 180);
    setTimeout(() => this.burstPercent(50, 50, 'victory', 40), 360);
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

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this._loop());
    } else {
      this.running = false;
    }
  }
}

// ==================== MAIN GAME CONTROLLER ====================
class SahabatSalatGame {
  constructor() {
    this.playerCount = 2;
    this.setupConfigs = [
      { name: 'Ahmad', avatarId: 'ahmad', isBot: false },
      { name: 'Aisyah', avatarId: 'aisyah', isBot: false },
      { name: 'Umar', avatarId: 'umar', isBot: false },
      { name: 'Fatimah', avatarId: 'fatimah', isBot: false }
    ];

    this.players = [];
    this.currentTurnIdx = 0;
    this.roundNumber = 1;
    this.isBusy = false;
    this.gameOver = false;
    this.tileEls = new Map();

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
    this.lobbyScreen = document.getElementById('lobby-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.setupGrid = document.getElementById('player-setup-grid');

    this.boardGrid = document.getElementById('board-grid');
    this.laddersLayer = document.getElementById('ladders-layer');
    this.snakesLayer = document.getElementById('snakes-layer');
    this.tokensLayer = document.getElementById('tokens-layer');
    this.particlesCanvas = document.getElementById('particles-canvas');

    this.boardBanner = document.getElementById('board-banner');
    this.boardBannerIcon = document.getElementById('board-banner-icon');
    this.boardBannerText = document.getElementById('board-banner-text');

    this.topbarTurnText = document.getElementById('topbar-turn-text');
    this.hudActiveAvatar = document.getElementById('hud-active-avatar');
    this.hudActiveName = document.getElementById('hud-active-name');
    this.hudStatusMsg = document.getElementById('hud-status-msg');
    this.rollBtn = document.getElementById('roll-dice-btn');
    this.rollBtnLabel = document.getElementById('roll-btn-label');
    this.playersRoster = document.getElementById('players-roster');
    this.turnCounterText = document.getElementById('turn-counter-text');

    this.lobbyAudioBtn = document.getElementById('lobby-audio-btn');
    this.gameMuteBtn = document.getElementById('game-mute-btn');
    this.volumeSlider = document.getElementById('volume-slider');

    // Modals
    this.quizModal = document.getElementById('quiz-modal');
    this.quizTypeBadge = document.getElementById('quiz-type-badge');
    this.quizPointsBadge = document.getElementById('quiz-points-badge');
    this.quizTitle = document.getElementById('quiz-title');
    this.quizIllustration = document.getElementById('quiz-illustration');
    this.quizOptionsArea = document.getElementById('quiz-options-area');
    this.quizOrderControls = document.getElementById('quiz-order-controls');
    this.orderResetBtn = document.getElementById('order-reset-btn');
    this.orderSubmitBtn = document.getElementById('order-submit-btn');
    this.quizFeedback = document.getElementById('quiz-feedback');
    this.feedbackIcon = document.getElementById('feedback-icon');
    this.feedbackTitle = document.getElementById('feedback-title');
    this.feedbackExplanation = document.getElementById('feedback-explanation');
    this.quizContinueBtn = document.getElementById('quiz-continue-btn');

    this.guideModal = document.getElementById('guide-modal');
    this.guideList = document.getElementById('guide-list');
    this.leaderboardModal = document.getElementById('leaderboard-modal');
    this.leaderboardList = document.getElementById('leaderboard-list');
    this.victoryModal = document.getElementById('victory-modal');
    this.victoryTitle = document.getElementById('victory-title');
    this.victoryWinnerSpot = document.getElementById('victory-winner-spot');
    this.victoryStandings = document.getElementById('victory-standings');
  }

  _bindEvents() {
    // Player count tabs
    document.querySelectorAll('.count-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        this.playerCount = Number(btn.dataset.count) || 2;
        document.querySelectorAll('.count-tab').forEach((b) =>
          b.classList.toggle('is-selected', b === btn)
        );
        this._renderSetupCards();
      });
    });

    // Start Game
    document.getElementById('start-game-btn').addEventListener('click', () => {
      sound.playClick();
      this.startNewMatch();
    });

    // Audio controls
    this.lobbyAudioBtn.addEventListener('click', () => {
      sound.toggleMute();
      sound.playClick();
      this._renderAudioUI();
    });

    this.gameMuteBtn.addEventListener('click', () => {
      sound.toggleMute();
      sound.playClick();
      this._renderAudioUI();
    });

    this.volumeSlider.addEventListener('input', (e) => {
      sound.setVolume(Number(e.target.value) / 100);
      this._renderAudioUI();
    });

    // Roll button
    this.rollBtn.addEventListener('click', () => this.handleRollRequest());

    // Keyboard shortcut Space / Enter
    window.addEventListener('keydown', (e) => {
      if (this.gameScreen.hidden || this.isBusy || this.gameOver) return;
      if (!this.quizModal.hidden || !this.guideModal.hidden || !this.victoryModal.hidden) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        const active = this.players[this.currentTurnIdx];
        if (active && !active.isBot) {
          e.preventDefault();
          this.handleRollRequest();
        }
      }
    });

    // Topbar navigation
    document.getElementById('restart-game-btn').addEventListener('click', () => {
      sound.playClick();
      this.startNewMatch();
    });

    document.getElementById('back-to-lobby-btn').addEventListener('click', () => {
      sound.playClick();
      this._returnToLobby();
    });

    // Guide modal
    document.getElementById('open-guide-lobby-btn').addEventListener('click', () => {
      sound.playClick();
      this.guideModal.hidden = false;
    });
    document.getElementById('open-guide-game-btn').addEventListener('click', () => {
      sound.playClick();
      this.guideModal.hidden = false;
    });
    document.getElementById('close-guide-btn').addEventListener('click', () => {
      sound.playClick();
      this.guideModal.hidden = true;
    });

    // Leaderboard modal
    document.getElementById('open-leaderboard-btn').addEventListener('click', () => {
      sound.playClick();
      this._renderLeaderboardModal();
      this.leaderboardModal.hidden = false;
    });
    document.getElementById('close-lb-btn').addEventListener('click', () => {
      sound.playClick();
      this.leaderboardModal.hidden = true;
    });
    document.getElementById('clear-lb-btn').addEventListener('click', () => {
      sound.playClick();
      localStorage.removeItem(LEADERBOARD_KEY);
      this._renderLeaderboardModal();
    });

    // Victory modal buttons
    document.getElementById('play-again-btn').addEventListener('click', () => {
      sound.playClick();
      this.victoryModal.hidden = true;
      this.startNewMatch();
    });
    document.getElementById('victory-menu-btn').addEventListener('click', () => {
      sound.playClick();
      this.victoryModal.hidden = true;
      this._returnToLobby();
    });

    // Close guide/leaderboard on backdrop tap
    [this.guideModal, this.leaderboardModal].forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.hidden = true;
      });
    });

    // Quiz continue
    this.quizContinueBtn.addEventListener('click', () => {
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
    const icon = muted ? '🔇' : '🔊';
    if (this.gameMuteBtn) this.gameMuteBtn.textContent = icon;
    if (this.lobbyAudioBtn) {
      const span = this.lobbyAudioBtn.querySelector('.audio-icon');
      const lbl = this.lobbyAudioBtn.querySelector('.btn-label');
      if (span) span.textContent = icon;
      if (lbl) lbl.textContent = muted ? 'Mati' : 'Suara';
    }
    if (this.volumeSlider) {
      this.volumeSlider.value = String(Math.round(sound.volume * 100));
    }
  }

  _renderSetupCards() {
    this.setupGrid.innerHTML = '';
    for (let i = 0; i < this.playerCount; i++) {
      const cfg = this.setupConfigs[i];
      const card = document.createElement('div');
      card.className = 'player-setup-card';

      card.innerHTML = `
        <div class="setup-card-top">
          <span class="setup-player-tag">Pemain ${i + 1}</span>
          ${
            i > 0
              ? `<button type="button" class="bot-toggle-btn ${cfg.isBot ? 'is-bot' : ''}" data-slot="${i}">
                  ${cfg.isBot ? '🤖 Bot Pintar' : '👤 Manusia'}
                 </button>`
              : `<span class="bot-toggle-btn">👤 Pemain Utama</span>`
          }
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
          ${AVATAR_CATALOG.map(
            (av) => `
            <button
              type="button"
              class="avatar-choice-btn ${av.id === cfg.avatarId ? 'is-selected' : ''}"
              data-avatar="${av.id}"
              title="Pilih ${av.label}"
              aria-label="Pilih karakter ${av.label}"
            >
              ${buildAvatarSVG(av.id, false)}
            </button>`
          ).join('')}
        </div>
      `;

      const nameInput = card.querySelector('.player-name-input');
      nameInput.addEventListener('input', (e) => {
        this.setupConfigs[i].name = e.target.value;
      });

      const botBtn = card.querySelector('.bot-toggle-btn[data-slot]');
      if (botBtn) {
        botBtn.addEventListener('click', () => {
          sound.playClick();
          this.setupConfigs[i].isBot = !this.setupConfigs[i].isBot;
          this._renderSetupCards();
        });
      }

      card.querySelectorAll('.avatar-choice-btn').forEach((avBtn) => {
        avBtn.addEventListener('click', () => {
          sound.playClick();
          this.setupConfigs[i].avatarId = avBtn.dataset.avatar;
          this._renderSetupCards();
        });
      });

      this.setupGrid.appendChild(card);
    }
  }

  _buildBoard() {
    this.boardGrid.innerHTML = '';
    this.tileEls.clear();

    // Render 10x10 cells in DOM order (top row to bottom row, left to right)
    for (let rowTop = 0; rowTop < 10; rowTop++) {
      for (let col = 0; col < 10; col++) {
        const rowFromBottom = 9 - rowTop;
        const colInRow = rowFromBottom % 2 === 0 ? col : 9 - col;
        const tileNum = rowFromBottom * 10 + colInRow + 1;

        const cell = document.createElement('div');
        cell.className = 'board-tile';
        cell.dataset.tile = String(tileNum);

        if (tileNum === 1) {
          cell.classList.add('tile-start');
        } else if (tileNum === 100) {
          cell.classList.add('tile-finish');
        } else if (QUIZ_TILES.has(tileNum)) {
          cell.classList.add('tile-gold-soft');
        } else if ((rowTop + col) % 2 === 0) {
          cell.classList.add('tile-cream');
        } else {
          cell.classList.add('tile-mint');
        }

        let badgeHtml = '';
        if (tileNum === 1) {
          badgeHtml = '<span class="tile-start-label">Mulai</span>';
        } else if (tileNum === 100) {
          badgeHtml = '<span class="tile-finish-label">Finis 🏆</span>';
        } else if (QUIZ_TILES.has(tileNum)) {
          badgeHtml = '<span class="tile-badge" title="Kuis Rukun Salat">⭐</span>';
        } else if (LADDER_FROM_SET.has(tileNum)) {
          badgeHtml = '<span class="tile-badge" title="Tangga Naik">🪜</span>';
        } else if (SNAKE_HEAD_SET.has(tileNum)) {
          badgeHtml = '<span class="tile-badge" title="Kepala Ular">🐍</span>';
        }

        cell.innerHTML = `<span class="tile-num">${tileNum}</span>${badgeHtml}`;
        this.boardGrid.appendChild(cell);
        this.tileEls.set(tileNum, cell);
      }
    }

    this.ladderManager = new LadderManager(this.laddersLayer);
    this.snakeManager = new SnakeManager(this.snakesLayer);
    this.particles = new ParticleSystem(this.particlesCanvas);
  }

  startNewMatch() {
    this.lobbyScreen.hidden = true;
    this.lobbyScreen.classList.remove('is-active');
    this.gameScreen.hidden = false;
    this.gameScreen.classList.add('is-active');

    this.isBusy = false;
    this.gameOver = false;
    this.currentTurnIdx = 0;
    this.roundNumber = 1;
    this.questionManager.resetSession();
    this.tokensLayer.innerHTML = '';

    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      const cfg = this.setupConfigs[i];
      const cleanName = (cfg.name || '').trim() || `Pemain ${i + 1}`;
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
    this._updateHUD('Siap melempar dadu!');
    this.particles._resize();
    sound.startBgm();
  }

  _returnToLobby() {
    this.isBusy = false;
    this.gameOver = true;
    sound.stopBgm();
    this.gameScreen.hidden = true;
    this.gameScreen.classList.remove('is-active');
    this.lobbyScreen.hidden = false;
    this.lobbyScreen.classList.add('is-active');
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
    this.rollBtnLabel.textContent = active.isBot
      ? 'Giliran Bot...'
      : this.isBusy
        ? 'Berjalan...'
        : 'Lempar Dadu';

    // Update Roster
    this.playersRoster.innerHTML = this.players
      .map(
        (p, idx) => `
      <div class="roster-item ${idx === this.currentTurnIdx ? 'is-turn' : ''}">
        <div class="roster-avatar" style="border: 2.5px solid ${p.pion.primary};">${buildAvatarSVG(p.avatarId, false)}</div>
        <div class="roster-meta">
          <div class="roster-name">${this._escape(p.name)}${p.isBot ? ' 🤖' : ''}</div>
          <div class="roster-sub">${p.pion.label} · Kotak ${p.position}/100</div>
        </div>
        <div class="roster-score">${p.score} pt</div>
      </div>`
      )
      .join('');
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

  async handleRollRequest() {
    if (this.isBusy || this.gameOver) return;
    const active = this.players[this.currentTurnIdx];
    if (!active) return;

    this.isBusy = true;
    this._updateHUD('Melempar dadu...');

    const rolled = await this.dice.roll();
    this._updateHUD(`Dadu menunjukkan angka ${rolled}!`);

    const remaining = 100 - active.position;
    if (rolled > remaining) {
      sound.playBump();
      this._showBanner('🚧', `Butuh angka ${remaining} untuk pas di Finis!`, 2100);
      this._updateHUD(`Terlalu besar! Butuh tepat ${remaining} langkah.`);
      await new Promise((r) => setTimeout(r, 1100));
      this._advanceTurn();
      return;
    }

    // Step-by-step walking animation
    await this._walkSteps(active, rolled);

    // Check Ladder
    const ladder = this.ladderManager.getLadderAt(active.position);
    if (ladder) {
      this._showBanner('🪜', `${active.name} naik tangga ke kotak ${ladder.to}!`, 2000);
      this._updateHUD(`Asyik! Memanjat tangga ke kotak ${ladder.to}...`);
      await this.ladderManager.animateClimb(active, ladder, this.particles);
      active.score += 10;
      layoutAllTokens(this.players, active.id);
    }

    // Check Snake
    const snake = this.snakeManager.getSnakeAt(active.position);
    if (snake) {
      this._showBanner('🐍', `Ups! Ular lucu menelan ${active.name} ke kotak ${snake.tail}!`, 2400);
      this._updateHUD(`Hati-hati! Turun ke kotak ${snake.tail}...`);
      await this.snakeManager.animateEat(active, snake, this.particles);
      layoutAllTokens(this.players, active.id);
    }

    // Check Win Condition
    if (active.position === 100) {
      await this._handleVictory(active);
      return;
    }

    // Check Quiz Tile
    if (QUIZ_TILES.has(active.position)) {
      this._updateHUD('Menjawab Tantangan Rukun Salat...');
      await this._runQuizForPlayer(active);
    }

    this._advanceTurn();
  }

  async _walkSteps(player, steps) {
    if (player.element) {
      player.element.classList.add('is-walking', 'is-active-turn');
    }

    for (let s = 1; s <= steps; s++) {
      player.position += 1;
      const info = getTileGridInfo(player.position);
      player.setBoardPercent(info.leftPct, info.topPct);
      sound.playStep(s);

      const tileEl = this.tileEls.get(player.position);
      if (tileEl) {
        tileEl.classList.add('is-highlighted');
        setTimeout(() => tileEl.classList.remove('is-highlighted'), 260);
      }

      await new Promise((r) => setTimeout(r, 250));
    }

    if (player.element) {
      player.element.classList.remove('is-walking');
    }
    layoutAllTokens(this.players, player.id);
    await new Promise((r) => setTimeout(r, 150));
  }

  _advanceTurn() {
    if (this.gameOver) return;
    this.currentTurnIdx = (this.currentTurnIdx + 1) % this.players.length;
    if (this.currentTurnIdx === 0) {
      this.roundNumber += 1;
    }
    this.isBusy = false;

    const nextPlayer = this.players[this.currentTurnIdx];
    layoutAllTokens(this.players, nextPlayer.id);
    this._updateHUD(nextPlayer.isBot ? 'Bot bersiap melempar dadu...' : 'Giliranmu! Tekan Lempar Dadu.');

    if (nextPlayer.isBot) {
      setTimeout(() => {
        if (!this.gameOver && !this.lobbyScreen.classList.contains('is-active')) {
          this.handleRollRequest();
        }
      }, 750);
    }
  }

  async _runQuizForPlayer(player) {
    const q = this.questionManager.getQuestionForTile(player.position);
    this._renderQuizModal(q, player);
    this.quizModal.hidden = false;

    if (player.isBot) {
      await this._simulateBotQuizAnswer(q, player);
    }

    await new Promise((resolve) => {
      this._quizResolver = resolve;
    });

    this._updateHUD('Melanjutkan perjalanan...');
  }

  _renderQuizModal(q, player) {
    const fallbackLabels = {
      multiple_choice: 'Pilihan Ganda',
      true_false: 'Benar/Salah',
      ordering: 'Urutan',
      guess_pose: 'Tebak Gerakan'
    };

    const catLabel = q.category || fallbackLabels[q.type] || 'Kuis';
    const rukunTag = q.rukunNumber ? ` · Rukun #${q.rukunNumber}` : '';
    this.quizTypeBadge.textContent = `Kotak ${player.position}${rukunTag} · ${catLabel} · ${player.name}`;
    this.quizPointsBadge.textContent = `+${q.points} Poin`;
    this.quizTitle.textContent = q.question;

    this.quizFeedback.hidden = true;
    this.quizFeedback.className = 'quiz-feedback';
    this.quizOptionsArea.innerHTML = '';
    this.quizOrderControls.hidden = true;

    if (q.type === 'guess_pose' && q.poseKey) {
      this.quizIllustration.hidden = false;
      this.quizIllustration.innerHTML = getPoseSVG(q.poseKey);
    } else {
      this.quizIllustration.hidden = true;
      this.quizIllustration.innerHTML = '';
    }

    if (q.type === 'multiple_choice' || q.type === 'guess_pose') {
      const keys = ['A', 'B', 'C', 'D'];
      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<span class="option-key">${keys[idx]}</span><span>${optText}</span>`;
        btn.addEventListener('click', () => {
          this._lockQuizOptions();
          const isCorrect = idx === q.answer;
          btn.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
          if (!isCorrect) {
            const correctBtn = this.quizOptionsArea.children[q.answer];
            if (correctBtn) correctBtn.classList.add('is-correct');
          }
          this._finishQuizAnswer(player, q, isCorrect);
        });
        this.quizOptionsArea.appendChild(btn);
      });
    } else if (q.type === 'true_false') {
      const grid = document.createElement('div');
      grid.className = 'tf-grid';
      [
        { label: '✓ Benar', val: true },
        { label: '✕ Salah', val: false }
      ].forEach((choice) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn tf-btn';
        btn.textContent = choice.label;
        btn.addEventListener('click', () => {
          this._lockQuizOptions();
          const isCorrect = choice.val === q.answer;
          btn.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
          this._finishQuizAnswer(player, q, isCorrect);
        });
        grid.appendChild(btn);
      });
      this.quizOptionsArea.appendChild(grid);
    } else if (q.type === 'ordering') {
      this._renderOrderingQuiz(q, player);
    }
  }

  _renderOrderingQuiz(q, player) {
    const shuffled = [...q.items].sort(() => Math.random() - 0.5);
    // Ensure it's not already trivially solved if possible
    if (shuffled.every((item, idx) => item === q.items[idx])) {
      shuffled.reverse();
    }

    const selected = [];
    const slotsWrap = document.createElement('div');
    slotsWrap.className = 'order-slots';
    const poolWrap = document.createElement('div');
    poolWrap.className = 'order-pool';

    this.quizOptionsArea.appendChild(slotsWrap);
    this.quizOptionsArea.appendChild(poolWrap);
    this.quizOrderControls.hidden = false;

    const refreshOrderingUI = () => {
      slotsWrap.innerHTML =
        selected.length === 0
          ? '<span style="color:#557268;font-size:0.85rem;font-weight:600;">Ketuk pilihan di bawah secara berurutan (1 → 4)...</span>'
          : '';

      selected.forEach((item, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'order-slot-chip';
        chip.textContent = `${idx + 1}. ${item} ✕`;
        chip.addEventListener('click', () => {
          sound.playClick();
          selected.splice(idx, 1);
          refreshOrderingUI();
        });
        slotsWrap.appendChild(chip);
      });

      poolWrap.innerHTML = '';
      shuffled.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'order-pool-btn';
        btn.textContent = item;
        btn.disabled = selected.includes(item);
        btn.addEventListener('click', () => {
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
      slotsWrap.querySelectorAll('button').forEach((b) => (b.disabled = true));
      const isCorrect = q.items.every((val, idx) => selected[idx] === val);
      this._finishQuizAnswer(player, q, isCorrect);
    };

    refreshOrderingUI();
  }

  _lockQuizOptions() {
    this.quizOptionsArea.querySelectorAll('button').forEach((b) => {
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
      this.particles.burstPercent(pos.leftPct, pos.topPct, 'gold', 20);

      this.quizFeedback.className = 'quiz-feedback is-success';
      this.feedbackIcon.textContent = '🎉';
      this.feedbackTitle.textContent = `Benar! +${earned} Poin${bonus > 0 ? ' (Bonus Beruntun!)' : ''}`;
    } else {
      player.streak = 0;
      sound.playWrong();
      this.quizFeedback.className = 'quiz-feedback is-error';
      this.feedbackIcon.textContent = '💡';
      this.feedbackTitle.textContent = 'Kurang Tepat — Mari Pelajari!';
    }

    this.feedbackExplanation.textContent = q.explanation;
    this.quizFeedback.hidden = false;
    this._updateHUD(isCorrect ? 'Jawaban tepat!' : 'Belajar bersama rukun salat!');
  }

  async _simulateBotQuizAnswer(q, botPlayer) {
    await new Promise((r) => setTimeout(r, 950));
    const botSmart = Math.random() < 0.72;
    if (q.type === 'ordering') {
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
    winner.score += 50; // Finish bonus
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

    this.victoryStandings.innerHTML = ranked
      .map(
        (p, idx) => `
      <div class="lb-row">
        <span class="lb-rank">#${idx + 1}</span>
        <div class="roster-avatar">${buildAvatarSVG(p.avatarId, false)}</div>
        <div class="lb-info">
          <div class="lb-name">${this._escape(p.name)}</div>
          <div class="lb-meta">Kotak ${p.position} · Benar ${p.correctCount}/${p.answeredCount}</div>
        </div>
        <div class="lb-score">${p.score} pt</div>
      </div>`
      )
      .join('');

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
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      });
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 15)));
    } catch {
      // Ignore storage errors
    }
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
      this.leaderboardList.innerHTML =
        '<div class="lb-empty">Belum ada catatan kemenangan. Ayo mainkan satu babak!</div>';
      return;
    }

    const sorted = [...list].sort((a, b) => b.score - a.score);
    this.leaderboardList.innerHTML = sorted
      .map(
        (entry, idx) => `
      <div class="lb-row">
        <span class="lb-rank">${idx + 1}</span>
        <div class="roster-avatar">${buildAvatarSVG(entry.avatarId || 'ahmad', false)}</div>
        <div class="lb-info">
          <div class="lb-name">${this._escape(entry.name || 'Sahabat')}</div>
          <div class="lb-meta">${entry.date || ''} · Kuis ${entry.correct ?? 0}/${entry.answered ?? 0}</div>
        </div>
        <div class="lb-score">${entry.score} pt</div>
      </div>`
      )
      .join('');
  }

  _renderGuideModalContent() {
    this.guideList.innerHTML = RUKUN_SALAT_LIST.map(
      (item) => `
      <div class="guide-item">
        <div class="guide-num">${item.num}</div>
        <div class="guide-body">
          <h4>${item.name}<span class="guide-cat">· ${item.category}</span></h4>
          <p>${item.desc}</p>
        </div>
      </div>`
    ).join('');
  }
}

function initPWAInstallAndOffline() {
  const installBtn = document.getElementById('install-app-btn');
  const installModal = document.getElementById('install-modal');
  const installBody = document.getElementById('install-guide-body');
  const closeInstallBtn = document.getElementById('close-install-btn');
  const offlineToast = document.getElementById('offline-indicator');

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    Boolean(window.Capacitor?.isNativePlatform?.());

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  let deferredPrompt = null;

  const updateOfflineUI = () => {
    if (offlineToast) {
      offlineToast.hidden = navigator.onLine;
    }
  };
  window.addEventListener('online', updateOfflineUI);
  window.addEventListener('offline', updateOfflineUI);
  updateOfflineUI();

  if (!installBtn || isStandalone) return;

  // Show button on iOS or mobile/desktop until installed
  installBtn.hidden = false;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installBtn.hidden = true;
    if (installModal) installModal.hidden = true;
  });

  installBtn.addEventListener('click', async () => {
    sound.playClick();
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt = null;
        installBtn.hidden = true;
      }
      return;
    }

    if (!installModal || !installBody) return;
    if (isIOS) {
      installBody.innerHTML = `
        <div class="guide-item"><div class="guide-num">1</div><div class="guide-body"><h4>Buka Menu Bagikan (Share)</h4><p>Ketuk ikon Bagikan di bilah bawah Safari.</p></div></div>
        <div class="guide-item"><div class="guide-num">2</div><div class="guide-body"><h4>Tambahkan ke Layar Utama</h4><p>Pilih <strong>Add to Home Screen</strong> lalu ketuk <strong>Add</strong> untuk bermain offline seperti aplikasi native.</p></div></div>
      `;
    } else {
      installBody.innerHTML = `
        <div class="guide-item"><div class="guide-num">1</div><div class="guide-body"><h4>Pasang Langsung di Android Chrome</h4><p>Ketuk menu titik tiga (⋮) di pojok kanan atas browser lalu pilih <strong>Instal aplikasi</strong> atau <strong>Tambahkan ke layar utama</strong>.</p></div></div>
        <div class="guide-item"><div class="guide-num">2</div><div class="guide-body"><h4>Kompilasi File APK Android (Capacitor)</h4><p>Proyek Capacitor sudah siap di folder <code>android/</code>. Jalankan <code>npm run android:apk</code> pada komputer dengan Android Studio / Java SDK untuk menghasilkan file <code>app-debug.apk</code>.</p></div></div>
      `;
    }
    installModal.hidden = false;
  });

  if (closeInstallBtn && installModal) {
    closeInstallBtn.addEventListener('click', () => {
      sound.playClick();
      installModal.hidden = true;
    });
    installModal.addEventListener('click', (e) => {
      if (e.target === installModal) installModal.hidden = true;
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SahabatSalatGame();
  initPWAInstallAndOffline();
});
