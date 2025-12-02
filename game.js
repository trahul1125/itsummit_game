class AIHunterGame {
    constructor() {
        this.user = { name: '', organization: '' };
        this.language = 'en';
        this.gameStartTime = null;
        this.gameTimeLimit = 600000; // 10 minutes
        this.userStats = { totalCaptured: 0, totalModels: 15 };
        
        this.aiModels = [
            { name: 'Context Engineering', emoji: '🎯', caught: false, rarity: 'legendary', info: { en: 'Context Engineering is the art of crafting precise prompts and context to guide AI models toward desired outputs and behaviors.', ja: 'コンテキストエンジニアリングは、AIモデルを望ましい出力と動作に導くための正確なプロンプトとコンテキストを作成する技術です。' } },
            { name: 'Toon', emoji: '📋', caught: false, rarity: 'epic', info: { en: 'Token Oriented Object Notation (TOON) is a structured data format optimized for AI model communication and data exchange.', ja: 'Token Oriented Object Notation (TOON)は、AIモデルの通信とデータ交換に最適化された構造化データフォーマットです。' } },
            { name: 'LSTM', emoji: '🔗', caught: false, rarity: 'rare', info: { en: 'Long Short-Term Memory networks are specialized neural networks designed to remember information for long periods in sequence processing.', ja: 'LSTM（Long Short-Term Memory）は、シーケンス処理において長期間情報を記憶するように設計された特殊なニューラルネットワークです。' } },
            { name: 'SLM', emoji: '📱', caught: false, rarity: 'epic', info: { en: 'Small Language Models are compact AI models optimized for efficiency while maintaining strong performance on specific tasks.', ja: 'SLM（Small Language Model）は、特定のタスクで強力な性能を維持しながら効率性を最適化したコンパクトなAIモデルです。' } },
            { name: 'Foundation Model', emoji: '🏗️', caught: false, rarity: 'legendary', info: { en: 'Foundation Models are large-scale pre-trained models that serve as the base for various AI applications and fine-tuning.', ja: 'ファウンデーションモデルは、様々なAIアプリケーションとファインチューニングのベースとなる大規模な事前訓練済みモデルです。' } },
            { name: 'Token', emoji: '🎫', caught: false, rarity: 'common', info: { en: 'Tokens are the basic units of text that AI models process, representing words, subwords, or characters in natural language.', ja: 'トークンは、AIモデルが処理するテキストの基本単位で、自然言語における単語、部分語、または文字を表します。' } },
            { name: 'Agentic AI', emoji: '🤖', caught: false, rarity: 'legendary', info: { en: 'Agentic AI refers to autonomous AI systems that can take independent actions and make decisions to achieve specific goals.', ja: 'エージェンティックAIは、特定の目標を達成するために独立した行動を取り、決定を下すことができる自律的なAIシステムを指します。' } },
            { name: 'Edge Computing', emoji: '⚡', caught: false, rarity: 'epic', info: { en: 'Edge Computing brings computation and data storage closer to data sources, reducing latency and improving real-time processing.', ja: 'エッジコンピューティングは、計算とデータストレージをデータソースに近づけ、遅延を減らしリアルタイム処理を改善します。' } },
            { name: 'Quantum Computing', emoji: '⚛️', caught: false, rarity: 'legendary', info: { en: 'Quantum Computing uses quantum mechanical phenomena to process information in ways that could revolutionize computation.', ja: '量子コンピューティングは、量子力学的現象を使用して、計算に革命をもたらす可能性のある方法で情報を処理します。' } },
            { name: 'WiFi 6', emoji: '📶', caught: false, rarity: 'rare', info: { en: 'WiFi 6 is the latest wireless standard offering faster speeds, lower latency, and better performance in crowded environments.', ja: 'WiFi 6は、より高速な速度、低遅延、混雑した環境でのより良いパフォーマンスを提供する最新のワイヤレス標準です。' } },
            { name: 'Neural Architecture Search', emoji: '🔍', caught: false, rarity: 'epic', info: { en: 'Neural Architecture Search automates the design of neural network architectures using AI to find optimal model structures.', ja: 'ニューラルアーキテクチャサーチは、AIを使用してニューラルネットワークアーキテクチャの設計を自動化し、最適なモデル構造を見つけます。' } },
            { name: 'Federated Learning', emoji: '🌐', caught: false, rarity: 'rare', info: { en: 'Federated Learning enables machine learning across decentralized data without centralizing sensitive information.', ja: 'フェデレーテッドラーニングは、機密情報を集中化することなく、分散データ間での機械学習を可能にします。' } },
            { name: 'Multimodal AI', emoji: '🎭', caught: false, rarity: 'epic', info: { en: 'Multimodal AI processes and understands multiple types of data simultaneously, including text, images, audio, and video.', ja: 'マルチモーダルAIは、テキスト、画像、音声、動画を含む複数のタイプのデータを同時に処理し理解します。' } },
            { name: 'Reinforcement Learning', emoji: '🎮', caught: false, rarity: 'rare', info: { en: 'Reinforcement Learning trains AI agents through trial and error, learning optimal actions through rewards and penalties.', ja: '強化学習は、試行錯誤を通じてAIエージェントを訓練し、報酬と罰を通じて最適な行動を学習します。' } },
            { name: 'Transformer Architecture', emoji: '🔄', caught: false, rarity: 'legendary', info: { en: 'Transformer Architecture revolutionized AI with attention mechanisms, becoming the foundation for modern language models.', ja: 'トランスフォーマーアーキテクチャは、アテンション機構でAIに革命をもたらし、現代の言語モデルの基盤となりました。' } }
        ];
        
        this.currentAI = null;
        this.cameraStream = null;
        this.canvas = null;
        this.ctx = null;
        
        this.heading = 0;
        this.pitch = 0;
        
        this.aiAngle = 0;
        this.aiPitch = 0;
        this.aiDistance = 0;
        
        this.stepCount = 0;
        this.lastStepTime = 0;
        this.minMovementDistance = 1;
        this.distanceTraveled = 0;
        this.waitingForMovement = false;
        this.lastCapturedAI = null;
        this.movementBuffer = [];
        this.walkingSteps = [];
        
        this.aiVisible = false;
        this.aiInFrame = false;
        
        this.frameCenter = { x: 0, y: 0 };
        this.frameRadius = 50; // Much smaller for precision
        
        this.spawnTimer = null;
        this.animationId = null;
        
        this.initialBeta = null;
        this.initialGamma = null;
        this.motionSupported = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateInventory();
        this.updateProgress();
        this.updateUserStats();
        this.updateLanguage();
        this.showLanguagePrompt();
    }
    


    setupEventListeners() {
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.language = e.target.value;
            this.updateLanguage();
        });
        
        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startGame();
        });

        document.getElementById('capture-btn').addEventListener('click', () => {
            this.captureAI();
        });

        document.getElementById('inventory-btn').addEventListener('click', () => {
            this.showInventory();
        });

        document.getElementById('back-to-game').addEventListener('click', () => {
            this.showGame();
        });

        document.getElementById('continue-btn').addEventListener('click', () => {
            this.hideModal('success-modal');
            this.showAIInfo();
        });

        document.getElementById('finish-game-btn').addEventListener('click', async (e) => {
            const btn = e.target;
            if (btn.disabled) return; // Prevent multiple clicks
            
            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = this.language === 'ja' ? '保存中...' : 'SAVING...';
            btn.style.opacity = '0.7';
            
            const gameTime = Date.now() - this.gameStartTime;
            await this.saveToJsonBin(gameTime);
            
            btn.textContent = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
            
            this.showSaveConfirmation();
        });




    }

    async startGame() {
        this.user.name = document.getElementById('name').value;
        this.user.organization = document.getElementById('organization').value;
        this.gameStartTime = Date.now();
        this.userStats.totalModels = this.aiModels.length;

        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            
            const video = document.getElementById('camera-feed');
            video.srcObject = this.cameraStream;
            
            await new Promise(resolve => {
                video.onloadedmetadata = resolve;
            });
            
            this.canvas = document.getElementById('ar-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            window.addEventListener('resize', () => this.resizeCanvas());
            
            this.frameCenter = {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2
            };

            this.showPage('game-page');
            this.setupMotionTracking();
            this.startGameLoop();
            this.spawnNextAI();
            
        } catch (error) {
            console.error('Camera error:', error);
            let errorMessage = '';
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Camera permission denied. Please:\n1. Allow camera access\n2. Try incognito/private mode\n3. Use HTTPS or localhost';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera found. Please connect a camera.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage = 'Camera not supported. Try:\n1. Using Chrome/Safari\n2. HTTPS connection\n3. Incognito mode';
            } else {
                errorMessage = 'Camera error: ' + error.message + '\n\nTry:\n1. Incognito/private mode\n2. HTTPS or localhost\n3. Different browser';
            }
            alert(errorMessage);
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.frameCenter = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
    }

    setupMotionTracking() {
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                this.showCalibrationHint();
            } else {
                this.enableMotion();
            }
        } else {
            this.fallbackToTouch();
        }
    }

    enableMotion() {
        let initialAlpha = null;
        let initialBeta = null;
        let calibrated = false;
        
        if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
            this.showCalibrationHint();
        }
        
        const handleOrientation = (e) => {
            if (e.alpha !== null && e.beta !== null) {
                this.motionSupported = true;
                
                if (!calibrated) {
                    initialAlpha = e.alpha || 0;
                    initialBeta = e.beta || 0;
                    calibrated = true;
                    this.hideCalibrationHint();
                    return;
                }
                
                let alphaOffset = (e.alpha || 0) - initialAlpha;
                if (alphaOffset > 180) alphaOffset -= 360;
                if (alphaOffset < -180) alphaOffset += 360;
                
                this.heading = -alphaOffset;
                
                let betaOffset = (e.beta || 0) - initialBeta;
                this.pitch = betaOffset * 0.8;
                
                while (this.heading > 180) this.heading -= 360;
                while (this.heading < -180) this.heading += 360;
                this.pitch = Math.max(-60, Math.min(60, this.pitch));
            }
        };
        
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('deviceorientationabsolute', handleOrientation);
        
        // Balanced step detection - prevents hand waving but allows walking
        if (window.DeviceMotionEvent) {
            let lastAccel = 0;
            let stepCandidates = [];
            
            window.addEventListener('devicemotion', (e) => {
                if (e.acceleration) {
                    const currentTime = Date.now();
                    const yAccel = Math.abs(e.acceleration.y || 0);
                    const totalAccel = Math.sqrt(
                        (e.acceleration.x || 0) ** 2 + 
                        (e.acceleration.y || 0) ** 2 + 
                        (e.acceleration.z || 0) ** 2
                    );
                    
                    this.movementBuffer.push({ 
                        accel: totalAccel, 
                        yAccel: yAccel,
                        time: currentTime 
                    });
                    if (this.movementBuffer.length > 20) this.movementBuffer.shift();
                    
                    // Stricter step detection to prevent phone shaking
                    const timeSinceLastStep = currentTime - this.lastStepTime;
                    const isValidStepTiming = timeSinceLastStep > 800; // Longer interval
                    const isWalkingAcceleration = totalAccel > 8 && totalAccel < 20; // Narrower range
                    const hasVerticalComponent = yAccel > 3; // Higher threshold
                    const isPeakAcceleration = totalAccel > lastAccel;
                    
                    // Check for consistent walking pattern
                    const avgAccel = this.movementBuffer.reduce((sum, m) => sum + m.accel, 0) / this.movementBuffer.length;
                    const isConsistentMovement = Math.abs(totalAccel - avgAccel) < 5;
                    
                    if (isValidStepTiming && isWalkingAcceleration && hasVerticalComponent && isPeakAcceleration && isConsistentMovement) {
                        stepCandidates.push(currentTime);
                        stepCandidates = stepCandidates.filter(time => currentTime - time < 5000);
                        
                        // Require more steps for validation
                        if (stepCandidates.length >= 3) {
                            this.stepCount++;
                            this.lastStepTime = currentTime;
                            
                            if (this.waitingForMovement) {
                                this.distanceTraveled = this.stepCount * 0.7;
                                this.updateDistanceCounter();
                                
                                if (this.distanceTraveled >= this.minMovementDistance) {
                                    this.stepCount = 0;
                                    this.spawnNextAI();
                                }
                            }
                        }
                    }
                    
                    lastAccel = totalAccel;
                }
            });
        }
    }

    fallbackToTouch() {
        console.log('Motion tracking required - no touch fallback');
        
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            z-index: 1000;
            font-family: 'Orbitron', sans-serif;
            font-size: 14px;
        `;
        const motionRequiredText = this.language === 'ja' ? 'デバイスモーションが必要です<br><small>モーション許可を有効にしてください</small>' : 'DEVICE MOTION REQUIRED<br><small>Please enable motion permissions</small>';
        message.innerHTML = motionRequiredText;
        document.body.appendChild(message);
    }

    startGameLoop() {
        const loop = () => {
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }

    update() {
        if (this.currentAI) {
            let angleDiff = this.aiAngle - this.heading;
            while (angleDiff > 180) angleDiff -= 360;
            while (angleDiff < -180) angleDiff += 360;
            
            const pitchDiff = this.aiPitch - this.pitch;
            
            const fovH = 60;
            const fovV = 45;
            
            this.aiVisible = Math.abs(angleDiff) < fovH && Math.abs(pitchDiff) < fovV;
            
            if (this.aiVisible) {
                const screenX = this.frameCenter.x + (angleDiff / fovH) * this.canvas.width * 0.4;
                const screenY = this.frameCenter.y - (pitchDiff / fovV) * this.canvas.height * 0.4;
                
                this.aiScreenPos = { x: screenX, y: screenY };
                
                const dx = screenX - this.frameCenter.x;
                const dy = screenY - this.frameCenter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                this.aiInFrame = distance < this.frameRadius;
            } else {
                this.aiInFrame = false;
            }
            
            this.updateRadar(angleDiff);
            this.updateCaptureButton();
            this.updateTargetIndicator();
        }
        
        if (this.gameStartTime && Date.now() - this.gameStartTime > this.gameTimeLimit) {
            this.gameTimeUp();
        }
    }

    updateRadar(angleDiff) {
        const radarDot = document.getElementById('radar-dot');
        const radarSize = 80;
        const radarCenter = radarSize / 2;
        
        if (this.currentAI) {
            const angleRad = (angleDiff * Math.PI) / 180;
            const distance = Math.min(radarSize * 0.35, radarSize * 0.35);
            
            const dotX = radarCenter + Math.sin(angleRad) * distance;
            const dotY = radarCenter - Math.cos(angleRad) * distance;
            
            radarDot.style.left = dotX + 'px';
            radarDot.style.top = dotY + 'px';
            radarDot.classList.add('active');
        } else {
            radarDot.classList.remove('active');
        }
    }

    updateCaptureButton() {
        const btn = document.getElementById('capture-btn');
        const label = document.getElementById('capture-label');
        const frame = document.getElementById('targeting-frame');
        
        const texts = {
            en: { capture: 'CAPTURE', aimTarget: 'AIM AT TARGET', findTarget: 'FIND TARGET', noTarget: 'NO TARGET' },
            ja: { capture: '捕獲', aimTarget: 'ターゲットを狙う', findTarget: 'ターゲットを探す', noTarget: 'ターゲットなし' }
        };
        const t = texts[this.language];
        
        if (this.aiInFrame && this.aiVisible) {
            btn.disabled = false;
            label.textContent = t.capture;
            label.classList.add('ready');
            frame.classList.add('locked');
        } else {
            btn.disabled = true;
            if (this.currentAI) {
                label.textContent = this.aiVisible ? t.aimTarget : t.findTarget;
            } else {
                label.textContent = t.noTarget;
            }
            label.classList.remove('ready');
            frame.classList.remove('locked');
        }
    }

    updateTargetIndicator() {
        const indicator = document.getElementById('target-indicator');
        const scanIndicator = document.getElementById('scan-indicator');
        
        if (this.currentAI) {
            indicator.classList.remove('hidden');
            document.getElementById('target-name').textContent = this.currentAI.name;
            
            const targetLabel = document.querySelector('.target-label');
            if (this.currentAI.positionHint && !this.aiVisible) {
                targetLabel.textContent = this.currentAI.positionHint;
            } else {
                targetLabel.textContent = this.language === 'ja' ? 'ターゲット検出' : 'TARGET DETECTED';
            }
            
            scanIndicator.classList.add('hidden');
        } else {
            indicator.classList.add('hidden');
            scanIndicator.classList.remove('hidden');
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.currentAI && this.aiVisible && this.aiScreenPos) {
            this.drawAI(this.aiScreenPos.x, this.aiScreenPos.y);
        }
        
        if (this.currentAI && !this.aiVisible) {
            this.drawDirectionIndicator();
        }
    }

    drawDirectionIndicator() {
        let angleDiff = this.aiAngle - this.heading;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        const arrowAngle = (angleDiff * Math.PI) / 180;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        
        const arrowX = this.frameCenter.x + Math.sin(arrowAngle) * radius;
        const arrowY = this.frameCenter.y - Math.cos(arrowAngle) * radius;
        
        this.ctx.save();
        this.ctx.translate(arrowX, arrowY);
        this.ctx.rotate(arrowAngle);
        
        this.ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.shadowBlur = 15;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, -20);
        this.ctx.lineTo(-12, 10);
        this.ctx.lineTo(0, 5);
        this.ctx.lineTo(12, 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawAI(x, y) {
        const time = Date.now() / 1000;
        const floatY = y + Math.sin(time * 2) * 10;
        const scale = 1 + Math.sin(time * 3) * 0.05;
        const size = 80 * scale;
        
        this.ctx.save();
        
        // Draw glow effect
        const gradient = this.ctx.createRadialGradient(x, floatY, 0, x, floatY, size * 1.5);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.2)');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, floatY, size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw solid background circle for icon
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.shadowColor = this.aiInFrame ? '#10b981' : '#00f0ff';
        this.ctx.shadowBlur = this.aiInFrame ? 30 : 20;
        this.ctx.beginPath();
        this.ctx.arc(x, floatY, size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw emoji directly - no image loading
        this.ctx.shadowBlur = 0;
        const emojiMap = {
            'GPT-4': '🤖', 'Claude': '🧠', 'Gemini': '💎', 'LLaMA': '🦙', 'PaLM': '🌴',
            'BERT': '📚', 'T5': '🔄', 'GPT-3': '⚡', 'Mistral': '🌪️', 'Falcon': '🦅',
            'Rufus': '🛍️', 'Copilot': '💻', 'Bard': '🎭', 'ChatGPT': '💬', 'Alexa': '🔊'
        };
        this.ctx.font = `${size * 0.5}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(this.currentAI.emoji, x, floatY);
        
        // Draw name
        this.ctx.font = 'bold 14px Orbitron, sans-serif';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 4;
        this.ctx.strokeText(this.currentAI.name, x, floatY + size + 15);
        this.ctx.fillText(this.currentAI.name, x, floatY + size + 15);
        
        if (this.aiInFrame) {
            this.ctx.strokeStyle = '#10b981';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(x, floatY, size + 10, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        this.ctx.restore();
    }

    spawnNextAI() {
        if (this.waitingForMovement) {
            this.waitingForMovement = false;
            this.hideDistanceCounter();
        }
        
        const uncaught = this.aiModels.filter(ai => !ai.caught);
        if (uncaught.length === 0) {
            this.gameComplete();
            return;
        }
        
        this.spawnAI();
    }

    spawnAI() {
        const uncaught = this.aiModels.filter(ai => !ai.caught);
        if (uncaught.length === 0) return;
        
        this.currentAI = uncaught[Math.floor(Math.random() * uncaught.length)];
        
        // Random positioning
        this.aiAngle = Math.random() * 360 - 180;
        this.aiPitch = (Math.random() - 0.5) * 120;
        this.aiPitch = Math.max(-60, Math.min(60, this.aiPitch));
        
        this.showSpawnNotification();
        this.updateTargetIndicator();
    }

    captureAI() {
        if (!this.aiInFrame || !this.currentAI) return;
        
        const captured = this.currentAI;
        captured.caught = true;
        this.userStats.totalCaptured++;
        this.lastCapturedAI = captured;
        
        const capturedImg = document.getElementById('captured-icon');
        capturedImg.innerHTML = `<div style="font-size: 60px;">${captured.emoji}</div>`;
        
        document.getElementById('capture-message').textContent = 
            this.language === 'ja' ? `${captured.name}をコレクションに追加しました！` : `${captured.name} has been added to your collection!`;
        
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        this.currentAI = null;
        this.aiScreenPos = null;
        
        this.updateProgress();
        this.updateInventory();
        this.updateUserStats();
        
        // Check if game is complete immediately after capture
        const uncaught = this.aiModels.filter(ai => !ai.caught);
        if (uncaught.length === 0) {
            // Game complete - skip normal flow and go straight to completion
            setTimeout(() => {
                this.hideModal('success-modal');
                this.gameComplete();
            }, 2000);
        } else {
            this.showModal('success-modal');
        }
    }
    
    gameComplete() {
        document.getElementById('complete-message').textContent = 
            `Congratulations ${this.user.name}! You've captured all ${this.aiModels.length} AI models!`;
        this.showModal('complete-modal');
    }
    
    async saveToJsonBin(gameTime) {
        try {
            // First get existing data
            const getResponse = await fetch('https://api.jsonbin.io/v3/b/692ddc65d0ea881f400c16ee', {
                headers: {
                    'X-Master-Key': '$2a$10$hl8RiwmuMk16Yo4UDtezcedlmX9w4GFAsPSAn14g1LFhphVHJVnhC'
                }
            });
            
            let existingData = { completions: [] };
            if (getResponse.ok) {
                const result = await getResponse.json();
                existingData = result.record || { completions: [] };
                if (!existingData.completions) existingData.completions = [];
            }
            
            // Add new completion
            const completion = {
                name: this.user.name,
                organization: this.user.organization,
                gameTime: gameTime,
                date: new Date().toISOString(),
                timestamp: Date.now()
            };
            
            existingData.completions.push(completion);
            
            // Save updated data
            const response = await fetch('https://api.jsonbin.io/v3/b/692ddc65d0ea881f400c16ee', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$hl8RiwmuMk16Yo4UDtezcedlmX9w4GFAsPSAn14g1LFhphVHJVnhC'
                },
                body: JSON.stringify(existingData)
            });
            
            if (response.ok) {
                console.log('Completion saved to JSONBin');
            }
        } catch (error) {
            console.log('Save failed:', error);
        }
    }



    updateProgress() {
        const caught = this.aiModels.filter(ai => ai.caught).length;
        const total = this.aiModels.length;
        const percent = (caught / total) * 100;
        
        document.getElementById('caught-count').textContent = caught;
        document.getElementById('total-count').textContent = total;
        document.getElementById('progress-fill').style.width = percent + '%';
        
        document.getElementById('inv-caught').textContent = caught;
        document.getElementById('inv-total').textContent = total;
    }

    updateInventory() {
        const grid = document.getElementById('inventory-grid');
        grid.innerHTML = '';

        this.aiModels.forEach(ai => {
            const item = document.createElement('div');
            item.className = `inventory-item ${ai.caught ? 'caught' : ''}`;
            const emojiMap = {
                'GPT-4': '🤖', 'Claude': '🧠', 'Gemini': '💎', 'LLaMA': '🦙', 'PaLM': '🌴',
                'BERT': '📚', 'T5': '🔄', 'GPT-3': '⚡', 'Mistral': '🌪️', 'Falcon': '🦅',
                'Rufus': '🛍️', 'Copilot': '💻', 'Bard': '🎭', 'ChatGPT': '💬', 'Alexa': '🔊'
            };
            item.innerHTML = `
                <div class="icon" style="font-size: 48px;">${ai.emoji}</div>
                <div class="name">${ai.caught ? ai.name : '???'}</div>
            `;
            grid.appendChild(item);
        });
    }

    showModal(id) {
        document.getElementById(id).classList.add('active');
    }

    hideModal(id) {
        document.getElementById(id).classList.remove('active');
    }

    showInventory() {
        this.updateInventory();
        this.showPage('inventory-page');
    }

    showGame() {
        this.showPage('game-page');
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }
    
    showCalibrationHint() {
        const hint = document.createElement('div');
        hint.id = 'calibration-hint';
        hint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 240, 255, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            z-index: 1000;
            font-family: 'Orbitron', sans-serif;
            font-size: 14px;
            letter-spacing: 2px;
        `;
        
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            const motionText = this.language === 'ja' ? 'モーション許可が必要です' : 'MOTION PERMISSION REQUIRED';
            const enableText = this.language === 'ja' ? 'モーションを有効にする' : 'ENABLE MOTION';
            hint.innerHTML = `
                <div>${motionText}</div>
                <button onclick="this.parentElement.dispatchEvent(new Event('requestMotion'))" 
                       style="margin-top: 10px; padding: 8px 16px; background: white; color: black; border: none; border-radius: 4px; cursor: pointer;">
                    ${enableText}
                </button>
            `;
            
            hint.addEventListener('requestMotion', () => {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            const calibratingText = this.language === 'ja' ? 'デバイスを安定させて<br>キャリブレーション中...' : 'HOLD PHONE STEADY<br>CALIBRATING...';
                            hint.innerHTML = calibratingText;
                            this.enableMotion();
                        } else {
                            const deniedText = this.language === 'ja' ? 'モーション許可が拒否されました<br><small>ゲームにはモーション追跡が必要です</small>' : 'MOTION PERMISSION DENIED<br><small>Game requires motion tracking</small>';
                            hint.innerHTML = deniedText;
                        }
                    })
                    .catch(() => {
                        const failedText = this.language === 'ja' ? 'モーション許可に失敗しました<br><small>ゲームにはモーション追跡が必要です</small>' : 'MOTION PERMISSION FAILED<br><small>Game requires motion tracking</small>';
                        hint.innerHTML = failedText;
                    });
            });
        } else {
            const calibratingText = this.language === 'ja' ? 'デバイスを安定させて<br>キャリブレーション中...' : 'HOLD PHONE STEADY<br>CALIBRATING...';
            hint.innerHTML = calibratingText;
        }
        
        document.body.appendChild(hint);
    }
    
    hideCalibrationHint() {
        const hint = document.getElementById('calibration-hint');
        if (hint) hint.remove();
    }
    
    showSpawnNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid rgba(255, 51, 102, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Orbitron', sans-serif;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
            z-index: 1000;
            animation: slideDown 0.3s ease;
            text-align: center;
            max-width: 280px;
            box-shadow: 0 0 20px rgba(255, 51, 102, 0.5);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        `;
        const targetText = this.language === 'ja' ? 'ターゲット発見' : 'TARGET DETECTED';
        notification.innerHTML = `<div style="color: #ff3366;">🎯 ${targetText}</div><div style="font-size: 11px; color: #00f0ff; margin-top: 4px;">${this.currentAI.name}</div>`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 4000);
    }
    
    startMovementPhase() {
        const uncaught = this.aiModels.filter(ai => !ai.caught);
        if (uncaught.length === 0) {
            this.gameComplete();
            return;
        }
        
        if (!this.lastCapturedAI) {
            this.spawnNextAI();
            return;
        }
        
        this.minMovementDistance = this.getMovementDistance(this.lastCapturedAI.rarity);
        this.waitingForMovement = true;
        this.distanceTraveled = 0;
        this.stepCount = 0;
        this.showDistanceCounter();
    }
    
    updateDistanceCounter() {
        const counter = document.getElementById('distance-counter');
        if (counter) {
            const remaining = Math.max(0, this.minMovementDistance - this.distanceTraveled);
            const walkText = this.language === 'ja' ? 
                `${this.minMovementDistance.toFixed(0)}メートル歩いて次のターゲットをアンロック` : 
                `WALK ${this.minMovementDistance.toFixed(0)} METERS TO UNLOCK NEXT TARGET`;
            const remainingText = this.language === 'ja' ? '残り' : 'remaining';
            
            counter.innerHTML = `
                <div style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${walkText}</div>
                <div style="font-size: 18px; margin: 8px 0; color: #00f0ff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${remaining.toFixed(1)}m ${remainingText}</div>
                <div style="width: 200px; height: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); border-radius: 5px; margin: 0 auto;">
                    <div style="width: ${Math.min(100, (this.distanceTraveled / this.minMovementDistance) * 100)}%; height: 100%; background: linear-gradient(90deg, #00f0ff, #10b981); border-radius: 4px; transition: width 0.3s; box-shadow: 0 0 10px rgba(0,240,255,0.5);"></div>
                </div>
            `;
        }
    }
    
    showDistanceCounter() {
        const counter = document.createElement('div');
        counter.id = 'distance-counter';
        counter.style.cssText = `
            position: fixed;
            bottom: 200px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00f0ff;
            border-radius: 12px;
            padding: 16px;
            font-family: 'Orbitron', sans-serif;
            font-size: 12px;
            font-weight: bold;
            color: white;
            letter-spacing: 1px;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(counter);
        this.updateDistanceCounter();
    }
    
    hideDistanceCounter() {
        const counter = document.getElementById('distance-counter');
        if (counter) counter.remove();
    }
    
    showAIInfo() {
        if (!this.lastCapturedAI) {
            this.startMovementPhase();
            return;
        }
        
        const lastCaptured = this.lastCapturedAI;
        
        const infoModal = document.createElement('div');
        infoModal.id = 'ai-info-modal';
        infoModal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        `;
        
        infoModal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid var(--primary);
                border-radius: 16px;
                padding: 30px;
                text-align: center;
                max-width: 400px;
                color: white;
                font-family: 'Orbitron', sans-serif;
                position: relative;
            ">
                <button id="close-info-btn" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 30px;
                    height: 30px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    ×
                </button>
                <div style="font-size: 80px; margin-bottom: 20px;">${lastCaptured.emoji}</div>
                <h3 style="color: var(--primary); margin-bottom: 15px; font-size: 1.5rem;">${lastCaptured.name}</h3>
                <p style="line-height: 1.6; font-size: 14px; color: rgba(255,255,255,0.8);">${lastCaptured.info[this.language]}</p>
            </div>
        `;
        
        document.body.appendChild(infoModal);
        
        // Add close button functionality
        const closeBtn = document.getElementById('close-info-btn');
        const closeModal = () => {
            infoModal.remove();
            this.startMovementPhase();
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        // Auto-close after 13 seconds
        const autoCloseTimer = setTimeout(closeModal, 13000);
        
        // Clear timer if manually closed
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoCloseTimer);
        });
    }
    

    
    updateLanguage() {
        const texts = {
            en: {
                title: 'AI HUNTER',
                tagline: 'Locate. Target. Capture.',
                nameLabel: 'HUNTER NAME',
                orgLabel: 'ORGANIZATION',
                startBtn: 'INITIALIZE',
                infoText: 'Please enter correct name and organization',
                scanText: 'SCANNING AREA...',
                scanHint: 'Move your device to find AI models',
                targetAcquired: 'TARGET ACQUIRED',
                noTarget: 'NO TARGET',
                findTarget: 'FIND TARGET',
                aimTarget: 'AIM AT TARGET',
                capture: 'CAPTURE',
                collection: 'COLLECTION',
                captured: 'CAPTURED',
                continue: 'CONTINUE',
                walkToUnlock: 'WALK 1 METER TO UNLOCK NEXT TARGET',
                remaining: 'remaining'
            },
            ja: {
                title: 'AI ハンター',
                tagline: '発見。狙い。捕獲。',
                nameLabel: 'ハンター名',
                orgLabel: '組織',
                startBtn: '開始',
                infoText: '正しい名前と組織を入力してください',
                scanText: 'エリアスキャン中...',
                scanHint: 'デバイスを動かしてAIモデルを探してください',
                targetAcquired: 'ターゲット獲得',
                noTarget: 'ターゲットなし',
                findTarget: 'ターゲットを探す',
                aimTarget: 'ターゲットを狙う',
                capture: '捕獲',
                collection: 'コレクション',
                captured: '捕獲成功',
                continue: '続ける',
                walkToUnlock: '1メートル歩いて次のターゲットをアンロック',
                remaining: '残り'
            }
        };
        
        const t = texts[this.language];
        
        // Update login page
        if (document.querySelector('#landing-page h1')) {
            document.querySelector('#landing-page h1').textContent = t.title;
            document.querySelector('.tagline').textContent = t.tagline;
            document.querySelector('label[for="name"]').textContent = t.nameLabel;
            document.querySelector('label[for="organization"]').textContent = t.orgLabel;
            document.querySelector('.start-btn span').textContent = t.startBtn;
            document.getElementById('login-info').textContent = t.infoText;
        }
        
        // Update game interface
        if (document.querySelector('.scan-text')) {
            document.querySelector('.scan-text').textContent = t.scanText;
            document.querySelector('.scan-hint').textContent = t.scanHint;
        }
        
        if (document.querySelector('.inv-header h2')) {
            document.querySelector('.inv-header h2').textContent = t.collection;
        }
        
        if (document.querySelector('#success-modal h3')) {
            document.querySelector('#success-modal h3').textContent = t.captured;
            document.querySelector('#continue-btn').textContent = t.continue;
        }
    }
    
    updateUserStats() {
        const statsElement = document.getElementById('user-stats');
        if (statsElement) {
            statsElement.textContent = `${this.userStats.totalCaptured}/${this.userStats.totalModels}`;
        }
    }
    
    gameTimeUp() {
        const gameTime = this.gameTimeLimit;
        this.saveScore(gameTime, this.userStats.totalCaptured);
        
        const timeUpModal = document.createElement('div');
        timeUpModal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        timeUpModal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #ff3366;
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                color: white;
                font-family: 'Orbitron', sans-serif;
            ">
                <h2 style="color: #ff3366; margin-bottom: 20px;">${this.language === 'ja' ? '時間終了！' : 'TIME UP!'}</h2>
                <p>${this.language === 'ja' ? `${this.userStats.totalCaptured}個のAIモデルを捕獲しました！` : `You captured ${this.userStats.totalCaptured} AI models!`}</p>
                <button onclick="location.reload()" style="
                    margin-top: 20px;
                    padding: 12px 24px;
                    background: var(--primary);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-family: 'Orbitron', sans-serif;
                    cursor: pointer;
                ">${this.language === 'ja' ? '再スタート' : 'RESTART'}</button>
            </div>
        `;
        
        document.body.appendChild(timeUpModal);
    }
    
    getEmojiForAI(name) {
        const emojiMap = {
            'GPT-4': '🤖', 'Claude': '🧠', 'Gemini': '💎', 'LLaMA': '🦙', 'PaLM': '🌴',
            'BERT': '📚', 'T5': '🔄', 'GPT-3': '⚡', 'Mistral': '🌪️', 'Falcon': '🦅',
            'Rufus': '🛍️', 'Copilot': '💻', 'Bard': '🎭', 'ChatGPT': '💬', 'Alexa': '🔊'
        };
        return emojiMap[name] || '🤖';
    }
    
    async saveToExcel(gameTime) {
        try {
            const response = await fetch('/api/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: this.user.name,
                    organization: this.user.organization,
                    gameTime: gameTime
                })
            });
            const result = await response.json();
            if (result.success) {
                this.showExcelRank(result.rank);
            }
        } catch (error) {
            console.log('Excel save failed:', error);
        }
    }
    
    showExcelRank(rank) {
        const rankModal = document.createElement('div');
        rankModal.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.9);
            display: flex; align-items: center; justify-content: center; z-index: 1001;
        `;
        
        const rankEmoji = rank === 1 ? '🏆' : rank <= 3 ? '🥉' : rank <= 10 ? '🎯' : '📊';
        
        rankModal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid var(--primary); border-radius: 16px; padding: 30px;
                text-align: center; color: white; font-family: 'Orbitron', sans-serif;
            ">
                <div style="font-size: 60px; margin-bottom: 15px;">${rankEmoji}</div>
                <h3 style="color: var(--primary); margin-bottom: 10px;">GLOBAL RANK</h3>
                <div style="font-size: 2rem; font-weight: bold; color: var(--success); margin-bottom: 10px;">#${rank}</div>
                <div style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">Saved to Excel Leaderboard!</div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    padding: 12px 24px; background: var(--primary); border: none;
                    border-radius: 8px; color: white; cursor: pointer;
                ">CONTINUE</button>
            </div>
        `;
        
        document.body.appendChild(rankModal);
        setTimeout(() => rankModal.remove(), 10000);
    }
    

    
    calculateScore(gameTime, captured) {
        const baseScore = captured * 1000;
        const timeBonus = Math.max(0, (this.gameTimeLimit - gameTime) / 1000);
        return Math.round(baseScore + timeBonus);
    }
    
    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    getMovementDistance(rarity) {
        return 1; // Uniform 1 meter requirement
    }

    showLanguagePrompt() {
        const prompt = document.createElement('div');
        prompt.id = 'language-prompt';
        prompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #00f0ff;
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            z-index: 2000;
            font-family: 'Orbitron', sans-serif;
            color: white;
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
            animation: bounceIn 0.6s ease;
        `;
        
        prompt.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px; animation: wave 2s infinite;">🤖</div>
            <h3 style="color: #00f0ff; margin-bottom: 15px;">Welcome to AI Hunter!</h3>
            <p style="margin-bottom: 25px; color: rgba(255,255,255,0.8);">Would you like to play in Japanese?</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="play-japanese" style="
                    padding: 12px 24px;
                    background: #00f0ff;
                    border: none;
                    border-radius: 8px;
                    color: #1a1a2e;
                    font-family: 'Orbitron', sans-serif;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">はい (Yes)</button>
                <button id="play-english" style="
                    padding: 12px 24px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 8px;
                    color: white;
                    font-family: 'Orbitron', sans-serif;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">English</button>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.05); }
                70% { transform: translate(-50%, -50%) scale(0.9); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-10deg); }
                75% { transform: rotate(10deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Event listeners
        document.getElementById('play-japanese').addEventListener('click', () => {
            this.language = 'ja';
            document.getElementById('language-select').value = 'ja';
            this.updateLanguage();
            prompt.remove();
        });
        
        document.getElementById('play-english').addEventListener('click', () => {
            this.language = 'en';
            document.getElementById('language-select').value = 'en';
            this.updateLanguage();
            prompt.remove();
        });
        
        // Auto-close after 10 seconds (default to English)
        setTimeout(() => {
            if (document.getElementById('language-prompt')) {
                prompt.remove();
            }
        }, 10000);
    }

    showSaveConfirmation() {
        const saveMessage = this.language === 'ja' ? '✅ スコアがリーダーボードに保存されました！' : '✅ Score saved to leaderboard!';
        
        const confirmModal = document.createElement('div');
        confirmModal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        `;
        
        confirmModal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #10b981;
                border-radius: 16px;
                padding: 30px;
                text-align: center;
                color: white;
                font-family: 'Orbitron', sans-serif;
                max-width: 400px;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
                <p style="font-size: 16px; margin-bottom: 20px;">${saveMessage}</p>
                <button id="confirm-ok" style="
                    padding: 12px 24px;
                    background: #10b981;
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-family: 'Orbitron', sans-serif;
                    cursor: pointer;
                ">${this.language === 'ja' ? 'OK' : 'OK'}</button>
            </div>
        `;
        
        document.body.appendChild(confirmModal);
        
        const showThankYou = () => {
            confirmModal.remove();
            this.showThankYouMessage();
        };
        
        document.getElementById('confirm-ok').addEventListener('click', showThankYou);
        
        // Auto-close after 5 seconds
        setTimeout(showThankYou, 5000);
    }

    showThankYouMessage() {
        const thankYouModal = document.createElement('div');
        thankYouModal.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            backdrop-filter: blur(10px);
        `;
        
        const thankYouText = this.language === 'ja' ? 
            'プレイしていただきありがとうございました！' : 
            'Thank you for playing!';
        
        thankYouModal.innerHTML = `
            <div style="
                text-align: center;
                color: white;
                font-family: 'Orbitron', sans-serif;
            ">
                <div style="
                    font-size: 120px; 
                    margin-bottom: 30px; 
                    animation: wave 1.5s infinite;
                    filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.5));
                ">🤖</div>
                <h2 style="
                    color: #00f0ff; 
                    margin-bottom: 20px; 
                    font-size: 2rem;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                ">${thankYouText}</h2>
                <p style="
                    color: rgba(255,255,255,0.8); 
                    font-size: 14px;
                    margin-bottom: 30px;
                ">${this.language === 'ja' ? 'AIハンターをお楽しみいただきありがとうございました！' : 'We hope you enjoyed AI Hunter!'}</p>
            </div>
        `;
        
        document.body.appendChild(thankYouModal);
        
        // No auto-close - stays until user manually closes browser/tab
    }
    

}



document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new AIHunterGame();
});
