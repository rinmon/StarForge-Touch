/**
 * Grid クラス
 * ゲームのグリッド表示と論理的な操作を担当します
 */
class Grid {
    /**
     * グリッドの初期化
     * @param {number} size - グリッドのサイズ（3x3, 5x5, 7x7）
     * @param {Array} initialCells - 初期セル配置の2次元配列
     */
    constructor(size, initialCells) {
        // グリッドのサイズ
        this.size = size;
        
        // グリッドのDOMコンテナ
        this.container = document.getElementById('grid-container');
        
        // グリッドのセル（2次元配列）
        this.cells = [];
        
        // DOMのセル要素（2次元配列）
        this.cellElements = [];
        
        // 初期データがあれば設定
        if (initialCells) {
            this.cells = JSON.parse(JSON.stringify(initialCells));
        } else {
            // 空のグリッドを作成
            this.initEmptyGrid();
        }
        
        console.log(`Grid initialized with size ${size}x${size}`);
    }
    
    /**
     * 空のグリッドを初期化
     */
    initEmptyGrid() {
        this.cells = Array(this.size).fill().map(() => Array(this.size).fill(0));
        console.log('Empty grid initialized');
    }
    
    /**
     * グリッドを描画
     */
    render() {
        console.log('Rendering grid...');
        
        // コンテナをクリア
        this.container.innerHTML = '';
        
        // グリッドのスタイルを設定
        this.container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        // セル要素の配列を初期化
        this.cellElements = Array(this.size).fill().map(() => Array(this.size).fill(null));
        
        // セルを作成
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // 番号表示（設定がオンの場合）
                if (StarForge.settings.gridNumbers) {
                    const label = document.createElement('span');
                    label.className = 'cell-label';
                    // A1形式の表記（A, B, C, ... + 1, 2, 3, ...）
                    label.textContent = `${String.fromCharCode(65 + x)}${y + 1}`;
                    cell.appendChild(label);
                }
                
                // クリックイベントを設定
                cell.addEventListener('click', () => {
                    StarForge.game.tapCell(x, y);
                });
                
                // 長押しイベントを設定
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); // 右クリックメニュー無効化
                    this.showCellInfo(x, y);
                });
                
                // 長押し（モバイル用）
                let pressTimer;
                cell.addEventListener('touchstart', () => {
                    pressTimer = setTimeout(() => {
                        this.showCellInfo(x, y);
                    }, 500); // 500ms長押し
                });
                cell.addEventListener('touchend', () => {
                    clearTimeout(pressTimer);
                });
                
                // セルの内容を設定
                this.updateCellContent(cell, this.cells[y][x]);
                
                // DOMに追加
                this.container.appendChild(cell);
                
                // セル要素を配列に保存
                this.cellElements[y][x] = cell;
            }
        }
        
        console.log('Grid rendering complete');
    }
    
    /**
     * セルの内容を更新
     * @param {HTMLElement} cellElement - セルのDOM要素
     * @param {number} cellType - セルの種類（0: 空, 1: 壁, 2: オーブ, 3: クリスタル, 4: ポータル）
     */
    updateCellContent(cellElement, cellType) {
        // 既存のコンテンツをクリア
        cellElement.innerHTML = '';
        
        // グリッド番号表示（設定がオンの場合）
        if (StarForge.settings.gridNumbers) {
            const x = parseInt(cellElement.dataset.x);
            const y = parseInt(cellElement.dataset.y);
            const label = document.createElement('span');
            label.className = 'cell-label';
            label.textContent = `${String.fromCharCode(65 + x)}${y + 1}`;
            cellElement.appendChild(label);
        }
        
        // セルタイプに応じたコンテンツを追加
        switch (cellType) {
            case 0: // 空
                break;
                
            case 1: // 壁
                const wall = document.createElement('div');
                wall.className = 'wall';
                cellElement.appendChild(wall);
                break;
                
            case 2: // オーブ
                const orb = document.createElement('div');
                orb.className = 'orb';
                // オーブのスキンを設定
                if (StarForge.settings.orbColor !== 'default') {
                    orb.classList.add(`orb-${StarForge.settings.orbColor}`);
                }
                cellElement.appendChild(orb);
                break;
                
            case 3: // クリスタル
                const crystal = document.createElement('div');
                crystal.className = 'crystal';
                cellElement.appendChild(crystal);
                break;
                
            case 4: // ポータル
                const portal = document.createElement('div');
                portal.className = 'portal';
                cellElement.appendChild(portal);
                break;
                
            case 5: // 動く壁
                const movingWall = document.createElement('div');
                movingWall.className = 'moving-wall';
                cellElement.appendChild(movingWall);
                break;
                
            case 6: // スイッチ
                const switchElem = document.createElement('div');
                switchElem.className = 'switch';
                cellElement.appendChild(switchElem);
                break;
        }
    }
    
    /**
     * グリッド全体を更新
     */
    updateGrid() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.updateCellContent(this.cellElements[y][x], this.cells[y][x]);
            }
        }
    }
    
    /**
     * グリッドをリセット
     * @param {Array} initialCells - 初期セル配置の2次元配列
     */
    resetGrid(initialCells) {
        if (initialCells) {
            this.cells = JSON.parse(JSON.stringify(initialCells));
        } else {
            this.initEmptyGrid();
        }
        
        this.updateGrid();
        console.log('Grid reset complete');
    }
    
    /**
     * セルの種類を取得
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @returns {number} セルの種類
     */
    getCell(x, y) {
        // 範囲外チェック
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return -1; // 範囲外
        }
        
        return this.cells[y][x];
    }
    
    /**
     * セルに項目を配置
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} itemType - 項目の種類
     */
    placeItem(x, y, itemType) {
        // 範囲外チェック
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return false;
        }
        
        this.cells[y][x] = itemType;
        
        // DOM要素があれば更新
        if (this.cellElements[y] && this.cellElements[y][x]) {
            this.updateCellContent(this.cellElements[y][x], itemType);
        }
        
        return true;
    }
    
    /**
     * セルから項目を削除
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    removeItem(x, y) {
        // 範囲外チェック
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return false;
        }
        
        this.cells[y][x] = 0; // 空に設定
        
        // DOM要素があれば更新
        if (this.cellElements[y] && this.cellElements[y][x]) {
            this.updateCellContent(this.cellElements[y][x], 0);
        }
        
        return true;
    }
    
    /**
     * セルがプレイヤーの隣接セルかどうか
     * @param {number} playerX - プレイヤーのX座標
     * @param {number} playerY - プレイヤーのY座標
     * @param {number} targetX - 対象のX座標
     * @param {number} targetY - 対象のY座標
     * @returns {boolean} 隣接しているかどうか
     */
    isAdjacent(playerX, playerY, targetX, targetY) {
        // マンハッタン距離が1かどうか
        return Math.abs(playerX - targetX) + Math.abs(playerY - targetY) === 1;
    }
    
    /**
     * セル情報を表示（長押し時）
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    showCellInfo(x, y) {
        const cellType = this.getCell(x, y);
        let info = `セル座標: ${String.fromCharCode(65 + x)}${y + 1}`;
        
        switch (cellType) {
            case 0:
                info += '（空）';
                break;
            case 1:
                info += '（壁）';
                break;
            case 2:
                info += '（オーブ）';
                break;
            case 3:
                info += '（クリスタル）';
                break;
            case 4:
                info += '（ポータル）';
                break;
            case 5:
                info += '（動く壁）';
                break;
            case 6:
                info += '（スイッチ）';
                break;
            default:
                info += '（不明）';
        }
        
        // ステータスメッセージに表示
        document.getElementById('status-message').textContent = info;
        
        // 2秒後に消す
        setTimeout(() => {
            document.getElementById('status-message').textContent = '';
        }, 2000);
        
        console.log(`Cell info displayed for (${x}, ${y}): ${info}`);
    }
    
    /**
     * パスを検索（A*アルゴリズム）
     * @param {number} startX - 開始X座標
     * @param {number} startY - 開始Y座標
     * @param {number} goalX - 目標X座標
     * @param {number} goalY - 目標Y座標
     * @returns {Array} パス座標の配列
     */
    findPath(startX, startY, goalX, goalY) {
        console.log(`Finding path from (${startX}, ${startY}) to (${goalX}, ${goalY})`);
        
        // 目標セルが壁または範囲外の場合
        if (this.getCell(goalX, goalY) === 1 || this.getCell(goalX, goalY) === -1) {
            console.log('Goal is a wall or out of bounds');
            return null;
        }
        
        // オープンリスト（評価対象）
        const openList = [];
        
        // クローズドリスト（評価済み）
        const closedList = [];
        
        // 開始ノードを追加
        openList.push({
            x: startX,
            y: startY,
            g: 0, // 開始点からのコスト
            h: this.heuristic(startX, startY, goalX, goalY), // 推定コスト
            f: this.heuristic(startX, startY, goalX, goalY), // 総コスト
            parent: null // 親ノード
        });
        
        // オープンリストが空になるまで探索
        while (openList.length > 0) {
            // F値が最小のノードを選択
            let currentIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[currentIndex].f) {
                    currentIndex = i;
                }
            }
            
            // 現在のノード
            const currentNode = openList[currentIndex];
            
            // 目標に到達したかチェック
            if (currentNode.x === goalX && currentNode.y === goalY) {
                // パスを再構築
                const path = [];
                let current = currentNode;
                
                while (current) {
                    path.unshift({ x: current.x, y: current.y });
                    current = current.parent;
                }
                
                console.log(`Path found with ${path.length} steps`);
                
                // 開始点を除外（すでにいる場所）
                path.shift();
                
                return path;
            }
            
            // 現在のノードをオープンリストから削除
            openList.splice(currentIndex, 1);
            
            // クローズドリストに追加
            closedList.push(currentNode);
            
            // 隣接ノードをチェック（上下左右）
            const directions = [
                { dx: 0, dy: -1 }, // 上
                { dx: 1, dy: 0 },  // 右
                { dx: 0, dy: 1 },  // 下
                { dx: -1, dy: 0 }  // 左
            ];
            
            for (const dir of directions) {
                const neighborX = currentNode.x + dir.dx;
                const neighborY = currentNode.y + dir.dy;
                
                // 範囲外または壁の場合はスキップ
                if (
                    this.getCell(neighborX, neighborY) === -1 || // 範囲外
                    this.getCell(neighborX, neighborY) === 1     // 壁
                ) {
                    continue;
                }
                
                // 隣接ノード
                const neighbor = {
                    x: neighborX,
                    y: neighborY,
                    g: currentNode.g + 1, // コスト+1
                    h: this.heuristic(neighborX, neighborY, goalX, goalY),
                    f: 0, // 後で計算
                    parent: currentNode
                };
                
                // F値の計算
                neighbor.f = neighbor.g + neighbor.h;
                
                // クローズドリストにあるかチェック
                let skipNeighbor = false;
                for (const closedNode of closedList) {
                    if (closedNode.x === neighbor.x && closedNode.y === neighbor.y) {
                        skipNeighbor = true;
                        break;
                    }
                }
                
                if (skipNeighbor) {
                    continue;
                }
                
                // オープンリストにあるかチェック
                let inOpenList = false;
                for (let i = 0; i < openList.length; i++) {
                    if (openList[i].x === neighbor.x && openList[i].y === neighbor.y) {
                        // すでにあるノードの方がG値が小さい場合はスキップ
                        if (openList[i].g <= neighbor.g) {
                            inOpenList = true;
                            break;
                        }
                        
                        // そうでなければ、既存のノードを更新
                        openList[i] = neighbor;
                        inOpenList = true;
                        break;
                    }
                }
                
                // オープンリストになければ追加
                if (!inOpenList) {
                    openList.push(neighbor);
                }
            }
        }
        
        // パスが見つからなかった
        console.log('No path found');
        return null;
    }
    
    /**
     * ヒューリスティック関数（マンハッタン距離）
     * @param {number} x1 - 開始X座標
     * @param {number} y1 - 開始Y座標
     * @param {number} x2 - 目標X座標
     * @param {number} y2 - 目標Y座標
     * @returns {number} 推定コスト
     */
    heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}
