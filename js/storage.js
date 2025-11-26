/**
 * KidsQuids - Storage Manager
 * Handles game progress, unlocks, and statistics
 */

class StorageManager {
    constructor() {
        this.storageKey = 'kidsquids_progress';
        this.data = this.load();
    }

    getDefaultData() {
        return {
            version: '1.0.0',
            totalCoins: 0,
            totalStars: 0,

            // Unlocked difficulties (starter always unlocked)
            difficulties: {
                starter: true,
                explorer: false,
                champion: false
            },

            // Unlocked game modes (click always unlocked)
            modes: {
                click: true,
                catch: false,
                drag: false,
                double: false
            },

            // Unlocked themes (default always unlocked)
            themes: {
                default: true,
                pastel: false,
                neon: false,
                rainbow: false
            },

            currentTheme: 'default',

            // Progress per difficulty per mode
            // Structure: progress[difficulty][mode] = { level, stars, bestScore }
            progress: {
                starter: {
                    click: { level: 1, stars: 0, bestScore: 0 },
                    catch: { level: 1, stars: 0, bestScore: 0 },
                    drag: { level: 1, stars: 0, bestScore: 0 },
                    double: { level: 1, stars: 0, bestScore: 0 }
                },
                explorer: {
                    click: { level: 1, stars: 0, bestScore: 0 },
                    catch: { level: 1, stars: 0, bestScore: 0 },
                    drag: { level: 1, stars: 0, bestScore: 0 },
                    double: { level: 1, stars: 0, bestScore: 0 }
                },
                champion: {
                    click: { level: 1, stars: 0, bestScore: 0 },
                    catch: { level: 1, stars: 0, bestScore: 0 },
                    drag: { level: 1, stars: 0, bestScore: 0 },
                    double: { level: 1, stars: 0, bestScore: 0 }
                }
            },

            // Statistics
            stats: {
                totalClicks: 0,
                totalGamesPlayed: 0,
                totalTimePlayed: 0, // in seconds
                shapesClicked: 0,
                shapesCaught: 0,
                shapesDropped: 0,
                doubleClicks: 0
            }
        };
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                // Merge with defaults to ensure all keys exist
                return this.mergeWithDefaults(data);
            }
        } catch (e) {
            console.warn('Failed to load progress:', e);
        }
        return this.getDefaultData();
    }

    mergeWithDefaults(data) {
        const defaults = this.getDefaultData();
        return {
            ...defaults,
            ...data,
            difficulties: { ...defaults.difficulties, ...data.difficulties },
            modes: { ...defaults.modes, ...data.modes },
            themes: { ...defaults.themes, ...data.themes },
            progress: {
                starter: { ...defaults.progress.starter, ...data.progress?.starter },
                explorer: { ...defaults.progress.explorer, ...data.progress?.explorer },
                champion: { ...defaults.progress.champion, ...data.progress?.champion }
            },
            stats: { ...defaults.stats, ...data.stats }
        };
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save progress:', e);
        }
    }

    reset() {
        this.data = this.getDefaultData();
        this.save();
    }

    // Coins
    addCoins(amount) {
        this.data.totalCoins += amount;
        this.save();
        this.checkUnlocks();
        return this.data.totalCoins;
    }

    getCoins() {
        return this.data.totalCoins;
    }

    // Stars
    addStars(amount) {
        this.data.totalStars += amount;
        this.save();
        this.checkUnlocks();
        return this.data.totalStars;
    }

    getStars() {
        return this.data.totalStars;
    }

    // Level progress
    updateLevelProgress(difficulty, mode, level, stars, score) {
        const prog = this.data.progress[difficulty][mode];
        if (level > prog.level) {
            prog.level = level;
        }
        prog.stars += stars;
        if (score > prog.bestScore) {
            prog.bestScore = score;
        }
        this.save();
        this.checkUnlocks();
    }

    getLevelProgress(difficulty, mode) {
        return this.data.progress[difficulty][mode];
    }

    // Unlocks
    isDifficultyUnlocked(difficulty) {
        return this.data.difficulties[difficulty] || false;
    }

    isModeUnlocked(mode) {
        return this.data.modes[mode] || false;
    }

    isThemeUnlocked(theme) {
        return this.data.themes[theme] || false;
    }

    unlockDifficulty(difficulty) {
        if (!this.data.difficulties[difficulty]) {
            this.data.difficulties[difficulty] = true;
            this.save();
            return true; // newly unlocked
        }
        return false;
    }

    unlockMode(mode) {
        if (!this.data.modes[mode]) {
            this.data.modes[mode] = true;
            this.save();
            return true;
        }
        return false;
    }

    unlockTheme(theme) {
        if (!this.data.themes[theme]) {
            this.data.themes[theme] = true;
            this.save();
            return true;
        }
        return false;
    }

    setTheme(theme) {
        if (this.data.themes[theme]) {
            this.data.currentTheme = theme;
            this.save();
        }
    }

    getTheme() {
        return this.data.currentTheme;
    }

    // Check and apply unlocks based on progress
    checkUnlocks() {
        const unlocks = [];

        // Unlock Explorer difficulty after 10 stars in Starter
        const starterStars = Object.values(this.data.progress.starter)
            .reduce((sum, p) => sum + p.stars, 0);
        if (starterStars >= 10 && this.unlockDifficulty('explorer')) {
            unlocks.push({ type: 'difficulty', name: 'explorer' });
        }

        // Unlock Champion difficulty after 20 stars in Explorer
        const explorerStars = Object.values(this.data.progress.explorer)
            .reduce((sum, p) => sum + p.stars, 0);
        if (explorerStars >= 20 && this.unlockDifficulty('champion')) {
            unlocks.push({ type: 'difficulty', name: 'champion' });
        }

        // Unlock Catch mode after level 3 in Click
        if (this.data.progress.starter.click.level >= 3 && this.unlockMode('catch')) {
            unlocks.push({ type: 'mode', name: 'catch' });
        }

        // Unlock Drag mode after level 3 in Catch
        if (this.data.progress.starter.catch.level >= 3 && this.unlockMode('drag')) {
            unlocks.push({ type: 'mode', name: 'drag' });
        }

        // Unlock Double mode after level 3 in Drag
        if (this.data.progress.starter.drag.level >= 3 && this.unlockMode('double')) {
            unlocks.push({ type: 'mode', name: 'double' });
        }

        // Unlock themes based on total coins
        if (this.data.totalCoins >= 50 && this.unlockTheme('pastel')) {
            unlocks.push({ type: 'theme', name: 'pastel' });
        }
        if (this.data.totalCoins >= 150 && this.unlockTheme('neon')) {
            unlocks.push({ type: 'theme', name: 'neon' });
        }
        if (this.data.totalCoins >= 300 && this.unlockTheme('rainbow')) {
            unlocks.push({ type: 'theme', name: 'rainbow' });
        }

        return unlocks;
    }

    // Statistics
    incrementStat(stat, amount = 1) {
        if (this.data.stats[stat] !== undefined) {
            this.data.stats[stat] += amount;
            this.save();
        }
    }

    getStats() {
        return { ...this.data.stats };
    }
}

const storage = new StorageManager();
