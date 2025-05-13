/**
 * Player クラス
 * プレイヤー（オーブ）の状態と動作を管理します
 */
class Player {
    /**
     * プレイヤーの初期化
     * @param {Object} position - プレイヤーの初期位置 {x, y}
     */
    constructor(position) {
        // プレイヤーの位置
        this.position = { x: position.x, y: position.y };
        
        // クリスタルを持っているかどうか
        this.hasCollectedCrystal = false;
        
        console.log(`Player initialized at position (${position.x}, ${position.y})`);
    }
    
    /**
     * プレイヤーを指定位置に移動
     * @param {number} x - 移動先のX座標
     * @param {number} y - 移動先のY座標
     */
    moveTo(x, y) {
        // 以前の位置
        const prevX = this.position.x;
        const prevY = this.position.y;
        
        // 新しい位置を設定
        this.position.x = x;
        this.position.y = y;
        
        // グリッドを更新（以前の位置を空に、新しい位置にオーブを配置）
        const grid = StarForge.game.grid;
        grid.removeItem(prevX, prevY);
        grid.placeItem(x, y, 2);
        
        // 移動エフェクト（光の軌跡など）はvisual.jsで実装
        VisualEffects.showMoveEffect(prevX, prevY, x, y);
        
        console.log(`Player moved from (${prevX}, ${prevY}) to (${x}, ${y})`);
    }
    
    /**
     * プレイヤーの位置を直接設定（リセット時など）
     * @param {Object} position - 新しい位置 {x, y}
     */
    setPosition(position) {
        // 以前の位置
        const prevX = this.position.x;
        const prevY = this.position.y;
        
        // 新しい位置を設定
        this.position.x = position.x;
        this.position.y = position.y;
        
        // グリッドを更新
        const grid = StarForge.game.grid;
        
        // 以前の位置が有効なら空にする
        if (prevX >= 0 && prevX < grid.size && prevY >= 0 && prevY < grid.size) {
            grid.removeItem(prevX, prevY);
        }
        
        // 新しい位置にオーブを配置
        grid.placeItem(position.x, position.y, 2);
        
        console.log(`Player position set to (${position.x}, ${position.y})`);
    }
    
    /**
     * クリスタルを収集
     */
    collectCrystal() {
        // クリスタルを持っている状態に設定
        this.hasCollectedCrystal = true;
        
        // オーブの見た目を更新（クリスタルを持っている状態）
        this.updateOrbAppearance();
        
        console.log('Player collected a crystal');
    }
    
    /**
     * クリスタルをポータルに配置
     */
    placeCrystal() {
        // クリスタルを持っていない状態に設定
        this.hasCollectedCrystal = false;
        
        // オーブの見た目を更新（クリスタルを持っていない状態）
        this.updateOrbAppearance();
        
        console.log('Player placed a crystal at portal');
    }
    
    /**
     * オーブの見た目を更新
     */
    updateOrbAppearance() {
        const x = this.position.x;
        const y = this.position.y;
        const grid = StarForge.game.grid;
        
        // セル要素を取得
        const cellElement = grid.cellElements[y][x];
        
        // オーブ要素を取得
        const orbElement = cellElement.querySelector('.orb');
        
        if (orbElement) {
            // クリスタルを持っているかどうかのクラスを切り替え
            if (this.hasCollectedCrystal) {
                orbElement.classList.add('has-crystal');
            } else {
                orbElement.classList.remove('has-crystal');
            }
        }
    }
}
