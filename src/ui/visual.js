/**
 * VisualEffects オブジェクト
 * ゲーム内の視覚効果を管理します
 */
const VisualEffects = {
    /**
     * 移動エフェクトを表示
     * @param {number} fromX - 開始X座標
     * @param {number} fromY - 開始Y座標
     * @param {number} toX - 終了X座標
     * @param {number} toY - 終了Y座標
     */
    showMoveEffect: function(fromX, fromY, toX, toY) {
        console.log(`Showing move effect from (${fromX}, ${fromY}) to (${toX}, ${toY})`);
        
        // セル要素を取得
        const grid = StarForge.game.grid;
        const fromCell = grid.cellElements[fromY][fromX];
        const toCell = grid.cellElements[toY][toX];
        
        // 移動経路を計算
        const path = grid.findPath(fromX, fromY, toX, toY);
        
        // パスがなければ何もしない
        if (!path || path.length === 0) {
            return;
        }
        
        // 移動エフェクト（光の軌跡）
        const trail = document.createElement('div');
        trail.className = 'move-trail';
        
        // エフェクト要素をDOMに追加
        document.getElementById('grid-container').appendChild(trail);
        
        // 各ステップでアニメーション
        let stepIndex = 0;
        const animateStep = () => {
            if (stepIndex < path.length) {
                const currentPos = path[stepIndex];
                
                // 現在のセル位置を取得
                const currentCell = grid.cellElements[currentPos.y][currentPos.x];
                
                // エフェクトをセルに配置
                const rect = currentCell.getBoundingClientRect();
                const parentRect = currentCell.parentElement.getBoundingClientRect();
                
                trail.style.left = (rect.left - parentRect.left) + 'px';
                trail.style.top = (rect.top - parentRect.top) + 'px';
                trail.style.width = rect.width + 'px';
                trail.style.height = rect.height + 'px';
                trail.style.opacity = '0.8';
                
                stepIndex++;
                setTimeout(animateStep, 100);
            } else {
                // アニメーション終了後にエフェクトを削除
                setTimeout(() => {
                    trail.remove();
                }, 300);
            }
        };
        
        // アニメーション開始
        animateStep();
    },
    
    /**
     * クリスタル収集エフェクトを表示
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    showCollectEffect: function(x, y) {
        console.log(`Showing crystal collect effect at (${x}, ${y})`);
        
        // セル要素を取得
        const grid = StarForge.game.grid;
        const cell = grid.cellElements[y][x];
        
        // 粒子エフェクト要素
        const particles = document.createElement('div');
        particles.className = 'collect-particles';
        
        // セルにエフェクト要素を追加
        cell.appendChild(particles);
        
        // 個別粒子を作成
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 粒子の位置とサイズをランダムに
            const angle = Math.random() * Math.PI * 2;
            const distance = 10 + Math.random() * 20;
            const size = 3 + Math.random() * 3;
            
            particle.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
            particle.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // アニメーション時間を少しずらす
            particle.style.animationDelay = `${Math.random() * 0.2}s`;
            
            particles.appendChild(particle);
        }
        
        // アニメーション終了後にエフェクトを削除
        setTimeout(() => {
            particles.remove();
        }, 1000);
    },
    
    /**
     * クリスタル配置エフェクトを表示
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    showPlaceEffect: function(x, y) {
        console.log(`Showing crystal place effect at (${x}, ${y})`);
        
        // セル要素を取得
        const grid = StarForge.game.grid;
        const cell = grid.cellElements[y][x];
        
        // ポータルエフェクト
        const portalEffect = document.createElement('div');
        portalEffect.className = 'portal-effect';
        
        // セルにエフェクト要素を追加
        cell.appendChild(portalEffect);
        
        // 波紋エフェクト
        for (let i = 0; i < 3; i++) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.animationDelay = `${i * 0.2}s`;
            portalEffect.appendChild(ripple);
        }
        
        // アニメーション終了後にエフェクトを削除
        setTimeout(() => {
            portalEffect.remove();
        }, 1500);
    },
    
    /**
     * ステージクリアエフェクトを表示
     */
    showClearEffect: function() {
        console.log('Showing stage clear effect');
        
        // グリッドコンテナを取得
        const container = document.getElementById('grid-container');
        
        // クリアエフェクト要素
        const clearEffect = document.createElement('div');
        clearEffect.className = 'clear-effect';
        
        // コンテナにエフェクト要素を追加
        container.appendChild(clearEffect);
        
        // 星エフェクト
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 星の位置とサイズをランダムに
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const size = 3 + Math.random() * 5;
            const delay = Math.random() * 0.5;
            
            star.style.left = `${posX}%`;
            star.style.top = `${posY}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            
            clearEffect.appendChild(star);
        }
        
        // テキストエフェクト
        const clearText = document.createElement('div');
        clearText.className = 'clear-text';
        clearText.textContent = 'STAGE CLEAR!';
        clearEffect.appendChild(clearText);
        
        // アニメーション終了後にエフェクトを削除
        setTimeout(() => {
            clearEffect.remove();
        }, 3000);
    },
    
    /**
     * 失敗エフェクトを表示
     */
    showFailEffect: function() {
        console.log('Showing fail effect');
        
        // グリッドコンテナを取得
        const container = document.getElementById('grid-container');
        
        // 失敗エフェクト
        container.classList.add('shake');
        
        // グリッドを赤く点滅
        container.classList.add('fail-flash');
        
        // エフェクト終了後にクラスを削除
        setTimeout(() => {
            container.classList.remove('shake');
            container.classList.remove('fail-flash');
        }, 500);
    },
    
    /**
     * ヒントエフェクトを表示
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    showHintEffect: function(x, y) {
        console.log(`Showing hint effect at (${x}, ${y})`);
        
        // セル要素を取得
        const grid = StarForge.game.grid;
        const cell = grid.cellElements[y][x];
        
        // ヒントエフェクト
        const hintEffect = document.createElement('div');
        hintEffect.className = 'hint-effect';
        
        // セルにエフェクト要素を追加
        cell.appendChild(hintEffect);
        
        // 点滅アニメーション
        let opacity = 1;
        let direction = -1;
        const blink = setInterval(() => {
            opacity += direction * 0.1;
            if (opacity <= 0.3) direction = 1;
            if (opacity >= 1) direction = -1;
            hintEffect.style.opacity = opacity;
        }, 50);
        
        // アニメーション終了後にエフェクトを削除
        setTimeout(() => {
            clearInterval(blink);
            hintEffect.remove();
        }, 2000);
    },
    
    /**
     * スターダスト獲得エフェクトを表示
     * @param {number} amount - 獲得したスターダスト量
     */
    showStardustEffect: function(amount) {
        console.log(`Showing stardust gain effect: +${amount}`);
        
        // ステータスメッセージ要素を取得
        const statusMessage = document.getElementById('status-message');
        
        // スターダストエフェクト要素
        const stardustEffect = document.createElement('div');
        stardustEffect.className = 'stardust-effect';
        stardustEffect.textContent = `+${amount}`;
        
        // ステータスメッセージの上に表示
        statusMessage.parentNode.insertBefore(stardustEffect, statusMessage);
        
        // アニメーション終了後にエフェクトを削除
        setTimeout(() => {
            stardustEffect.remove();
        }, 2000);
    }
};
