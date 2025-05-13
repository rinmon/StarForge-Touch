/**
 * Game クラス
 * ゲームの状態管理、ルール処理、ステージ管理を担当します
 */
class Game {
    constructor() {
        // ゲームの現在のステージ
        this.currentStage = null;
        
        // 現在のグリッド
        this.grid = null;
        
        // プレイヤー
        this.player = null;
        
        // 移動履歴
        this.moveHistory = [];
        
        // 現在の手数
        this.moveCount = 0;
        
        // ステージの制限手数
        this.moveLimit = 0;
        
        // ステージのクリスタル数
        this.totalCrystals = 0;
        
        // 収集済みクリスタル数
        this.collectedCrystals = 0;
        
        // ポータルに配置済みクリスタル数
        this.placedCrystals = 0;
        
        // ゲームの状態（'playing', 'cleared', 'failed'）
        this.gameState = 'playing';
        
        console.log('Game instance created');
    }
    
    /**
     * ステージをロードする
     * @param {number} levelNum - ステージ番号
     */
    loadStage(levelNum) {
        console.log(`Loading stage ${levelNum}`);
        
        // ステージデータを取得（将来的にはサーバーから取得）
        this.currentStage = this.getStageData(levelNum);
        
        // グリッドコンテナが表示されているか確認
        const gridContainer = document.getElementById('grid-container');
        if (!gridContainer) {
            console.error('Grid container not found!');
            return;
        }
        
        console.log(`Creating grid with size ${this.currentStage.size}x${this.currentStage.size}`);
        
        // グリッドの作成
        this.grid = new Grid(this.currentStage.size, this.currentStage.cells);
        
        // グリッドを描画
        console.log('Rendering grid...');
        this.grid.render();
        
        // プレイヤーの作成（オーブ）
        this.player = new Player(this.currentStage.playerPosition);
        
        // ゲーム状態のリセット
        this.resetGameState();
        
        // 移動制限と手数カウンターの更新
        this.moveLimit = this.currentStage.moveLimit;
        this.updateMovesCounter();
        
        // クリスタル数を設定
        this.totalCrystals = this.currentStage.crystalPositions.length;
        
        // セルに各要素を表示（オーブなど）
        this.updateGridItems();
        
        console.log(`Stage loaded. Size: ${this.currentStage.size}x${this.currentStage.size}, Move limit: ${this.moveLimit}`);
    }
    
    /**
     * ステージデータを取得
     * @param {number} levelNum - ステージ番号
     * @returns {Object} ステージデータ
     */
    getStageData(levelNum) {
        // ここでは仮のステージデータを返す
        // 将来的にはサーバーからJSONとして取得するか、ステージファイルから読み込む
        
        // レベル1: 基本的な3x3ステージ
        if (levelNum === 1) {
            return {
                id: "3x3_001",
                size: 3,
                moveLimit: 6,
                playerPosition: { x: 0, y: 0 },
                crystalPositions: [
                    { x: 1, y: 1 },
                    { x: 2, y: 1 }
                ],
                portalPosition: { x: 2, y: 2 },
                wallPositions: [
                    { x: 1, y: 0 }
                ],
                cells: [
                    // マトリックス表現のグリッド（0: 空、1: 壁、2: オーブ、3: クリスタル、4: ポータル）
                    [2, 0, 0],
                    [1, 3, 0],
                    [0, 3, 4]
                ],
                minMoves: 5,  // 最適手数
                gimmicks: []  // ギミックなし
            };
        }
        
        // レベル2: 動く壁を導入
        else if (levelNum === 2) {
            return {
                id: "3x3_002",
                size: 3,
                moveLimit: 8,
                playerPosition: { x: 0, y: 0 },
                crystalPositions: [
                    { x: 2, y: 0 },
                    { x: 1, y: 2 }
                ],
                portalPosition: { x: 2, y: 2 },
                wallPositions: [
                    { x: 1, y: 1 }
                ],
                cells: [
                    [2, 0, 3],
                    [0, 1, 0],
                    [0, 3, 4]
                ],
                minMoves: 7,
                gimmicks: [
                    {
                        type: "moving_wall",
                        position: { x: 1, y: 1 },
                        direction: "right",
                        movePattern: [
                            { dx: 1, dy: 0 },
                            { dx: -1, dy: 0 }
                        ]
                    }
                ]
            };
        }
        
        // その他のレベルは基本的な3x3ステージを返す
        return {
            id: `3x3_${levelNum.toString().padStart(3, '0')}`,
            size: 3,
            moveLimit: 8,
            playerPosition: { x: 0, y: 0 },
            crystalPositions: [
                { x: 2, y: 0 },
                { x: 0, y: 2 }
            ],
            portalPosition: { x: 2, y: 2 },
            wallPositions: [],
            cells: [
                [2, 0, 3],
                [0, 0, 0],
                [3, 0, 4]
            ],
            minMoves: 6,
            gimmicks: []
        };
    }
    
    /**
     * ゲーム状態をリセット
     */
    resetGameState() {
        this.moveCount = 0;
        this.moveHistory = [];
        this.collectedCrystals = 0;
        this.placedCrystals = 0;
        this.gameState = 'playing';
        
        console.log('Game state reset');
    }
    
    /**
     * ステージをリセット
     */
    resetStage() {
        console.log('Resetting stage...');
        
        // グリッドをリセット
        this.grid.resetGrid(this.currentStage.cells);
        
        // プレイヤー位置をリセット
        this.player.setPosition(this.currentStage.playerPosition);
        
        // ゲーム状態をリセット
        this.resetGameState();
        
        // 手数カウンターを更新
        this.updateMovesCounter();
        
        // リセット効果音
        SoundManager.playSound('reset');
        
        // セルに各要素を表示（オーブなど）
        this.updateGridItems();
        
        console.log('Stage reset complete');
    }
    
    /**
     * グリッド上の要素（オーブ、クリスタル、ポータル）を更新
     */
    updateGridItems() {
        console.log('Updating grid items...');
        
        // キャラクター（オーブ）の表示
        if (this.player && this.player.position) {
            this.grid.placeItem(this.player.position.x, this.player.position.y, 2);
        }
        
        // クリスタルの表示
        if (this.currentStage && this.currentStage.crystalPositions) {
            this.currentStage.crystalPositions.forEach(pos => {
                // 未収集のクリスタルのみ表示
                if (!this.isCrystalCollected(pos.x, pos.y)) {
                    this.grid.placeItem(pos.x, pos.y, 3);
                }
            });
        }
        
        // ポータルの表示
        if (this.currentStage && this.currentStage.portalPosition) {
            const portal = this.currentStage.portalPosition;
            this.grid.placeItem(portal.x, portal.y, 4);
        }
        
        // 壁の表示
        if (this.currentStage && this.currentStage.wallPositions) {
            this.currentStage.wallPositions.forEach(pos => {
                this.grid.placeItem(pos.x, pos.y, 1);
            });
        }
        
        console.log('Grid items updated');
    }
    
    /**
     * クリスタルが収集済みかチェック
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @returns {boolean} 収集済みならtrue
     */
    isCrystalCollected(x, y) {
        // 収集済みクリスタルのチェックロジック
        // 仮実装：収集済み判定はマスの値がクリスタルでないかチェック
        return this.grid.getCell(x, y) !== 3;
    }
    
    /**
     * セルをタップしたときの処理
     * @param {number} x - タップしたセルのX座標
     * @param {number} y - タップしたセルのY座標
     */
    tapCell(x, y) {
        // ゲームがプレイ中でない場合は処理しない
        if (this.gameState !== 'playing') {
            return;
        }
        
        console.log(`Tapped cell at (${x}, ${y})`);
        
        const tappedCell = this.grid.getCell(x, y);
        
        // タップしたセルの状態によって異なる処理
        
        // オーブがクリスタルを持っている場合
        if (this.player.hasCollectedCrystal) {
            // ポータルをタップした場合
            if (tappedCell === 4) {
                this.placeCrystal(x, y);
                return;
            }
        }
        // オーブがクリスタルを持っていない場合
        else {
            // クリスタルをタップした場合
            if (tappedCell === 3) {
                this.collectCrystal(x, y);
                return;
            }
        }
        
        // 移動可能なセルをタップした場合（空マス）
        if (tappedCell === 0) {
            this.movePlayer(x, y);
        }
    }
    
    /**
     * プレイヤーを移動
     * @param {number} x - 移動先のX座標
     * @param {number} y - 移動先のY座標
     */
    movePlayer(x, y) {
        console.log(`Moving player to (${x}, ${y})`);
        
        // 現在の位置を保存
        const previousPosition = { 
            x: this.player.position.x, 
            y: this.player.position.y 
        };
        
        // パスファインディングでルートを計算
        const path = this.grid.findPath(
            this.player.position.x, this.player.position.y, 
            x, y
        );
        
        // 経路がない場合
        if (!path || path.length === 0) {
            console.log('No valid path found');
            return;
        }
        
        // 移動を実行
        this.player.moveTo(x, y);
        
        // 移動効果音
        SoundManager.playSound('move');
        
        // 移動履歴に追加
        this.moveHistory.push({
            type: 'move',
            from: previousPosition,
            to: { x, y }
        });
        
        // 手数を増やす
        this.moveCount++;
        
        // 手数カウンターを更新
        this.updateMovesCounter();
        
        // 手数制限をチェック
        this.checkMoveLimit();
        
        // グリッドを更新
        this.grid.updateGrid();
        
        console.log(`Player moved to (${x}, ${y}). Move count: ${this.moveCount}/${this.moveLimit}`);
    }
    
    /**
     * クリスタルを収集
     * @param {number} x - クリスタルのX座標
     * @param {number} y - クリスタルのY座標
     */
    collectCrystal(x, y) {
        console.log(`Collecting crystal at (${x}, ${y})`);
        
        // オーブがすでにクリスタルを持っている場合
        if (this.player.hasCollectedCrystal) {
            console.log('Player already has a crystal');
            return;
        }
        
        // プレイヤーとクリスタルが隣接しているか
        if (!this.grid.isAdjacent(this.player.position.x, this.player.position.y, x, y)) {
            console.log('Crystal is not adjacent to player');
            
            // クリスタルへの移動パスを計算して移動
            this.movePlayer(x, y);
            return;
        }
        
        // クリスタルを収集
        this.player.collectCrystal();
        
        // グリッドのクリスタルを削除
        this.grid.removeItem(x, y);
        
        // 収集効果音
        SoundManager.playSound('collect');
        
        // 収集済みクリスタル数を増やす
        this.collectedCrystals++;
        
        // 移動履歴に追加
        this.moveHistory.push({
            type: 'collect',
            position: { x, y }
        });
        
        // 手数を増やす
        this.moveCount++;
        
        // 手数カウンターを更新
        this.updateMovesCounter();
        
        // 手数制限をチェック
        this.checkMoveLimit();
        
        console.log(`Crystal collected. Move count: ${this.moveCount}/${this.moveLimit}`);
    }
    
    /**
     * クリスタルをポータルに配置
     * @param {number} x - ポータルのX座標
     * @param {number} y - ポータルのY座標
     */
    placeCrystal(x, y) {
        console.log(`Placing crystal at portal (${x}, ${y})`);
        
        // オーブがクリスタルを持っていない場合
        if (!this.player.hasCollectedCrystal) {
            console.log('Player has no crystal to place');
            return;
        }
        
        // ポータルがあるか確認
        if (this.grid.getCell(x, y) !== 4) {
            console.log('No portal at this position');
            return;
        }
        
        // プレイヤーとポータルが隣接しているか
        if (!this.grid.isAdjacent(this.player.position.x, this.player.position.y, x, y)) {
            console.log('Portal is not adjacent to player');
            
            // ポータルへの移動パスを計算して移動
            this.movePlayer(x, y);
            return;
        }
        
        // クリスタルを配置
        this.player.placeCrystal();
        
        // 配置効果音
        SoundManager.playSound('place');
        
        // 配置済みクリスタル数を増やす
        this.placedCrystals++;
        
        // 移動履歴に追加
        this.moveHistory.push({
            type: 'place',
            position: { x, y }
        });
        
        // 手数を増やす
        this.moveCount++;
        
        // 手数カウンターを更新
        this.updateMovesCounter();
        
        // 手数制限をチェック
        this.checkMoveLimit();
        
        // クリア条件のチェック
        this.checkClearCondition();
        
        console.log(`Crystal placed. Placed: ${this.placedCrystals}/${this.totalCrystals}. Move count: ${this.moveCount}/${this.moveLimit}`);
    }
    
    /**
     * 手数制限をチェック
     */
    checkMoveLimit() {
        if (this.moveCount >= this.moveLimit) {
            console.log('Move limit reached');
            
            // ゲームオーバー状態に設定
            this.gameState = 'failed';
            
            // 失敗効果音
            SoundManager.playSound('fail');
            
            // ステータスメッセージ
            document.getElementById('status-message').textContent = '手数制限に達しました';
            
            // 2秒後にステージをリセット
            setTimeout(() => {
                document.getElementById('status-message').textContent = '';
                this.resetStage();
            }, 2000);
        }
    }
    
    /**
     * クリア条件をチェック
     */
    checkClearCondition() {
        if (this.placedCrystals >= this.totalCrystals) {
            console.log('Stage cleared!');
            
            // クリア状態に設定
            this.gameState = 'cleared';
            
            // クリア効果音
            SoundManager.playSound('success');
            
            // ステージクリアの報告
            StarForge.stageClear(this.moveCount, this.currentStage.minMoves);
        }
    }
    
    /**
     * 手数カウンターを更新
     */
    updateMovesCounter() {
        document.getElementById('moves-counter').textContent = `${this.moveCount}/${this.moveLimit}`;
    }
    
    /**
     * 移動の取り消し
     */
    undoMove() {
        // 履歴がない場合
        if (this.moveHistory.length === 0) {
            console.log('No moves to undo');
            return;
        }
        
        console.log('Undoing last move');
        
        // 最後の操作を取得
        const lastMove = this.moveHistory.pop();
        
        // 操作タイプによって処理を分ける
        switch (lastMove.type) {
            case 'move':
                // プレイヤーを前の位置に戻す
                this.player.setPosition(lastMove.from);
                break;
                
            case 'collect':
                // クリスタルを元に戻す
                this.grid.placeItem(lastMove.position.x, lastMove.position.y, 3);
                this.player.placeCrystal();
                this.collectedCrystals--;
                break;
                
            case 'place':
                // クリスタルをプレイヤーに戻す
                this.player.collectCrystal();
                this.placedCrystals--;
                break;
        }
        
        // 手数を減らす
        this.moveCount--;
        
        // 手数カウンターを更新
        this.updateMovesCounter();
        
        // グリッドを更新
        this.grid.updateGrid();
        
        // 効果音
        SoundManager.playSound('undo');
        
        console.log('Move undone successfully');
    }
    
    /**
     * ヒントを表示
     */
    showHint() {
        console.log('Showing hint');
        
        // スターダストが足りるかチェック
        if (StarForge.state.stardust < 50) {
            console.log('Not enough stardust for hint');
            document.getElementById('status-message').textContent = 'ヒントには50スターダストが必要です';
            
            setTimeout(() => {
                document.getElementById('status-message').textContent = '';
            }, 2000);
            
            return;
        }
        
        // スターダストを消費
        StarForge.state.stardust -= 50;
        StarForge.saveUserData();
        
        // ヒントの計算（ここでは単純な例）
        let hintMessage = '';
        
        // オーブがクリスタルを持っている場合
        if (this.player.hasCollectedCrystal) {
            hintMessage = 'ポータルにクリスタルを配置しましょう';
        }
        // クリスタルがまだ残っている場合
        else if (this.collectedCrystals < this.totalCrystals) {
            hintMessage = 'クリスタルを収集しましょう';
        }
        // それ以外の場合
        else {
            hintMessage = '最短経路で移動しましょう';
        }
        
        // ヒントを表示
        document.getElementById('status-message').textContent = hintMessage;
        
        // 効果音
        SoundManager.playSound('hint');
        
        // 3秒後に消去
        setTimeout(() => {
            document.getElementById('status-message').textContent = '';
        }, 3000);
        
        console.log(`Hint displayed: ${hintMessage}`);
    }
}
