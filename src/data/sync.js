/**
 * SyncManager オブジェクト
 * サーバーとのデータ同期を担当します
 */
const SyncManager = {
    // サーバーAPIのベースURL
    API_BASE_URL: 'https://apl.chotto.news/games/StarForge-Touch/api',
    
    // ユーザーID（匿名ID）
    userId: null,
    
    // 同期中かどうか
    isSyncing: false,
    
    // 最後の同期時間
    lastSyncTime: null,
    
    /**
     * 同期マネージャーの初期化
     */
    init: function() {
        console.log('Initializing sync manager...');
        
        // ユーザーIDを読み込む（なければ生成）
        this.loadOrCreateUserId();
        
        // オフライン状態の監視
        window.addEventListener('online', this.handleOnlineStatus.bind(this));
        window.addEventListener('offline', this.handleOfflineStatus.bind(this));
        
        console.log(`Sync manager initialized with user ID: ${this.userId}`);
    },
    
    /**
     * ユーザーIDの読み込みまたは生成
     */
    loadOrCreateUserId: function() {
        // ローカルストレージからユーザーIDを読み込む
        this.userId = localStorage.getItem('starforge_touch_user_id');
        
        // ユーザーIDがなければ生成
        if (!this.userId) {
            this.userId = this.generateUUID();
            localStorage.setItem('starforge_touch_user_id', this.userId);
            console.log(`New user ID generated: ${this.userId}`);
        }
    },
    
    /**
     * UUIDを生成（ユーザーID用）
     * @returns {string} UUID
     */
    generateUUID: function() {
        // 簡易UUID生成
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    /**
     * オンラインになった時の処理
     */
    handleOnlineStatus: function() {
        console.log('Device is online, attempting to sync pending data...');
        this.syncPendingData();
    },
    
    /**
     * オフラインになった時の処理
     */
    handleOfflineStatus: function() {
        console.log('Device is offline, sync operations paused');
        this.isSyncing = false;
    },
    
    /**
     * ユーザーデータの同期
     * @param {Object} userData - 同期するユーザーデータ
     */
    syncUserData: function(userData) {
        // オフラインの場合は保留
        if (!navigator.onLine) {
            console.log('Device is offline, saving user data for later sync');
            this.savePendingData(userData);
            return Promise.resolve({ success: false, message: 'Offline' });
        }
        
        console.log('Syncing user data with server...');
        
        // 同期中フラグを設定
        this.isSyncing = true;
        
        // 現在の日時を設定
        userData.last_sync = new Date().toISOString();
        
        // 開発段階では本当の同期をシミュレート
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('User data sync simulated (development mode)');
                this.isSyncing = false;
                this.lastSyncTime = new Date();
                resolve({ success: true, message: 'Sync completed' });
            }, 500);
        });
        
        // 実際のサーバー同期（本番環境）
        /*
        return fetch(`${this.API_BASE_URL}/users/${this.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('User data synced successfully:', data);
            this.isSyncing = false;
            this.lastSyncTime = new Date();
            return { success: true, data };
        })
        .catch(error => {
            console.error('Error syncing user data:', error);
            this.isSyncing = false;
            this.savePendingData(userData);
            return { success: false, error: error.message };
        });
        */
    },
    
    /**
     * ステージデータの取得
     * @param {string} stageId - ステージID
     * @returns {Promise} ステージデータのPromise
     */
    fetchStageData: function(stageId) {
        console.log(`Fetching stage data for stage ${stageId}...`);
        
        // 開発段階ではダミーデータを返す
        return new Promise((resolve) => {
            setTimeout(() => {
                const dummyStage = {
                    id: stageId,
                    size: parseInt(stageId.charAt(0)),
                    moveLimit: 10,
                    minMoves: 6,
                    cells: []
                };
                
                console.log('Stage data fetched (dummy data)');
                resolve({ success: true, stage: dummyStage });
            }, 300);
        });
        
        // 実際のサーバー取得（本番環境）
        /*
        return fetch(`${this.API_BASE_URL}/stages/${stageId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Stage data fetched successfully');
                return { success: true, stage: data };
            })
            .catch(error => {
                console.error('Error fetching stage data:', error);
                return { success: false, error: error.message };
            });
        */
    },
    
    /**
     * ランキングデータの取得
     * @param {string} stageId - ステージID
     * @returns {Promise} ランキングデータのPromise
     */
    fetchRanking: function(stageId) {
        console.log(`Fetching ranking data for stage ${stageId}...`);
        
        // 開発段階ではダミーデータを返す
        return new Promise((resolve) => {
            setTimeout(() => {
                const dummyRanking = {
                    stageId: stageId,
                    rankings: [
                        { user_id: 'user1', moves: 5, time: 15.2 },
                        { user_id: 'user2', moves: 6, time: 12.8 },
                        { user_id: 'user3', moves: 7, time: 10.5 }
                    ]
                };
                
                console.log('Ranking data fetched (dummy data)');
                resolve({ success: true, ranking: dummyRanking });
            }, 300);
        });
    },
    
    /**
     * 保留中のデータを保存
     * @param {Object} data - 保存するデータ
     */
    savePendingData: function(data) {
        console.log('Saving pending data for later sync...');
        
        try {
            // 保留中データをローカルストレージに保存
            localStorage.setItem('starforge_touch_pending_sync', JSON.stringify(data));
            console.log('Pending data saved');
        } catch (error) {
            console.error('Error saving pending data:', error);
        }
    },
    
    /**
     * 保留中のデータを同期
     */
    syncPendingData: function() {
        console.log('Checking for pending data to sync...');
        
        try {
            // 保留中データを読み込む
            const pendingData = localStorage.getItem('starforge_touch_pending_sync');
            
            if (!pendingData) {
                console.log('No pending data to sync');
                return;
            }
            
            const data = JSON.parse(pendingData);
            
            // データを同期
            this.syncUserData(data)
                .then(result => {
                    if (result.success) {
                        // 同期成功したら保留データを削除
                        localStorage.removeItem('starforge_touch_pending_sync');
                        console.log('Pending data synced and cleared');
                    }
                });
        } catch (error) {
            console.error('Error syncing pending data:', error);
        }
    },
    
    /**
     * 最適手数を取得
     * @param {string} stageId - ステージID
     * @returns {Promise} 最適手数データのPromise
     */
    fetchMinimumMoves: function(stageId) {
        console.log(`Fetching minimum moves for stage ${stageId}...`);
        
        // 開発段階ではダミーデータを返す
        return new Promise((resolve) => {
            setTimeout(() => {
                const minMoves = Math.floor(Math.random() * 5) + 5;
                
                console.log(`Minimum moves fetched (dummy): ${minMoves}`);
                resolve({ success: true, minMoves: minMoves });
            }, 200);
        });
    }
};
