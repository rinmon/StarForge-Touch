/**
 * Storage オブジェクト
 * ローカルストレージでのデータ保存・読み込みを担当します
 */
const Storage = {
    // ローカルストレージキー
    USER_DATA_KEY: 'starforge_touch_user_data',
    SETTINGS_KEY: 'starforge_touch_settings',
    STAGE_PROGRESS_KEY: 'starforge_touch_stage_progress',
    
    /**
     * ユーザーデータを保存
     * @param {Object} userData - ユーザーデータオブジェクト
     */
    saveUserData: function(userData) {
        console.log('Saving user data to local storage...');
        
        try {
            // JSONに変換して保存
            localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
            console.log('User data saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save user data:', error);
            return false;
        }
    },
    
    /**
     * ユーザーデータを読み込み
     * @returns {Object|null} ユーザーデータオブジェクト
     */
    loadUserData: function() {
        console.log('Loading user data from local storage...');
        
        try {
            // ローカルストレージから読み込み
            const data = localStorage.getItem(this.USER_DATA_KEY);
            
            if (!data) {
                console.log('No user data found in local storage');
                return null;
            }
            
            // JSONをパースして返す
            const userData = JSON.parse(data);
            console.log('User data loaded successfully');
            return userData;
        } catch (error) {
            console.error('Failed to load user data:', error);
            return null;
        }
    },
    
    /**
     * 設定を保存
     * @param {Object} settings - 設定オブジェクト
     */
    saveSettings: function(settings) {
        console.log('Saving settings to local storage...');
        
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            console.log('Settings saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    },
    
    /**
     * 設定を読み込み
     * @returns {Object} 設定オブジェクト
     */
    loadSettings: function() {
        console.log('Loading settings from local storage...');
        
        try {
            const data = localStorage.getItem(this.SETTINGS_KEY);
            
            if (!data) {
                console.log('No settings found, using defaults');
                return {
                    soundVolume: 0.8,
                    orbColor: 'default',
                    gridNumbers: true
                };
            }
            
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
            return {
                soundVolume: 0.8,
                orbColor: 'default',
                gridNumbers: true
            };
        }
    },
    
    /**
     * ステージ進行状況を保存
     * @param {Object} progress - ステージ進行データ
     */
    saveStageProgress: function(progress) {
        console.log('Saving stage progress...');
        
        try {
            localStorage.setItem(this.STAGE_PROGRESS_KEY, JSON.stringify(progress));
            console.log('Stage progress saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save stage progress:', error);
            return false;
        }
    },
    
    /**
     * ステージ進行状況を読み込み
     * @returns {Object} ステージ進行データ
     */
    loadStageProgress: function() {
        console.log('Loading stage progress...');
        
        try {
            const data = localStorage.getItem(this.STAGE_PROGRESS_KEY);
            
            if (!data) {
                console.log('No stage progress found');
                return {
                    currentLevel: 1,
                    clearedStages: [],
                    highscores: {}
                };
            }
            
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load stage progress:', error);
            return {
                currentLevel: 1,
                clearedStages: [],
                highscores: {}
            };
        }
    },
    
    /**
     * 特定のステージのハイスコアを保存
     * @param {string} stageId - ステージID
     * @param {Object} score - スコアデータ（手数、時間など）
     */
    saveHighscore: function(stageId, score) {
        console.log(`Saving highscore for stage ${stageId}...`);
        
        // 現在のハイスコアを読み込む
        const progress = this.loadStageProgress();
        
        if (!progress.highscores) {
            progress.highscores = {};
        }
        
        // 現在のハイスコアと比較して更新
        const currentHighscore = progress.highscores[stageId];
        
        if (!currentHighscore || score.moves < currentHighscore.moves) {
            progress.highscores[stageId] = score;
            this.saveStageProgress(progress);
            console.log(`New highscore saved for stage ${stageId}: ${score.moves} moves`);
            return true;
        }
        
        console.log(`No new highscore for stage ${stageId}`);
        return false;
    },
    
    /**
     * ローカルストレージをクリア（デバッグ用）
     */
    clearAllData: function() {
        console.warn('Clearing all StarForge Touch data from local storage...');
        
        localStorage.removeItem(this.USER_DATA_KEY);
        localStorage.removeItem(this.SETTINGS_KEY);
        localStorage.removeItem(this.STAGE_PROGRESS_KEY);
        
        console.log('All data cleared');
    }
};
