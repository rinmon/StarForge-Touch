/**
 * StarForge Touch - メインゲーム初期化スクリプト
 * 
 * このファイルはゲームの初期化とグローバル設定を担当します。
 * ゲームの起動、状態管理、各モジュールの連携を制御します。
 */

// グローバルゲームオブジェクト
const StarForge = {
    // ゲームのメインインスタンス
    game: null,
    
    // 画面管理
    screens: {
        start: document.getElementById('start-screen'),
        tutorial: document.getElementById('tutorial-screen'),
        game: document.getElementById('game-screen')
    },
    
    // グローバル設定
    settings: {
        soundVolume: 0.8,
        orbColor: 'default',
        gridNumbers: true
    },
    
    // ゲームの状態
    state: {
        currentLevel: 1,
        stardust: 0,
        isGameActive: false,
        currentScreen: 'start' // 現在表示中の画面
    },
    
    // 初期化関数
    init: function() {
        console.log('StarForge Touch initializing...');
        
        // ローカルストレージからデータを読み込む
        this.loadUserData();
        
        // ゲームインスタンスの作成
        this.game = new Game();
        
        // UIイベントのセットアップ
        this.setupUI();
        
        // スタート画面を表示
        this.showScreen('start');
        
        // メニューボタンのイベント設定
        this.setupMenuEvents();
        
        console.log('StarForge Touch initialized');
    },
    
    // 画面切り替え
    showScreen: function(screenName) {
        console.log(`Showing screen: ${screenName}`);
        
        // すべての画面を非表示に
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.style.display = 'none';
            }
        });
        
        // 指定された画面を表示
        if (this.screens[screenName]) {
            this.screens[screenName].style.display = 'flex';
            this.state.currentScreen = screenName;
        }
    },
    
    // メニューイベントの設定
    setupMenuEvents: function() {
        console.log('Setting up menu events...');
        
        // スタート画面のボタン
        document.getElementById('start-game-btn').addEventListener('click', () => {
            // ゲーム画面に切り替え
            this.showScreen('game');
            
            // ゲームを初期化（まだ初期化していない場合）
            if (!this.game) {
                console.log('ゲームインスタンスを作成してステージをロードします');
                this.game = new Game();
                this.loadStage(this.state.currentLevel);
            } else {
                console.log('既存のゲームインスタンスを使用します');
                // グリッドを再描画する必要がある場合
                if (this.game.grid) {
                    this.game.grid.render();
                }
            }
        });
        
        document.getElementById('how-to-play-btn').addEventListener('click', () => {
            // 遊び方画面に切り替え
            this.showScreen('tutorial');
        });
        
        // 遊び方画面のボタン
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            // スタート画面に戻る
            this.showScreen('start');
        });
        
        // ゲーム画面のメニューボタン
        document.getElementById('menu-btn').addEventListener('click', () => {
            // スタート画面に戻る
            this.showScreen('start');
        });
    },
    
    // ユーザーデータのロード
    loadUserData: function() {
        console.log('Loading user data...');
        
        // ローカルストレージからデータを取得
        const userData = Storage.loadUserData();
        
        if (userData) {
            this.state.currentLevel = userData.level || 1;
            this.state.stardust = userData.stardust || 0;
            this.settings.soundVolume = userData.settings?.sound_volume || 0.8;
            this.settings.orbColor = userData.settings?.orb_color || 'default';
            this.settings.gridNumbers = userData.settings?.grid_numbers || true;
        }
        
        console.log(`User data loaded. Level: ${this.state.currentLevel}, Stardust: ${this.state.stardust}`);
    },
    
    // UIイベントのセットアップ
    setupUI: function() {
        console.log('Setting up UI...');
        
        // リセットボタン
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.game.resetStage();
        });
        
        // ヒントボタン
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.game.showHint();
        });
        
        // 取り消しボタン
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.game.undoMove();
        });
        
        // タッチイベントの初期化
        TouchHandler.init();
        
        // サウンドの初期化
        SoundManager.init(this.settings.soundVolume);
        
        // スクリーン要素の参照を更新
        this.updateScreenReferences();
        
        console.log('UI setup complete');
    },
    
    // 画面要素の参照を更新
    updateScreenReferences: function() {
        this.screens = {
            start: document.getElementById('start-screen'),
            tutorial: document.getElementById('tutorial-screen'),
            game: document.getElementById('game-screen')
        };
    },
    
    // ステージのロード
    loadStage: function(levelNum) {
        console.log(`Loading stage ${levelNum}...`);
        
        // レベル表示の更新
        document.getElementById('level-info').textContent = `Level: ${levelNum}`;
        
        // ゲームにステージをロード
        this.game.loadStage(levelNum);
        
        // ゲーム状態の更新
        this.state.isGameActive = true;
        
        console.log(`Stage ${levelNum} loaded`);
    },
    
    // ステージクリア時の処理
    stageClear: function(moveCount, minMoves) {
        console.log(`Stage cleared! Moves: ${moveCount}, Minimum: ${minMoves}`);
        
        // スターダスト報酬
        let reward = 100;  // ベース報酬
        
        // 最適手数でクリアした場合のボーナス
        if (moveCount <= minMoves) {
            reward += 50;
            console.log('Optimal solution bonus: +50 stardust');
        }
        
        this.state.stardust += reward;
        
        // 次のレベルへ進める
        this.state.currentLevel++;
        
        // ユーザーデータを保存
        this.saveUserData();
        
        // ステータスメッセージの表示
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = `ステージクリア！ +${reward} スターダスト獲得`;
        
        // 3秒後に次のステージをロード
        setTimeout(() => {
            statusMessage.textContent = '';
            this.loadStage(this.state.currentLevel);
        }, 3000);
    },
    
    // ユーザーデータの保存
    saveUserData: function() {
        console.log('Saving user data...');
        
        const userData = {
            level: this.state.currentLevel,
            stardust: this.state.stardust,
            settings: {
                sound_volume: this.settings.soundVolume,
                orb_color: this.settings.orbColor,
                grid_numbers: this.settings.gridNumbers
            }
        };
        
        Storage.saveUserData(userData);
        
        // サーバーと同期（オンライン時のみ）
        if (navigator.onLine) {
            SyncManager.syncUserData(userData);
        }
        
        console.log('User data saved');
    }
};

// DOMContentLoaded イベントでゲーム初期化
document.addEventListener('DOMContentLoaded', function() {
    StarForge.init();
});
