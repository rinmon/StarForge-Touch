/**
 * TouchHandler クラス
 * タッチおよびクリックイベントの管理を担当します
 * iPhone Safariに最適化したタッチ操作を提供します
 */
const TouchHandler = {
    // タッチイベントが有効かどうか
    enabled: true,
    
    // 最後にタッチした座標
    lastTouchPos: { x: 0, y: 0 },
    
    // タッチスタート時刻
    touchStartTime: 0,
    
    /**
     * タッチイベントの初期化
     */
    init: function() {
        console.log('Initializing touch handler...');
        
        // グリッドコンテナを取得
        const gridContainer = document.getElementById('grid-container');
        
        // タッチイベントを設定
        gridContainer.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        gridContainer.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        gridContainer.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        
        // モバイルでのスクロールと拡大を防止
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('#grid-container')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // ダブルタップでの拡大を防止
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        console.log('Touch handler initialized');
    },
    
    /**
     * タッチスタート時の処理
     * @param {TouchEvent} event - タッチイベント
     */
    onTouchStart: function(event) {
        // タッチが無効化されている場合は処理しない
        if (!this.enabled) {
            return;
        }
        
        // デフォルトのタッチ動作を防止
        event.preventDefault();
        
        // タッチ位置を保存
        const touch = event.touches[0];
        this.lastTouchPos.x = touch.clientX;
        this.lastTouchPos.y = touch.clientY;
        
        // タッチ開始時刻を記録
        this.touchStartTime = Date.now();
        
        console.log('Touch started');
    },
    
    /**
     * タッチ終了時の処理
     * @param {TouchEvent} event - タッチイベント
     */
    onTouchEnd: function(event) {
        // タッチが無効化されている場合は処理しない
        if (!this.enabled) {
            return;
        }
        
        // デフォルトのタッチ動作を防止
        event.preventDefault();
        
        // タッチ時間を計算
        const touchDuration = Date.now() - this.touchStartTime;
        
        // 長押し（500ms以上）の場合はセル情報表示
        if (touchDuration >= 500) {
            const element = document.elementFromPoint(this.lastTouchPos.x, this.lastTouchPos.y);
            if (element && element.classList.contains('grid-cell')) {
                const x = parseInt(element.dataset.x);
                const y = parseInt(element.dataset.y);
                StarForge.game.grid.showCellInfo(x, y);
            }
            return;
        }
        
        // タップされた要素を検出
        const element = document.elementFromPoint(this.lastTouchPos.x, this.lastTouchPos.y);
        
        // グリッドセルでない場合は処理しない
        if (!element || !element.classList.contains('grid-cell')) {
            return;
        }
        
        // セルの座標を取得
        const x = parseInt(element.dataset.x);
        const y = parseInt(element.dataset.y);
        
        // ゲームのタップ処理を呼び出す
        StarForge.game.tapCell(x, y);
        
        console.log(`Cell tapped at (${x}, ${y})`);
    },
    
    /**
     * タッチ移動時の処理
     * @param {TouchEvent} event - タッチイベント
     */
    onTouchMove: function(event) {
        // タッチが無効化されている場合は処理しない
        if (!this.enabled) {
            return;
        }
        
        // デフォルトのタッチ動作を防止
        event.preventDefault();
        
        // タッチ位置を更新
        const touch = event.touches[0];
        this.lastTouchPos.x = touch.clientX;
        this.lastTouchPos.y = touch.clientY;
    },
    
    /**
     * タッチイベントの有効/無効を切り替え
     * @param {boolean} isEnabled - 有効にするかどうか
     */
    setEnabled: function(isEnabled) {
        this.enabled = isEnabled;
        console.log(`Touch events ${isEnabled ? 'enabled' : 'disabled'}`);
    }
};
