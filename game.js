class AIHunterGame {
    constructor() {
        this.user = { name: '', organization: '' };
        this.language = 'en';
        this.gameStartTime = null;
        this.gameTimeLimit = 600000; // 10 minutes
        this.userStats = { totalCaptured: 0, totalModels: 15 };
        
        this.aiModels = [
            { name: 'GPT-4', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', caught: false, rarity: 'legendary', info: { en: 'GPT-4 is OpenAI\'s most advanced language model, capable of understanding and generating human-like text with remarkable accuracy and creativity.', ja: 'GPT-4はOpenAIの最も高度な言語モデルで、驚くべき精度と創造性で人間のようなテキストを理解し生成することができます。' } },
            { name: 'Claude', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg', caught: false, rarity: 'legendary', info: { en: 'Claude is Anthropic\'s AI assistant focused on being helpful, harmless, and honest through constitutional AI training methods.', ja: 'ClaudeはAnthropicのAIアシスタントで、憲法的AI訓練方法により、有用で無害で正直であることに焦点を当てています。' } },
            { name: 'Gemini', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', caught: false, rarity: 'epic', info: { en: 'Gemini is Google\'s multimodal AI model that can understand and process text, images, audio, and video simultaneously.', ja: 'GeminiはGoogleのマルチモーダルAIモデルで、テキスト、画像、音声、動画を同時に理解し処理することができます。' } },
            { name: 'LLaMA', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', caught: false, rarity: 'epic', info: { en: 'LLaMA (Large Language Model Meta AI) is Meta\'s foundation language model designed for research and commercial applications.', ja: 'LLaMA（Large Language Model Meta AI）は、研究および商用アプリケーション向けに設計されたMetaの基盤言語モデルです。' } },
            { name: 'PaLM', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', caught: false, rarity: 'rare', info: { en: 'PaLM (Pathways Language Model) is Google\'s 540-billion parameter transformer model with breakthrough reasoning capabilities.', ja: 'PaLM（Pathways Language Model）は、画期的な推論能力を持つGoogleの5400億パラメータのトランスフォーマーモデルです。' } },
            { name: 'BERT', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', caught: false, rarity: 'common', info: { en: 'BERT revolutionized NLP by introducing bidirectional training, allowing better understanding of context in language processing.', ja: 'BERTは双方向訓練を導入してNLPに革命をもたらし、言語処理における文脈のより良い理解を可能にしました。' } },
            { name: 'T5', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', caught: false, rarity: 'common', info: { en: 'T5 (Text-to-Text Transfer Transformer) treats every NLP problem as a text generation task, unifying various language tasks.', ja: 'T5（Text-to-Text Transfer Transformer）は、すべてのNLP問題をテキスト生成タスクとして扱い、様々な言語タスクを統合します。' } },
            { name: 'GPT-3', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', caught: false, rarity: 'rare', info: { en: 'GPT-3 was a breakthrough 175-billion parameter model that demonstrated emergent abilities in language understanding and generation.', ja: 'GPT-3は1750億パラメータの画期的なモデルで、言語理解と生成において創発的能力を実証しました。' } },
            { name: 'Mistral', icon: 'https://mistral.ai/images/logo_hubc88c4ece131b91c7cb753f40e9e1cc5_2589_256x0_resize_q75_h2_lanczos_3.webp', caught: false, rarity: 'epic', info: { en: 'Mistral AI creates efficient, high-performance language models focused on practical applications and deployment flexibility.', ja: 'Mistral AIは、実用的なアプリケーションと展開の柔軟性に焦点を当てた効率的で高性能な言語モデルを作成します。' } },
            { name: 'Falcon', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', caught: false, rarity: 'rare', info: { en: 'Falcon is a family of open-source large language models trained on refined web data for superior performance.', ja: 'Falconは、優れた性能のために洗練されたWebデータで訓練されたオープンソース大規模言語モデルのファミリーです。' } },
            { name: 'Rufus', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', caught: false, rarity: 'epic', info: { en: 'Rufus is Amazon\'s generative AI-powered shopping assistant that helps users find, compare, and purchase products through natural conversations.', ja: 'RufusはAmazonの生成AI搭載ショッピングアシスタントで、自然な会話を通じてユーザーが商品を見つけ、比較し、購入するのを支援します。' } },
            { name: 'Copilot', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', caught: false, rarity: 'rare', info: { en: 'GitHub Copilot is an AI pair programmer that suggests code and entire functions in real-time, powered by OpenAI Codex.', ja: 'GitHub CopilotはOpenAI Codexを搭載したAIペアプログラマーで、リアルタイムでコードや関数全体を提案します。' } },
            { name: 'Bard', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', caught: false, rarity: 'epic', info: { en: 'Bard was Google\'s conversational AI service designed to provide helpful, accurate, and up-to-date information through natural dialogue.', ja: 'BardはGoogleの会話型AIサービスで、自然な対話を通じて有用で正確かつ最新の情報を提供するように設計されていました。' } },
            { name: 'ChatGPT', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', caught: false, rarity: 'legendary', info: { en: 'ChatGPT is OpenAI\'s conversational AI that can engage in human-like dialogue, answer questions, and assist with various tasks.', ja: 'ChatGPTはOpenAIの会話型AIで、人間のような対話を行い、質問に答え、様々なタスクを支援することができます。' } },
            { name: 'Alexa', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', caught: false, rarity: 'common', info: { en: 'Alexa is Amazon\'s cloud-based voice service that powers Echo devices and enables voice interaction with smart home devices.', ja: 'AlexaはAmazonのクラウドベース音声サービスで、Echoデバイスを動かし、スマートホームデバイスとの音声インタラクションを可能にします。' } }
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
        
        this.playerPosition = { x: 0, y: 0, z: 0 };
        this.lastCapturePosition = null;
        this.minMovementDistance = 3;
        this.distanceTraveled = 0;
        this.waitingForMovement = false;
        this.lastCapturedAI = null;
        
        this.aiVisible = false;
        this.aiInFrame = false;
        
        this.frameCenter = { x: 0, y: 0 };
        this.frameRadius = 100;
        
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

        document.getElementById('view-collection-btn').addEventListener('click', () => {
            this.hideModal('complete-modal');
            this.showInventory();
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
            alert('Camera access is required to play. Please allow camera permissions and try again.');
            console.error('Camera error:', error);
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
        
        if (window.DeviceMotionEvent) {
            let velocity = { x: 0, y: 0, z: 0 };
            let lastTime = Date.now();
            
            window.addEventListener('devicemotion', (e) => {
                if (e.acceleration) {
                    const currentTime = Date.now();
                    const deltaTime = (currentTime - lastTime) / 1000;
                    
                    const threshold = 0.5;
                    const accel = {
                        x: Math.abs(e.acceleration.x) > threshold ? e.acceleration.x : 0,
                        y: Math.abs(e.acceleration.y) > threshold ? e.acceleration.y : 0,
                        z: Math.abs(e.acceleration.z) > threshold ? e.acceleration.z : 0
                    };
                    
                    velocity.x += accel.x * deltaTime;
                    velocity.y += accel.y * deltaTime;
                    velocity.z += accel.z * deltaTime;
                    
                    velocity.x *= 0.95;
                    velocity.y *= 0.95;
                    velocity.z *= 0.95;
                    
                    const oldPosition = { ...this.playerPosition };
                    this.playerPosition.x += velocity.x * deltaTime;
                    this.playerPosition.y += velocity.y * deltaTime;
                    this.playerPosition.z += velocity.z * deltaTime;
                    
                    if (this.waitingForMovement && this.lastCapturePosition) {
                        const movementDelta = this.calculateDistance(oldPosition, this.playerPosition);
                        this.distanceTraveled += movementDelta;
                        this.updateDistanceCounter();
                        
                        if (this.distanceTraveled >= this.minMovementDistance) {
                            this.spawnNextAI();
                        }
                    }
                    
                    lastTime = currentTime;
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
        message.innerHTML = 'DEVICE MOTION REQUIRED<br><small>Please enable motion permissions</small>';
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
                targetLabel.textContent = this.language === 'ja' ? 'ターゲット獲得' : 'TARGET ACQUIRED';
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
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
        
        const arrowX = this.frameCenter.x + Math.sin(arrowAngle) * radius;
        const arrowY = this.frameCenter.y - Math.cos(arrowAngle) * radius * 0.5;
        
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
        
        // Draw actual icon image
        this.ctx.shadowBlur = 0;
        
        // Create and load image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // Store context for async loading
        const drawImage = () => {
            this.ctx.save();
            this.ctx.drawImage(img, x - size * 0.3, floatY - size * 0.3, size * 0.6, size * 0.6);
            this.ctx.restore();
        };
        
        img.onload = drawImage;
        img.onerror = () => {
            // Fallback to emoji if image fails
            const emojiMap = {
                'GPT-4': '🤖', 'Claude': '🧠', 'Gemini': '💎', 'LLaMA': '🦙', 'PaLM': '🌴',
                'BERT': '📚', 'T5': '🔄', 'GPT-3': '⚡', 'Mistral': '🌪️', 'Falcon': '🦅',
                'Rufus': '🛍️', 'Copilot': '💻', 'Bard': '🎭', 'ChatGPT': '💬', 'Alexa': '🔊'
            };
            this.ctx.font = `${size * 0.5}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(emojiMap[this.currentAI.name] || '🤖', x, floatY);
        };
        
        img.src = this.currentAI.icon;
        
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
        
        const positions = [
            { type: 'ceiling', pitch: -45, angle: 'random', hint: 'LOOK UP' },
            { type: 'floor', pitch: 45, angle: 'random', hint: 'LOOK DOWN' },
            { type: 'left', pitch: 0, angle: 'left', hint: 'TURN LEFT' },
            { type: 'right', pitch: 0, angle: 'right', hint: 'TURN RIGHT' },
            { type: 'behind', pitch: 0, angle: 'behind', hint: 'TURN AROUND' },
            { type: 'up_left', pitch: -30, angle: 'left', hint: 'LOOK UP LEFT' },
            { type: 'up_right', pitch: -30, angle: 'right', hint: 'LOOK UP RIGHT' },
            { type: 'down_left', pitch: 30, angle: 'left', hint: 'LOOK DOWN LEFT' }
        ];
        
        const position = positions[Math.floor(Math.random() * positions.length)];
        
        const baseAngle = Math.random() * 360 - 180;
        switch(position.angle) {
            case 'random':
                this.aiAngle = baseAngle;
                break;
            case 'behind':
                this.aiAngle = baseAngle + 180;
                break;
            case 'left':
                this.aiAngle = baseAngle - 90;
                break;
            case 'right':
                this.aiAngle = baseAngle + 90;
                break;
        }
        
        while (this.aiAngle > 180) this.aiAngle -= 360;
        while (this.aiAngle < -180) this.aiAngle += 360;
        
        this.aiPitch = position.pitch + (Math.random() - 0.5) * 15;
        this.aiPitch = Math.max(-60, Math.min(60, this.aiPitch));
        
        this.currentAI.positionHint = position.hint;
        
        this.showSpawnNotification(position.hint);
        this.updateTargetIndicator();
    }

    captureAI() {
        if (!this.aiInFrame || !this.currentAI) return;
        
        const captured = this.currentAI;
        captured.caught = true;
        this.userStats.totalCaptured++;
        this.lastCapturedAI = captured; // Store for info display
        
        const capturedImg = document.getElementById('captured-icon');
        capturedImg.innerHTML = `<img src="${captured.icon}" style="width: 60px; height: 60px; object-fit: contain;" onerror="this.innerHTML='🤖'">`;
        
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
        this.showModal('success-modal');
    }

    gameComplete() {
        document.getElementById('complete-message').textContent = 
            `Congratulations ${this.user.name}! You've captured all ${this.aiModels.length} AI models!`;
        this.showModal('complete-modal');
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
            item.innerHTML = `
                <div class="icon"><img src="${ai.icon}" style="width: 48px; height: 48px; object-fit: contain;" onerror="this.innerHTML='🤖'"></div>
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
            hint.innerHTML = `
                <div>MOTION PERMISSION REQUIRED</div>
                <button onclick="this.parentElement.dispatchEvent(new Event('requestMotion'))" 
                       style="margin-top: 10px; padding: 8px 16px; background: white; color: black; border: none; border-radius: 4px; cursor: pointer;">
                    ENABLE MOTION
                </button>
            `;
            
            hint.addEventListener('requestMotion', () => {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            hint.innerHTML = 'HOLD PHONE STEADY<br>CALIBRATING...';
                            this.enableMotion();
                        } else {
                            hint.innerHTML = 'MOTION PERMISSION DENIED<br><small>Game requires motion tracking</small>';
                        }
                    })
                    .catch(() => {
                        hint.innerHTML = 'MOTION PERMISSION FAILED<br><small>Game requires motion tracking</small>';
                    });
            });
        } else {
            hint.innerHTML = 'HOLD PHONE STEADY<br>CALIBRATING...';
        }
        
        document.body.appendChild(hint);
    }
    
    hideCalibrationHint() {
        const hint = document.getElementById('calibration-hint');
        if (hint) hint.remove();
    }
    
    showSpawnNotification(hint = 'NEW TARGET DETECTED!') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 51, 102, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Orbitron', sans-serif;
            font-size: 11px;
            letter-spacing: 1px;
            z-index: 1000;
            animation: slideDown 0.3s ease;
            text-align: center;
            max-width: 280px;
        `;
        notification.innerHTML = `<div style="margin-bottom: 4px;">🎯 TARGET DETECTED</div><div style="font-size: 10px; opacity: 0.8;">${hint}</div>`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
    
    startMovementPhase() {
        setTimeout(() => {
            this.waitingForMovement = true;
            this.distanceTraveled = 0;
            this.lastCapturePosition = { ...this.playerPosition };
            this.showDistanceCounter();
        }, 10000);
    }
    
    updateDistanceCounter() {
        const counter = document.getElementById('distance-counter');
        if (counter) {
            const remaining = Math.max(0, this.minMovementDistance - this.distanceTraveled);
            const walkText = this.language === 'ja' ? '歩いて次のターゲットをアンロック' : 'WALK TO UNLOCK NEXT TARGET';
            const remainingText = this.language === 'ja' ? '残り' : 'remaining';
            
            counter.innerHTML = `
                <div>${walkText}</div>
                <div style="font-size: 18px; margin: 8px 0;">${remaining.toFixed(1)}m ${remainingText}</div>
                <div style="width: 200px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; margin: 0 auto;">
                    <div style="width: ${Math.min(100, (this.distanceTraveled / this.minMovementDistance) * 100)}%; height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.3s;"></div>
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
            background: rgba(0, 240, 255, 0.1);
            border: 2px solid var(--primary);
            border-radius: 12px;
            padding: 16px;
            font-family: 'Orbitron', sans-serif;
            font-size: 12px;
            color: var(--primary);
            letter-spacing: 1px;
            text-align: center;
            z-index: 1000;
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
            ">
                <img src="${lastCaptured.icon}" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 20px;" onerror="this.innerHTML='🤖'">
                <h3 style="color: var(--primary); margin-bottom: 15px; font-size: 1.5rem;">${lastCaptured.name}</h3>
                <p style="line-height: 1.6; font-size: 14px; color: rgba(255,255,255,0.8);">${lastCaptured.info[this.language]}</p>
            </div>
        `;
        
        document.body.appendChild(infoModal);
        
        setTimeout(() => {
            infoModal.remove();
            this.startMovementPhase();
        }, 10000);
    }
    

    
    updateLanguage() {
        const texts = {
            en: {
                title: 'AI HUNTER',
                tagline: 'Locate. Target. Capture.',
                nameLabel: 'HUNTER ID',
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
                walkToUnlock: 'WALK TO UNLOCK NEXT TARGET',
                remaining: 'remaining'
            },
            ja: {
                title: 'AI ハンター',
                tagline: '発見。狙い。捕獲。',
                nameLabel: 'ハンターID',
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
                walkToUnlock: '歩いて次のターゲットをアンロック',
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
    
    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIHunterGame();
});
