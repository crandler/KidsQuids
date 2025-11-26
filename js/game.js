/**
 * KidsQuids - Main Game Logic
 * Controls game flow, rendering, and user interaction
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.uiContainer = document.getElementById('ui-container');

        // Game state
        this.currentScreen = 'menu'; // menu, difficulty, mode, game, levelComplete, settings
        this.currentMode = null;
        this.currentDifficulty = null;
        this.currentLevel = 1;
        this.isPaused = false;
        this.isRunning = false;

        // Game objects
        this.shapes = [];
        this.targets = []; // For drag mode
        this.confetti = [];
        this.draggedShape = null;

        // Score tracking
        this.score = 0;
        this.shapesClicked = 0;
        this.timeRemaining = 0;
        this.levelStartTime = 0;

        // Double-click tracking
        this.lastClickTime = 0;
        this.lastClickShape = null;
        this.doubleClickThreshold = 400; // ms

        // Animation
        this.lastFrameTime = 0;
        this.animationId = null;

        // Current theme
        this.theme = storage.getTheme();

        // Pending unlocks to show
        this.pendingUnlocks = [];

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Touch events for mobile (backup)
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Initialize sound on first interaction
        document.addEventListener('click', () => soundManager.init(), { once: true });

        // Update UI texts
        i18n.updateAllTexts();

        // Show main menu
        this.showScreen('menu');
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Redraw if in game
        if (this.currentScreen === 'game') {
            this.draw();
        }
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    // Screen Management
    showScreen(screen) {
        this.currentScreen = screen;
        this.uiContainer.innerHTML = '';

        switch (screen) {
            case 'menu':
                this.renderMenuScreen();
                break;
            case 'difficulty':
                this.renderDifficultyScreen();
                break;
            case 'mode':
                this.renderModeScreen();
                break;
            case 'game':
                this.startGame();
                break;
            case 'levelComplete':
                this.renderLevelComplete();
                break;
            case 'settings':
                this.renderSettingsScreen();
                break;
            case 'unlock':
                this.renderUnlockScreen();
                break;
        }
    }

    renderMenuScreen() {
        this.stopGame();
        this.clearCanvas();

        const html = `
            <div class="menu-screen">
                <div class="logo-container">
                    <h1 class="game-title" data-i18n="title">KidsQuids</h1>
                    <p class="game-subtitle" data-i18n="subtitle">Lerne die Maus kennen!</p>
                </div>
                <div class="menu-buttons">
                    <button class="btn btn-primary btn-large" onclick="game.showScreen('difficulty')">
                        <span data-i18n="play">Spielen</span>
                    </button>
                    <button class="btn btn-secondary" onclick="game.showScreen('settings')">
                        <span data-i18n="settings">Einstellungen</span>
                    </button>
                </div>
                <div class="stats-display">
                    <div class="stat">
                        <svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span>${storage.getStars()}</span>
                    </div>
                    <div class="stat">
                        <svg class="icon coin-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor">Q</text></svg>
                        <span>${storage.getCoins()}</span>
                    </div>
                </div>
            </div>
        `;
        this.uiContainer.innerHTML = html;
        i18n.updateAllTexts();

        // Animate background
        this.drawMenuBackground();
    }

    renderDifficultyScreen() {
        const difficulties = ['starter', 'explorer', 'champion'];

        let html = `
            <div class="selection-screen">
                <button class="btn-back" onclick="game.showScreen('menu')">
                    <svg viewBox="0 0 24 24" width="24" height="24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <h2 data-i18n="chooseDifficulty">Wähle deine Stufe</h2>
                <div class="difficulty-grid">
        `;

        difficulties.forEach(diff => {
            const unlocked = storage.isDifficultyUnlocked(diff);
            const info = DIFFICULTY_INFO[diff];
            const progress = Object.values(storage.data.progress[diff])
                .reduce((sum, p) => sum + p.stars, 0);

            html += `
                <div class="difficulty-card ${unlocked ? '' : 'locked'}"
                     style="--card-color: ${info.color}"
                     ${unlocked ? `onclick="game.selectDifficulty('${diff}')"` : ''}>
                    <div class="card-content">
                        <h3 data-i18n="difficulty${diff.charAt(0).toUpperCase() + diff.slice(1)}">${diff}</h3>
                        <p data-i18n="difficulty${diff.charAt(0).toUpperCase() + diff.slice(1)}Desc"></p>
                        ${unlocked ? `
                            <div class="card-stars">
                                <svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <span>${progress}</span>
                            </div>
                        ` : `
                            <div class="lock-icon">
                                <svg viewBox="0 0 24 24" width="32" height="32"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <span data-i18n="locked">Gesperrt</span>
                            </div>
                        `}
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        this.uiContainer.innerHTML = html;
        i18n.updateAllTexts();
    }

    renderModeScreen() {
        const modes = ['click', 'catch', 'drag', 'double'];

        let html = `
            <div class="selection-screen">
                <button class="btn-back" onclick="game.showScreen('difficulty')">
                    <svg viewBox="0 0 24 24" width="24" height="24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <h2 data-i18n="chooseGame">Was möchtest du spielen?</h2>
                <div class="mode-grid">
        `;

        modes.forEach(mode => {
            const unlocked = storage.isModeUnlocked(mode);
            const info = MODE_INFO[mode];
            const progress = storage.getLevelProgress(this.currentDifficulty, mode);

            html += `
                <div class="mode-card ${unlocked ? '' : 'locked'}"
                     style="--card-color: ${info.color}"
                     ${unlocked ? `onclick="game.selectMode('${mode}')"` : ''}>
                    <div class="card-icon">
                        ${this.getModeIcon(mode)}
                    </div>
                    <div class="card-content">
                        <h3 data-i18n="mode${mode.charAt(0).toUpperCase() + mode.slice(1)}"></h3>
                        <p data-i18n="mode${mode.charAt(0).toUpperCase() + mode.slice(1)}Desc"></p>
                        ${unlocked ? `
                            <div class="card-progress">
                                Level ${progress.level} |
                                <svg class="icon small" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                ${progress.stars}
                            </div>
                        ` : `
                            <div class="lock-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                        `}
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        this.uiContainer.innerHTML = html;
        i18n.updateAllTexts();
    }

    getModeIcon(mode) {
        const icons = {
            click: '<circle cx="40" cy="40" r="35" fill="currentColor"/>',
            catch: '<polygon points="40,5 49,30 75,30 54,47 62,75 40,58 18,75 26,47 5,30 31,30" fill="currentColor"/>',
            drag: '<rect x="10" y="10" width="60" height="60" rx="8" fill="currentColor"/>',
            double: '<path d="M40,70 C40,70 10,50 10,30 C10,15 25,5 40,20 C55,5 70,15 70,30 C70,50 40,70 40,70 Z" fill="currentColor"/>'
        };
        return `<svg viewBox="0 0 80 80" class="mode-icon">${icons[mode]}</svg>`;
    }

    selectDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        soundManager.playClick();
        this.showScreen('mode');
    }

    selectMode(mode) {
        this.currentMode = mode;
        this.currentLevel = storage.getLevelProgress(this.currentDifficulty, mode).level;
        soundManager.playClick();
        this.showScreen('game');
    }

    // Game Logic
    startGame() {
        this.uiContainer.innerHTML = `
            <div class="game-hud">
                <button class="btn-back" onclick="game.exitGame()">
                    <svg viewBox="0 0 24 24" width="24" height="24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="hud-stats">
                    <div class="hud-item">
                        <span data-i18n="level">Level</span>
                        <span id="hud-level">${this.currentLevel}</span>
                    </div>
                    <div class="hud-item">
                        <span data-i18n="score">Punkte</span>
                        <span id="hud-score">0</span>
                    </div>
                    <div class="hud-item" id="hud-time-container" style="display: none;">
                        <span data-i18n="time">Zeit</span>
                        <span id="hud-time">0</span>
                    </div>
                </div>
            </div>
            <div id="game-hint" class="game-hint"></div>
            <div id="feedback-popup" class="feedback-popup"></div>
        `;
        i18n.updateAllTexts();

        this.score = 0;
        this.shapesClicked = 0;
        this.shapes = [];
        this.targets = [];
        this.confetti = [];
        this.draggedShape = null;

        const config = getLevelConfig(this.currentMode, this.currentDifficulty, this.currentLevel);
        this.levelConfig = config;

        // Show hint
        const hintKey = MODE_INFO[this.currentMode].hint;
        document.getElementById('game-hint').textContent = i18n.t(hintKey);
        setTimeout(() => {
            const hint = document.getElementById('game-hint');
            if (hint) hint.classList.add('fade-out');
        }, 3000);

        // Set running state BEFORE setup (spawn functions check isRunning)
        this.isRunning = true;
        this.isPaused = false;
        this.levelStartTime = Date.now();
        this.lastFrameTime = performance.now();

        // Setup based on mode
        switch (this.currentMode) {
            case 'click':
                this.setupClickMode(config);
                break;
            case 'catch':
                this.setupCatchMode(config);
                break;
            case 'drag':
                this.setupDragMode(config);
                break;
            case 'double':
                this.setupDoubleMode(config);
                break;
        }

        this.gameLoop();
    }

    setupClickMode(config) {
        this.spawnClickShape();
    }

    setupCatchMode(config) {
        document.getElementById('hud-time-container').style.display = 'block';
        this.timeRemaining = config.timeLimit;
        this.updateTimeDisplay();

        // Spawn initial shapes
        for (let i = 0; i < config.shapes; i++) {
            this.spawnCatchShape();
        }

        // Timer
        this.timerInterval = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
                this.timeRemaining--;
                this.updateTimeDisplay();
                if (this.timeRemaining <= 0) {
                    this.endLevel(false);
                }
            }
        }, 1000);
    }

    setupDragMode(config) {
        document.getElementById('hud-time-container').style.display = 'block';
        this.timeRemaining = config.timeLimit;
        this.updateTimeDisplay();

        const padding = 100;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Create shapes and matching targets
        const usedTypes = [];
        const colors = colorThemes[this.theme]?.colors || colorThemes.default.colors;

        for (let i = 0; i < config.pairs; i++) {
            let type;
            do {
                type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
            } while (usedTypes.includes(type) && usedTypes.length < SHAPE_TYPES.length);
            usedTypes.push(type);

            const color = colors[i % colors.length];

            // Create draggable shape (left side)
            const shape = new Shape(
                padding + Math.random() * (w / 3 - padding),
                padding + (i + 0.5) * ((h - padding * 2) / config.pairs),
                config.size,
                color,
                type
            );
            shape.isDraggable = true;
            shape.matchId = i;
            this.shapes.push(shape);

            // Create target (right side)
            const target = new Shape(
                w - padding - Math.random() * (w / 3 - padding),
                padding + (i + 0.5) * ((h - padding * 2) / config.pairs),
                config.targetSize,
                color,
                type
            );
            target.alpha = 0.3;
            target.isTarget = true;
            target.matchId = i;
            target.matched = false;
            this.targets.push(target);
        }

        // Shuffle shape Y positions
        this.shapes.forEach(s => {
            s.y = padding + Math.random() * (h - padding * 2);
            s.targetY = s.y;
        });

        // Timer
        this.timerInterval = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
                this.timeRemaining--;
                this.updateTimeDisplay();
                if (this.timeRemaining <= 0) {
                    this.endLevel(false);
                }
            }
        }, 1000);
    }

    setupDoubleMode(config) {
        this.spawnDoubleShape();
    }

    spawnClickShape() {
        if (!this.isRunning) return;

        const config = this.levelConfig;
        const padding = config.size + 20;
        const x = padding + Math.random() * (this.canvas.width - padding * 2);
        const y = padding + Math.random() * (this.canvas.height - padding * 2);

        const shape = createRandomShape(x, y, config.size, this.theme);
        shape.scale = 0;
        shape.targetScale = 1;
        this.shapes.push(shape);

        // Remove after timeout if not clicked
        setTimeout(() => {
            if (this.shapes.includes(shape) && shape.isActive) {
                shape.setExpression('sleeping');
                shape.pop();
                setTimeout(() => {
                    this.removeShape(shape);
                    if (this.isRunning && this.currentMode === 'click') {
                        this.spawnClickShape();
                    }
                }, 200);
            }
        }, config.timePerShape);
    }

    spawnCatchShape() {
        if (!this.isRunning) return;

        const config = this.levelConfig;
        const padding = config.size + 20;
        const x = padding + Math.random() * (this.canvas.width - padding * 2);
        const y = padding + Math.random() * (this.canvas.height - padding * 2);

        const shape = createRandomShape(x, y, config.size, this.theme);
        shape.scale = 0;
        shape.targetScale = 1;

        // Random movement
        const angle = Math.random() * Math.PI * 2;
        shape.velocity.x = Math.cos(angle) * config.speed;
        shape.velocity.y = Math.sin(angle) * config.speed;

        this.shapes.push(shape);
    }

    spawnDoubleShape() {
        if (!this.isRunning) return;

        const config = this.levelConfig;
        const padding = config.size + 20;
        const x = padding + Math.random() * (this.canvas.width - padding * 2);
        const y = padding + Math.random() * (this.canvas.height - padding * 2);

        const shape = createRandomShape(x, y, config.size, this.theme);
        shape.scale = 0;
        shape.targetScale = 1;
        shape.needsDoubleClick = true;
        shape.clickCount = 0;
        this.shapes.push(shape);

        // Remove after timeout
        setTimeout(() => {
            if (this.shapes.includes(shape) && shape.isActive) {
                shape.setExpression('sleeping');
                shape.pop();
                setTimeout(() => {
                    this.removeShape(shape);
                    if (this.isRunning && this.currentMode === 'double') {
                        this.spawnDoubleShape();
                    }
                }, 200);
            }
        }, config.timePerShape);
    }

    removeShape(shape) {
        const index = this.shapes.indexOf(shape);
        if (index > -1) {
            this.shapes.splice(index, 1);
        }
    }

    updateTimeDisplay() {
        const el = document.getElementById('hud-time');
        if (el) {
            el.textContent = this.timeRemaining;
            if (this.timeRemaining <= 10) {
                el.classList.add('warning');
            }
        }
    }

    updateScoreDisplay() {
        const el = document.getElementById('hud-score');
        if (el) el.textContent = this.score;
    }

    showFeedback(text) {
        const popup = document.getElementById('feedback-popup');
        if (popup) {
            popup.textContent = text;
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 800);
        }
    }

    // Event Handlers
    handleMouseMove(e) {
        const pos = this.getMousePos(e);

        // Update hover state
        this.shapes.forEach(shape => {
            shape.isHovered = shape.containsPoint(pos.x, pos.y) && shape.isActive;
        });

        // Drag
        if (this.draggedShape) {
            this.draggedShape.targetX = pos.x;
            this.draggedShape.targetY = pos.y;
            this.draggedShape.x = pos.x;
            this.draggedShape.y = pos.y;
        }

        // Update cursor
        const hovering = this.shapes.some(s => s.isHovered);
        this.canvas.style.cursor = hovering ? 'pointer' : 'default';
    }

    handleMouseDown(e) {
        if (this.currentMode !== 'drag') return;

        const pos = this.getMousePos(e);
        for (const shape of this.shapes) {
            if (shape.containsPoint(pos.x, pos.y) && shape.isDraggable && shape.isActive) {
                this.draggedShape = shape;
                shape.scale = 1.2;
                soundManager.playClick();
                break;
            }
        }
    }

    handleMouseUp(e) {
        if (this.draggedShape && this.currentMode === 'drag') {
            this.checkDragMatch(this.draggedShape);
            this.draggedShape.scale = 1;
            this.draggedShape = null;
        }
    }

    handleClick(e) {
        if (this.currentScreen !== 'game' || !this.isRunning) return;

        const pos = this.getMousePos(e);

        switch (this.currentMode) {
            case 'click':
                this.handleClickMode(pos);
                break;
            case 'catch':
                this.handleCatchMode(pos);
                break;
            case 'double':
                this.handleDoubleMode(pos);
                break;
        }
    }

    handleClickMode(pos) {
        for (const shape of this.shapes) {
            if (shape.containsPoint(pos.x, pos.y) && shape.isActive) {
                this.clickShape(shape);
                break;
            }
        }
    }

    handleCatchMode(pos) {
        for (const shape of this.shapes) {
            if (shape.containsPoint(pos.x, pos.y) && shape.isActive) {
                this.clickShape(shape);

                // Spawn new shape
                setTimeout(() => {
                    if (this.isRunning) this.spawnCatchShape();
                }, 300);
                break;
            }
        }
    }

    handleDoubleMode(pos) {
        const now = Date.now();

        for (const shape of this.shapes) {
            if (shape.containsPoint(pos.x, pos.y) && shape.isActive) {
                shape.clickCount = (shape.clickCount || 0) + 1;

                if (shape === this.lastClickShape && now - this.lastClickTime < this.doubleClickThreshold) {
                    // Double click!
                    shape.setExpression('surprised');
                    soundManager.playPop();
                    this.clickShape(shape);
                    storage.incrementStat('doubleClicks');
                    this.lastClickShape = null;
                } else {
                    // First click
                    shape.bounce();
                    soundManager.playClick();
                    this.lastClickShape = shape;
                    this.lastClickTime = now;
                }
                break;
            }
        }
    }

    clickShape(shape) {
        shape.setExpression('surprised');
        shape.pop();

        this.score += 10;
        this.shapesClicked++;
        this.updateScoreDisplay();

        soundManager.playPop();
        storage.incrementStat('shapesClicked');

        // Show feedback
        const feedbacks = ['great', 'awesome', 'perfect', 'wellDone', 'amazing'];
        const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        this.showFeedback(i18n.t(feedback));

        // Create confetti
        this.confetti.push(...createConfettiBurst(shape.x, shape.y, 15, this.theme));

        // Remove shape
        setTimeout(() => {
            this.removeShape(shape);

            // Check level completion
            if (this.currentMode === 'click' || this.currentMode === 'double') {
                if (this.shapesClicked >= this.levelConfig.goal) {
                    this.endLevel(true);
                } else {
                    // Spawn next shape
                    if (this.currentMode === 'click') {
                        this.spawnClickShape();
                    } else {
                        this.spawnDoubleShape();
                    }
                }
            } else if (this.currentMode === 'catch') {
                if (this.shapesClicked >= this.levelConfig.goal) {
                    this.endLevel(true);
                }
            }
        }, 150);
    }

    checkDragMatch(shape) {
        for (const target of this.targets) {
            if (!target.matched && target.matchId === shape.matchId) {
                const dx = shape.x - target.x;
                const dy = shape.y - target.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < target.size) {
                    // Match!
                    target.matched = true;
                    shape.isActive = false;
                    shape.targetX = target.x;
                    shape.targetY = target.y;

                    target.alpha = 1;
                    target.setExpression('happy');

                    this.score += 20;
                    this.shapesClicked++;
                    this.updateScoreDisplay();

                    soundManager.playSuccess();
                    storage.incrementStat('shapesDropped');

                    this.confetti.push(...createConfettiBurst(target.x, target.y, 20, this.theme));
                    this.showFeedback(i18n.t('perfect'));

                    // Check completion
                    if (this.targets.every(t => t.matched)) {
                        setTimeout(() => this.endLevel(true), 500);
                    }
                    return;
                }
            }
        }

        // No match - return to start
        shape.shake();
        soundManager.playMiss();
    }

    // Touch handlers (for compatibility)
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.handleMouseUp({ clientX: touch.clientX, clientY: touch.clientY });
        this.handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    }

    // Game Loop
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.draw();

        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        if (this.isPaused) return;

        // Update shapes
        this.shapes.forEach(shape => {
            shape.update(deltaTime);

            // Bounce off walls (catch mode)
            if (this.currentMode === 'catch') {
                const padding = shape.size;
                if (shape.x < padding || shape.x > this.canvas.width - padding) {
                    shape.velocity.x *= -1;
                    shape.x = Math.max(padding, Math.min(this.canvas.width - padding, shape.x));
                }
                if (shape.y < padding || shape.y > this.canvas.height - padding) {
                    shape.velocity.y *= -1;
                    shape.y = Math.max(padding, Math.min(this.canvas.height - padding, shape.y));
                }
            }
        });

        // Update targets
        this.targets.forEach(target => target.update(deltaTime));

        // Update confetti
        this.confetti.forEach(c => c.update());
        this.confetti = this.confetti.filter(c => c.isAlive());
    }

    draw() {
        this.clearCanvas();

        const theme = colorThemes[this.theme] || colorThemes.default;
        this.ctx.fillStyle = theme.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw decorative background shapes
        this.drawBackgroundShapes();

        // Draw targets (behind shapes)
        this.targets.forEach(target => target.draw(this.ctx));

        // Draw shapes
        this.shapes.forEach(shape => shape.draw(this.ctx));

        // Draw confetti
        this.confetti.forEach(c => c.draw(this.ctx));
    }

    drawBackgroundShapes() {
        const ctx = this.ctx;
        const theme = colorThemes[this.theme] || colorThemes.default;

        ctx.globalAlpha = 0.1;
        ctx.fillStyle = theme.accent;

        // Subtle background decorations
        const time = Date.now() / 5000;
        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time + i * 1.5) + 1) * 0.5 * this.canvas.width;
            const y = (Math.cos(time + i * 2) + 1) * 0.5 * this.canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 50 + i * 20, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    drawMenuBackground() {
        const theme = colorThemes[this.theme] || colorThemes.default;
        this.ctx.fillStyle = theme.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Animated background shapes
        const colors = theme.colors;
        const time = Date.now() / 3000;

        this.ctx.globalAlpha = 0.2;
        for (let i = 0; i < 8; i++) {
            const x = Math.sin(time + i * 0.8) * 150 + this.canvas.width / 2;
            const y = Math.cos(time * 0.7 + i * 1.2) * 100 + this.canvas.height / 2;
            const size = 30 + Math.sin(time + i) * 15;

            this.ctx.fillStyle = colors[i % colors.length];
            this.ctx.beginPath();

            if (i % 3 === 0) {
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
            } else if (i % 3 === 1) {
                this.ctx.rect(x - size / 2, y - size / 2, size, size);
            } else {
                this.ctx.moveTo(x, y - size);
                this.ctx.lineTo(x + size, y + size);
                this.ctx.lineTo(x - size, y + size);
                this.ctx.closePath();
            }
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        // Continue animation
        if (this.currentScreen === 'menu') {
            requestAnimationFrame(() => this.drawMenuBackground());
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Level End
    endLevel(success) {
        this.isRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (success) {
            const maxScore = this.levelConfig.goal * 10;
            const stars = calculateStars(this.score, maxScore);
            const coins = this.levelConfig.coins;

            // Update storage
            storage.addCoins(coins);
            storage.addStars(stars);
            storage.updateLevelProgress(
                this.currentDifficulty,
                this.currentMode,
                this.currentLevel + 1,
                stars,
                this.score
            );
            storage.incrementStat('totalGamesPlayed');

            // Check for unlocks
            this.pendingUnlocks = storage.checkUnlocks();

            soundManager.playLevelComplete();

            // Big confetti burst
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const x = Math.random() * this.canvas.width;
                    this.confetti.push(...createConfettiBurst(x, -20, 40, this.theme));
                }, i * 200);
            }

            setTimeout(() => {
                if (this.pendingUnlocks.length > 0) {
                    this.showScreen('unlock');
                } else {
                    this.showScreen('levelComplete');
                }
            }, 1500);
        } else {
            // Time ran out
            soundManager.playMiss();
            setTimeout(() => this.showScreen('levelComplete'), 500);
        }
    }

    renderLevelComplete() {
        const maxScore = this.levelConfig.goal * 10;
        const stars = calculateStars(this.score, maxScore);
        const isRecord = this.score > storage.getLevelProgress(this.currentDifficulty, this.currentMode).bestScore;

        let starsHtml = '';
        for (let i = 0; i < 3; i++) {
            const filled = i < stars;
            starsHtml += `
                <svg class="star ${filled ? 'filled' : ''}" viewBox="0 0 24 24" style="animation-delay: ${i * 0.2}s">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
        }

        const html = `
            <div class="level-complete-screen">
                <h2 data-i18n="levelComplete">Level geschafft!</h2>
                ${isRecord ? `<p class="new-record" data-i18n="newRecord">Neuer Rekord!</p>` : ''}
                <div class="stars-display">${starsHtml}</div>
                <div class="score-display">
                    <span data-i18n="score">Punkte</span>: ${this.score}
                </div>
                <div class="coins-earned">
                    +${this.levelConfig.coins}
                    <svg class="icon coin-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor">Q</text></svg>
                </div>
                <div class="level-buttons">
                    <button class="btn btn-primary" onclick="game.nextLevel()">
                        <span data-i18n="nextLevel">Weiter</span>
                    </button>
                    <button class="btn btn-secondary" onclick="game.replayLevel()">
                        <span data-i18n="replay">Nochmal</span>
                    </button>
                    <button class="btn btn-secondary" onclick="game.showScreen('mode')">
                        <span data-i18n="backToMenu">Zurück</span>
                    </button>
                </div>
            </div>
        `;

        this.uiContainer.innerHTML = html;
        i18n.updateAllTexts();

        // Play star sounds
        for (let i = 0; i < stars; i++) {
            setTimeout(() => soundManager.playStar(), 300 + i * 300);
        }
    }

    renderUnlockScreen() {
        const unlock = this.pendingUnlocks.shift();

        let title, description;
        if (unlock.type === 'mode') {
            title = i18n.t('modeUnlocked');
            description = i18n.t(`mode${unlock.name.charAt(0).toUpperCase() + unlock.name.slice(1)}`);
        } else if (unlock.type === 'difficulty') {
            title = i18n.t('newUnlock');
            description = i18n.t(`difficulty${unlock.name.charAt(0).toUpperCase() + unlock.name.slice(1)}`);
        } else {
            title = i18n.t('themeUnlocked');
            description = unlock.name;
        }

        const html = `
            <div class="unlock-screen">
                <h2 data-i18n="newUnlock">${title}</h2>
                <div class="unlock-icon">
                    <svg viewBox="0 0 24 24" width="80" height="80">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="2"></path>
                    </svg>
                </div>
                <p class="unlock-name">${description}</p>
                <button class="btn btn-primary" onclick="game.continueAfterUnlock()">
                    <span data-i18n="nextLevel">Weiter</span>
                </button>
            </div>
        `;

        this.uiContainer.innerHTML = html;
        soundManager.playUnlock();

        // Big celebration
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const x = Math.random() * this.canvas.width;
                this.confetti.push(...createConfettiBurst(x, this.canvas.height / 2, 30, this.theme));
            }, i * 100);
        }
    }

    continueAfterUnlock() {
        soundManager.playClick();
        if (this.pendingUnlocks.length > 0) {
            this.showScreen('unlock');
        } else {
            this.showScreen('levelComplete');
        }
    }

    nextLevel() {
        soundManager.playClick();
        this.currentLevel++;
        this.showScreen('game');
    }

    replayLevel() {
        soundManager.playClick();
        this.showScreen('game');
    }

    exitGame() {
        soundManager.playClick();
        this.stopGame();
        this.showScreen('mode');
    }

    stopGame() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Settings
    renderSettingsScreen() {
        const soundOn = soundManager.isEnabled();

        const html = `
            <div class="settings-screen">
                <button class="btn-back" onclick="game.showScreen('menu')">
                    <svg viewBox="0 0 24 24" width="24" height="24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <h2 data-i18n="settings">Einstellungen</h2>

                <div class="settings-list">
                    <div class="setting-item">
                        <span data-i18n="language">Sprache</span>
                        <div class="language-buttons">
                            <button class="btn ${i18n.currentLang === 'de' ? 'active' : ''}" onclick="game.setLanguage('de')">DE</button>
                            <button class="btn ${i18n.currentLang === 'en' ? 'active' : ''}" onclick="game.setLanguage('en')">EN</button>
                        </div>
                    </div>

                    <div class="setting-item">
                        <span data-i18n="sound">Ton</span>
                        <button class="btn ${soundOn ? 'active' : ''}" onclick="game.toggleSound()">
                            <span data-i18n="${soundOn ? 'soundOn' : 'soundOff'}">${soundOn ? 'An' : 'Aus'}</span>
                        </button>
                    </div>

                    <div class="setting-item theme-selector">
                        <span>Theme</span>
                        <div class="theme-buttons">
                            ${this.renderThemeButtons()}
                        </div>
                    </div>

                    <div class="setting-item danger">
                        <span data-i18n="resetProgress">Fortschritt löschen</span>
                        <button class="btn btn-danger" onclick="game.confirmReset()">Reset</button>
                    </div>
                </div>
            </div>
        `;

        this.uiContainer.innerHTML = html;
        i18n.updateAllTexts();
    }

    renderThemeButtons() {
        const themes = ['default', 'pastel', 'neon', 'rainbow'];
        return themes.map(theme => {
            const unlocked = storage.isThemeUnlocked(theme);
            const active = this.theme === theme;
            const colors = colorThemes[theme].colors.slice(0, 4);

            return `
                <button class="theme-btn ${active ? 'active' : ''} ${unlocked ? '' : 'locked'}"
                        ${unlocked ? `onclick="game.setTheme('${theme}')"` : ''}
                        title="${theme}">
                    <div class="theme-preview">
                        ${colors.map(c => `<span style="background:${c}"></span>`).join('')}
                    </div>
                    ${unlocked ? '' : '<svg class="lock" viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'}
                </button>
            `;
        }).join('');
    }

    setLanguage(lang) {
        i18n.setLanguage(lang);
        soundManager.playClick();
        this.renderSettingsScreen();
    }

    toggleSound() {
        const newState = !soundManager.isEnabled();
        soundManager.setEnabled(newState);
        if (newState) soundManager.playClick();
        this.renderSettingsScreen();
    }

    setTheme(theme) {
        this.theme = theme;
        storage.setTheme(theme);
        soundManager.playClick();
        this.renderSettingsScreen();
    }

    confirmReset() {
        if (confirm(i18n.t('confirmReset'))) {
            storage.reset();
            soundManager.playClick();
            this.showScreen('menu');
        }
    }
}

// Initialize game when DOM is ready
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
