/**
 * SoundManager オブジェクト
 * ゲーム内のサウンドエフェクトと音楽を管理します
 */
const SoundManager = {
    // 音量設定（0.0～1.0）
    volume: 0.8,
    
    // サウンドが有効かどうか
    enabled: true,
    
    // オーディオコンテキスト
    audioContext: null,
    
    // サウンドエフェクトキャッシュ
    soundCache: {},
    
    // BGM要素
    bgmElement: null,
    
    /**
     * サウンドマネージャの初期化
     * @param {number} initialVolume - 初期音量（0.0～1.0）
     */
    init: function(initialVolume = 0.8) {
        console.log('Initializing sound manager...');
        
        // 音量を設定
        this.volume = initialVolume;
        
        // AudioContextの作成
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            console.log('Audio context created');
        } catch (e) {
            console.warn('Web Audio API is not supported in this browser');
            this.enabled = false;
        }
        
        // BGM要素の作成
        this.bgmElement = document.createElement('audio');
        this.bgmElement.loop = true;
        this.bgmElement.volume = this.volume;
        document.body.appendChild(this.bgmElement);
        
        // サウンドを事前生成
        this.generateSoundEffects();
        
        console.log('Sound manager initialized');
    },
    
    /**
     * サウンドエフェクトを再生
     * @param {string} soundType - サウンドの種類
     */
    playSound: function(soundType) {
        // サウンドが無効の場合は何もしない
        if (!this.enabled) {
            return;
        }
        
        // AudioContextが一時停止していれば再開
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        console.log(`Playing sound: ${soundType}`);
        
        // サウンドタイプに応じて異なる効果音を再生
        switch (soundType) {
            case 'move':
                this.playTone(600, 0.1, 'square');
                break;
                
            case 'collect':
                this.playTone(800, 0.2, 'sine');
                break;
                
            case 'place':
                this.playTone(1000, 0.2, 'sine');
                break;
                
            case 'success':
                this.playSequence([500, 600, 800], 0.15, 'sine');
                break;
                
            case 'fail':
                this.playTone(300, 0.2, 'sawtooth');
                break;
                
            case 'reset':
                this.playTone(400, 0.1, 'sine');
                break;
                
            case 'hint':
                this.playTone(700, 0.1, 'square');
                break;
                
            case 'undo':
                this.playTone(500, 0.1, 'triangle');
                break;
                
            default:
                console.warn(`Unknown sound type: ${soundType}`);
        }
    },
    
    /**
     * サウンドエフェクトを事前生成
     */
    generateSoundEffects: function() {
        if (!this.audioContext) {
            return;
        }
        
        // 各サウンドタイプの波形データを生成
        console.log('Generating sound effects...');
    },
    
    /**
     * 単一の音を鳴らす
     * @param {number} frequency - 周波数（Hz）
     * @param {number} duration - 持続時間（秒）
     * @param {string} type - 波形タイプ（sine, square, sawtooth, triangle）
     */
    playTone: function(frequency, duration, type = 'sine') {
        if (!this.audioContext) {
            return;
        }
        
        // オシレータ（発振器）を作成
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        // ゲイン（音量）ノードを作成
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.volume;
        
        // フェードアウト効果
        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        // ノードを接続
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 音を鳴らす
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    },
    
    /**
     * 音のシーケンスを鳴らす
     * @param {Array} frequencies - 周波数の配列（Hz）
     * @param {number} duration - 各音の持続時間（秒）
     * @param {string} type - 波形タイプ
     */
    playSequence: function(frequencies, duration, type = 'sine') {
        if (!this.audioContext || !frequencies.length) {
            return;
        }
        
        // 各音を順番に鳴らす
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, duration, type);
            }, index * duration * 1000);
        });
    },
    
    /**
     * BGMを再生
     * @param {string} url - BGMのURL
     */
    playBGM: function(url) {
        if (!this.bgmElement) {
            return;
        }
        
        // BGMのソースを設定
        this.bgmElement.src = url;
        this.bgmElement.volume = this.volume * 0.5; // BGMは効果音より小さめに
        
        // 再生
        this.bgmElement.play().catch(e => {
            console.warn('BGM playback failed:', e);
        });
        
        console.log(`Playing BGM: ${url}`);
    },
    
    /**
     * BGMを停止
     */
    stopBGM: function() {
        if (this.bgmElement) {
            this.bgmElement.pause();
            this.bgmElement.currentTime = 0;
        }
    },
    
    /**
     * 音量を設定
     * @param {number} value - 音量（0.0～1.0）
     */
    setVolume: function(value) {
        this.volume = Math.min(Math.max(value, 0), 1);
        
        // BGMの音量を更新
        if (this.bgmElement) {
            this.bgmElement.volume = this.volume * 0.5;
        }
        
        console.log(`Volume set to ${this.volume}`);
    },
    
    /**
     * サウンドの有効/無効を切り替え
     * @param {boolean} isEnabled - 有効にするかどうか
     */
    setEnabled: function(isEnabled) {
        this.enabled = isEnabled;
        
        // BGMも同時に制御
        if (this.bgmElement) {
            if (isEnabled) {
                this.bgmElement.play().catch(() => {});
            } else {
                this.bgmElement.pause();
            }
        }
        
        console.log(`Sound ${isEnabled ? 'enabled' : 'disabled'}`);
    }
};
