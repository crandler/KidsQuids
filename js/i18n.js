/**
 * KidsQuids - Internationalization System
 * Supports German (de) and English (en)
 */

const translations = {
    de: {
        // Main Menu
        title: "KidsQuids",
        subtitle: "Lerne die Maus kennen!",
        play: "Spielen",
        settings: "Einstellungen",

        // Difficulty Selection
        chooseDifficulty: "Wähle deine Stufe",
        difficultyStarter: "Starter",
        difficultyStarterDesc: "Für Anfänger",
        difficultyExplorer: "Entdecker",
        difficultyExplorerDesc: "Schon geübt",
        difficultyChampion: "Champion",
        difficultyChampionDesc: "Für Profis",
        locked: "Gesperrt",

        // Game Modes
        chooseGame: "Was möchtest du spielen?",
        modeClick: "Klick-Spaß",
        modeClickDesc: "Klicke auf die Formen!",
        modeCatch: "Form-Fänger",
        modeCatchDesc: "Fange die Formen!",
        modeDrag: "Puzzle-Schieber",
        modeDragDesc: "Ziehe die Formen!",
        modeDouble: "Doppel-Pop",
        modeDoubleDesc: "Doppelklick zum Platzen!",

        // Game UI
        score: "Punkte",
        level: "Level",
        time: "Zeit",
        stars: "Sterne",
        coins: "Münzen",

        // Feedback
        great: "Super!",
        awesome: "Toll!",
        perfect: "Perfekt!",
        tryAgain: "Nochmal!",
        wellDone: "Gut gemacht!",
        amazing: "Fantastisch!",

        // Level Complete
        levelComplete: "Level geschafft!",
        nextLevel: "Weiter",
        replay: "Nochmal",
        backToMenu: "Zurück",
        newRecord: "Neuer Rekord!",

        // Unlocks
        newUnlock: "Neu freigeschaltet!",
        modeUnlocked: "Neuer Spielmodus!",
        themeUnlocked: "Neues Farbthema!",

        // Settings
        language: "Sprache",
        sound: "Ton",
        soundOn: "An",
        soundOff: "Aus",
        resetProgress: "Fortschritt löschen",
        confirmReset: "Wirklich alles löschen?",
        yes: "Ja",
        no: "Nein",

        // Footer
        madeWith: "with Love",
        forKids: "for Lia & Tim",

        // Tutorial hints
        hintClick: "Klicke auf die bunte Form!",
        hintDrag: "Ziehe die Form zum Ziel!",
        hintDouble: "Klicke zweimal schnell!",
        hintCatch: "Fange die Form bevor sie weg ist!"
    },

    en: {
        // Main Menu
        title: "KidsQuids",
        subtitle: "Learn to use the mouse!",
        play: "Play",
        settings: "Settings",

        // Difficulty Selection
        chooseDifficulty: "Choose your level",
        difficultyStarter: "Starter",
        difficultyStarterDesc: "For beginners",
        difficultyExplorer: "Explorer",
        difficultyExplorerDesc: "Getting better",
        difficultyChampion: "Champion",
        difficultyChampionDesc: "For pros",
        locked: "Locked",

        // Game Modes
        chooseGame: "What do you want to play?",
        modeClick: "Click Fun",
        modeClickDesc: "Click the shapes!",
        modeCatch: "Shape Catcher",
        modeCatchDesc: "Catch the shapes!",
        modeDrag: "Puzzle Slider",
        modeDragDesc: "Drag the shapes!",
        modeDouble: "Double Pop",
        modeDoubleDesc: "Double-click to pop!",

        // Game UI
        score: "Score",
        level: "Level",
        time: "Time",
        stars: "Stars",
        coins: "Coins",

        // Feedback
        great: "Great!",
        awesome: "Awesome!",
        perfect: "Perfect!",
        tryAgain: "Try again!",
        wellDone: "Well done!",
        amazing: "Amazing!",

        // Level Complete
        levelComplete: "Level complete!",
        nextLevel: "Next",
        replay: "Replay",
        backToMenu: "Back",
        newRecord: "New Record!",

        // Unlocks
        newUnlock: "New unlock!",
        modeUnlocked: "New game mode!",
        themeUnlocked: "New color theme!",

        // Settings
        language: "Language",
        sound: "Sound",
        soundOn: "On",
        soundOff: "Off",
        resetProgress: "Reset progress",
        confirmReset: "Really delete everything?",
        yes: "Yes",
        no: "No",

        // Footer
        madeWith: "with Love",
        forKids: "for Lia & Tim",

        // Tutorial hints
        hintClick: "Click on the colorful shape!",
        hintDrag: "Drag the shape to the target!",
        hintDouble: "Click twice quickly!",
        hintCatch: "Catch the shape before it's gone!"
    }
};

class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        const saved = localStorage.getItem('kidsquids_language');
        if (saved && translations[saved]) {
            return saved;
        }
        const browserLang = navigator.language.split('-')[0];
        return translations[browserLang] ? browserLang : 'en';
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('kidsquids_language', lang);
            this.updateAllTexts();
        }
    }

    t(key) {
        return translations[this.currentLang][key] || translations['en'][key] || key;
    }

    updateAllTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    }
}

const i18n = new I18n();
