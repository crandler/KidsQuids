/**
 * KidsQuids - Level Definitions
 * Configures difficulty, timing, and goals for each game mode and level
 */

const LEVELS = {
    // Click Mode: Click on shapes that appear
    click: {
        starter: [
            { shapes: 3, size: 80, timePerShape: 5000, moving: false, goal: 3, coins: 2 },
            { shapes: 4, size: 75, timePerShape: 4500, moving: false, goal: 4, coins: 3 },
            { shapes: 5, size: 70, timePerShape: 4000, moving: false, goal: 5, coins: 4 },
            { shapes: 6, size: 65, timePerShape: 3500, moving: false, goal: 6, coins: 5 },
            { shapes: 7, size: 60, timePerShape: 3000, moving: false, goal: 7, coins: 6 }
        ],
        explorer: [
            { shapes: 5, size: 55, timePerShape: 3000, moving: false, goal: 5, coins: 4 },
            { shapes: 6, size: 50, timePerShape: 2800, moving: false, goal: 6, coins: 5 },
            { shapes: 7, size: 45, timePerShape: 2500, moving: false, goal: 7, coins: 6 },
            { shapes: 8, size: 42, timePerShape: 2200, moving: false, goal: 8, coins: 7 },
            { shapes: 10, size: 40, timePerShape: 2000, moving: false, goal: 10, coins: 8 }
        ],
        champion: [
            { shapes: 8, size: 40, timePerShape: 2000, moving: false, goal: 8, coins: 6 },
            { shapes: 10, size: 35, timePerShape: 1800, moving: false, goal: 10, coins: 8 },
            { shapes: 12, size: 32, timePerShape: 1500, moving: false, goal: 12, coins: 10 },
            { shapes: 14, size: 30, timePerShape: 1200, moving: false, goal: 14, coins: 12 },
            { shapes: 15, size: 28, timePerShape: 1000, moving: false, goal: 15, coins: 15 }
        ]
    },

    // Catch Mode: Click on moving shapes
    catch: {
        starter: [
            { shapes: 2, size: 70, speed: 1, goal: 3, timeLimit: 30, coins: 3 },
            { shapes: 3, size: 65, speed: 1.2, goal: 5, timeLimit: 35, coins: 4 },
            { shapes: 3, size: 60, speed: 1.5, goal: 7, timeLimit: 40, coins: 5 },
            { shapes: 4, size: 55, speed: 1.8, goal: 10, timeLimit: 45, coins: 6 },
            { shapes: 4, size: 50, speed: 2, goal: 12, timeLimit: 50, coins: 7 }
        ],
        explorer: [
            { shapes: 3, size: 50, speed: 2, goal: 10, timeLimit: 35, coins: 5 },
            { shapes: 4, size: 45, speed: 2.5, goal: 12, timeLimit: 40, coins: 6 },
            { shapes: 4, size: 42, speed: 3, goal: 15, timeLimit: 45, coins: 7 },
            { shapes: 5, size: 40, speed: 3.5, goal: 18, timeLimit: 50, coins: 8 },
            { shapes: 5, size: 38, speed: 4, goal: 20, timeLimit: 55, coins: 10 }
        ],
        champion: [
            { shapes: 4, size: 38, speed: 4, goal: 15, timeLimit: 30, coins: 8 },
            { shapes: 5, size: 35, speed: 4.5, goal: 18, timeLimit: 35, coins: 10 },
            { shapes: 5, size: 32, speed: 5, goal: 22, timeLimit: 40, coins: 12 },
            { shapes: 6, size: 30, speed: 5.5, goal: 25, timeLimit: 45, coins: 14 },
            { shapes: 6, size: 28, speed: 6, goal: 30, timeLimit: 50, coins: 18 }
        ]
    },

    // Drag Mode: Drag shapes to matching targets
    drag: {
        starter: [
            { pairs: 2, size: 70, targetSize: 90, timeLimit: 60, coins: 3 },
            { pairs: 3, size: 65, targetSize: 85, timeLimit: 70, coins: 4 },
            { pairs: 3, size: 60, targetSize: 80, timeLimit: 65, coins: 5 },
            { pairs: 4, size: 55, targetSize: 75, timeLimit: 75, coins: 6 },
            { pairs: 4, size: 50, targetSize: 70, timeLimit: 70, coins: 7 }
        ],
        explorer: [
            { pairs: 4, size: 50, targetSize: 65, timeLimit: 55, coins: 5 },
            { pairs: 5, size: 45, targetSize: 60, timeLimit: 60, coins: 6 },
            { pairs: 5, size: 42, targetSize: 55, timeLimit: 55, coins: 7 },
            { pairs: 6, size: 40, targetSize: 52, timeLimit: 65, coins: 8 },
            { pairs: 6, size: 38, targetSize: 50, timeLimit: 60, coins: 10 }
        ],
        champion: [
            { pairs: 5, size: 38, targetSize: 50, timeLimit: 45, coins: 8 },
            { pairs: 6, size: 35, targetSize: 48, timeLimit: 50, coins: 10 },
            { pairs: 6, size: 32, targetSize: 45, timeLimit: 45, coins: 12 },
            { pairs: 7, size: 30, targetSize: 42, timeLimit: 55, coins: 14 },
            { pairs: 8, size: 28, targetSize: 40, timeLimit: 60, coins: 18 }
        ]
    },

    // Double Mode: Double-click to pop shapes
    double: {
        starter: [
            { shapes: 3, size: 75, timePerShape: 4000, goal: 3, coins: 3 },
            { shapes: 4, size: 70, timePerShape: 3800, goal: 4, coins: 4 },
            { shapes: 5, size: 65, timePerShape: 3500, goal: 5, coins: 5 },
            { shapes: 5, size: 60, timePerShape: 3200, goal: 6, coins: 6 },
            { shapes: 6, size: 55, timePerShape: 3000, goal: 7, coins: 7 }
        ],
        explorer: [
            { shapes: 5, size: 55, timePerShape: 3000, goal: 6, coins: 5 },
            { shapes: 6, size: 50, timePerShape: 2700, goal: 8, coins: 6 },
            { shapes: 6, size: 45, timePerShape: 2400, goal: 10, coins: 7 },
            { shapes: 7, size: 42, timePerShape: 2200, goal: 12, coins: 8 },
            { shapes: 8, size: 40, timePerShape: 2000, goal: 14, coins: 10 }
        ],
        champion: [
            { shapes: 6, size: 40, timePerShape: 2000, goal: 10, coins: 8 },
            { shapes: 7, size: 38, timePerShape: 1800, goal: 12, coins: 10 },
            { shapes: 8, size: 35, timePerShape: 1600, goal: 15, coins: 12 },
            { shapes: 8, size: 32, timePerShape: 1400, goal: 18, coins: 14 },
            { shapes: 10, size: 30, timePerShape: 1200, goal: 20, coins: 18 }
        ]
    }
};

// Star thresholds (percentage of max score)
const STAR_THRESHOLDS = {
    one: 0.5,    // 50% = 1 star
    two: 0.75,   // 75% = 2 stars
    three: 0.95  // 95% = 3 stars
};

// Get level configuration
function getLevelConfig(mode, difficulty, levelNum) {
    const levels = LEVELS[mode]?.[difficulty];
    if (!levels) return null;
    const index = Math.min(levelNum - 1, levels.length - 1);
    return { ...levels[index], levelNum: levelNum };
}

// Calculate stars based on performance
function calculateStars(score, maxScore) {
    const percentage = score / maxScore;
    if (percentage >= STAR_THRESHOLDS.three) return 3;
    if (percentage >= STAR_THRESHOLDS.two) return 2;
    if (percentage >= STAR_THRESHOLDS.one) return 1;
    return 0;
}

// Get max level for a mode/difficulty
function getMaxLevel(mode, difficulty) {
    return LEVELS[mode]?.[difficulty]?.length || 5;
}

// Mode descriptions for UI
const MODE_INFO = {
    click: {
        icon: 'circle',
        color: '#FF6B6B',
        hint: 'hintClick'
    },
    catch: {
        icon: 'star',
        color: '#4ECDC4',
        hint: 'hintCatch'
    },
    drag: {
        icon: 'square',
        color: '#45B7D1',
        hint: 'hintDrag'
    },
    double: {
        icon: 'heart',
        color: '#DDA0DD',
        hint: 'hintDouble'
    }
};

// Difficulty info
const DIFFICULTY_INFO = {
    starter: {
        color: '#96CEB4',
        minAge: 3,
        maxAge: 4
    },
    explorer: {
        color: '#FFEAA7',
        minAge: 4,
        maxAge: 5
    },
    champion: {
        color: '#FF6B6B',
        minAge: 5,
        maxAge: 6
    }
};
