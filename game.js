class AIHunterGame {
    constructor() {
        this.user = { name: '', organization: '' };
        this.aiModels = [
            { name: 'GPT-4', icon: '🤖', caught: false, rarity: 'legendary' },
            { name: 'Claude', icon: '🧠', caught: false, rarity: 'legendary' },
            { name: 'Gemini', icon: '💎', caught: false, rarity: 'epic' },
            { name: 'LLaMA', icon: '🦙', caught: false, rarity: 'epic' },
            { name: 'PaLM', icon: '🌴', caught: false, rarity: 'rare' },
            { name: 'BERT', icon: '📚', caught: false, rarity: 'common' },
            { name: 'T5', icon: '🔄', caught: false, rarity: 'common' },
            { name: 'GPT-3', icon: '⚡', caught: false, rarity: 'rare' },
            { name: 'Mistral', icon: '🌪️', caught: false, rarity: 'epic' },
            { name: 'Falcon', icon: '🦅', caught: false, rarity: 'rare' }
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
        
        // Track player's physical position
        this.playerPosition = { x: 0, y: 0, z: 0 };
        this.lastCapturePosition = null;
        this.minMovementDistance = 1; // meters
        
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
    }

    setupEventListeners() {
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
            // Continue button now does nothing as next AI spawns automatically
        });

        document.getElementById('view-collection-btn').addEventListener('click', () => {
            this.hideModal('complete-modal');
            this.showInventory();
        });
    }

    async startGame() {
        this.user.name = document.getElementById('name').value;
        this.user.organization = document.getElementById('organization').value;

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
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            this.enableMotion();
                        } else {
                            this.fallbackToTouch();
                        }
                    })
                    .catch(() => this.fallbackToTouch());
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
        
        this.showCalibrationHint();
        
        // Track device orientation
        window.addEventListener('deviceorientation', (e) => {
            if (e.alpha !== null && e.beta !== null) {
                this.motionSupported = true;
                
                if (!calibrated) {
                    setTimeout(() => {
                        if (initialAlpha === null) {
                            initialAlpha = e.alpha;
                            initialBeta = e.beta;
                            calibrated = true;
                            this.hideCalibrationHint();
                        }
                    }, 2000);
                    return;
                }
                
                let alphaOffset = e.alpha - initialAlpha;
                if (alphaOffset > 180) alphaOffset -= 360;
                if (alphaOffset < -180) alphaOffset += 360;
                
                this.heading = -alphaOffset * 1.2;
                
                let betaOffset = e.beta - initialBeta;
                this.pitch = betaOffset * 1.0;
                
                this.heading = Math.max(-270, Math.min(270, this.heading));
                this.pitch = Math.max(-90, Math.min(90, this.pitch));
            }
        });
        
        // Track physical movement with accelerometer
        if (window.DeviceMotionEvent) {
            let lastAcceleration = { x: 0, y: 0, z: 0 };
            let velocity = { x: 0, y: 0, z: 0 };
            let lastTime = Date.now();
            
            window.addEventListener('devicemotion', (e) => {
                if (e.acceleration) {
                    const currentTime = Date.now();
                    const deltaTime = (currentTime - lastTime) / 1000;
                    
                    // Filter out gravity and small movements
                    const threshold = 0.5;
                    const accel = {
                        x: Math.abs(e.acceleration.x) > threshold ? e.acceleration.x : 0,
                        y: Math.abs(e.acceleration.y) > threshold ? e.acceleration.y : 0,
                        z: Math.abs(e.acceleration.z) > threshold ? e.acceleration.z : 0
                    };
                    
                    // Integrate acceleration to get velocity
                    velocity.x += accel.x * deltaTime;
                    velocity.y += accel.y * deltaTime;
                    velocity.z += accel.z * deltaTime;
                    
                    // Apply damping to prevent drift
                    velocity.x *= 0.95;
                    velocity.y *= 0.95;
                    velocity.z *= 0.95;
                    
                    // Integrate velocity to get position
                    this.playerPosition.x += velocity.x * deltaTime;
                    this.playerPosition.y += velocity.y * deltaTime;
                    this.playerPosition.z += velocity.z * deltaTime;
                    
                    lastTime = currentTime;
                }
            });
        }
    }

    fallbackToTouch() {
        // Disable touch controls - use device orientation only
        // This prevents dragging AI models around with finger
        console.log('Touch controls disabled - use device orientation');
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
                // Fixed position calculation - AI stays in world position
                const screenX = this.frameCenter.x + (angleDiff / fovH) * this.canvas.width * 0.4;
                const screenY = this.frameCenter.y - (pitchDiff / fovV) * this.canvas.height * 0.4;
                
                this.aiScreenPos = { x: screenX, y: screenY };
                
                // Check if AI is in targeting frame
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
        
        if (this.aiInFrame && this.aiVisible) {
            btn.disabled = false;
            label.textContent = 'CAPTURE';
            label.classList.add('ready');
            frame.classList.add('locked');
        } else {
            btn.disabled = true;
            if (this.currentAI) {
                label.textContent = this.aiVisible ? 'AIM AT TARGET' : 'FIND TARGET';
            } else {
                label.textContent = 'NO TARGET';
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
            
            // Show position hint in target indicator
            const targetLabel = document.querySelector('.target-label');
            if (this.currentAI.positionHint && !this.aiVisible) {
                targetLabel.textContent = this.currentAI.positionHint;
            } else {
                targetLabel.textContent = 'TARGET ACQUIRED';
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
        
        const gradient = this.ctx.createRadialGradient(x, floatY, 0, x, floatY, size * 1.5);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.2)');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, floatY, size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        const innerGlow = this.ctx.createRadialGradient(x, floatY, size * 0.3, x, floatY, size);
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        innerGlow.addColorStop(0.7, 'rgba(255, 255, 255, 0.85)');
        innerGlow.addColorStop(1, 'rgba(200, 200, 255, 0.7)');
        
        this.ctx.fillStyle = innerGlow;
        this.ctx.shadowColor = this.aiInFrame ? '#10b981' : '#00f0ff';
        this.ctx.shadowBlur = this.aiInFrame ? 50 : 30;
        this.ctx.beginPath();
        this.ctx.arc(x, floatY, size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
        this.ctx.font = `${size * 0.7}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.currentAI.icon, x, floatY);
        
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
        const uncaught = this.aiModels.filter(ai => !ai.caught);
        if (uncaught.length === 0) {
            this.gameComplete();
            return;
        }
        
        // Spawn immediately without timer
        this.spawnAI();
    }

    spawnAI() {
        const uncaught = this.aiModels.filter(ai => !ai.caught);
        if (uncaught.length === 0) return;
        
        this.currentAI = uncaught[Math.floor(Math.random() * uncaught.length)];
        
        // ABSOLUTE positioning - forces physical movement
        const positions = [
            { type: 'ceiling', pitch: -45, angle: 'random', hint: 'LOOK UP', distance: 2 },
            { type: 'floor', pitch: 45, angle: 'random', hint: 'LOOK DOWN', distance: 2 },
            { type: 'left', pitch: 0, angle: 'left', hint: 'TURN LEFT', distance: 2 },
            { type: 'right', pitch: 0, angle: 'right', hint: 'TURN RIGHT', distance: 2 },
            { type: 'behind', pitch: 0, angle: 'behind', hint: 'TURN AROUND', distance: 2 },
            { type: 'up_left', pitch: -30, angle: 'left', hint: 'LOOK UP LEFT', distance: 2 },
            { type: 'up_right', pitch: -30, angle: 'right', hint: 'LOOK UP RIGHT', distance: 2 },
            { type: 'down_left', pitch: 30, angle: 'left', hint: 'LOOK DOWN LEFT', distance: 2 }
        ];
        
        const position = positions[Math.floor(Math.random() * positions.length)];
        
        // Set FIXED world angles (not relative to current heading)
        const baseAngle = Math.random() * 360 - 180; // Random base angle
        switch(position.angle) {
            case 'random':
                this.aiAngle = baseAngle;
                break;
            case 'opposite':
                this.aiAngle = baseAngle + 180;
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
        
        // Normalize angle
        while (this.aiAngle > 180) this.aiAngle -= 360;
        while (this.aiAngle < -180) this.aiAngle += 360;
        
        // Set FIXED world pitch
        this.aiPitch = position.pitch + (Math.random() - 0.5) * 15;
        this.aiPitch = Math.max(-60, Math.min(60, this.aiPitch));
        
        // Store position requirements
        this.currentAI.positionHint = position.hint;
        this.currentAI.requiredDistance = position.distance;
        this.currentAI.spawnPosition = { ...this.playerPosition };
        
        this.showSpawnNotification(position.hint);
        this.updateTargetIndicator();
    }

    captureAI() {
        if (!this.aiInFrame || !this.currentAI) return;
        
        const captured = this.currentAI;
        captured.caught = true;
        
        document.getElementById('captured-icon').textContent = captured.icon;
        document.getElementById('capture-message').textContent = 
            `${captured.name} has been added to your collection!`;
        
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        this.currentAI = null;
        this.aiScreenPos = null;
        
        this.updateProgress();
        this.updateInventory();
        this.showModal('success-modal');
        
        // Spawn next AI immediately after capture
        setTimeout(() => {
            this.hideModal('success-modal');
            this.spawnNextAI();
        }, 2000);
    }

    gameComplete() {
        document.getElementById('complete-message').textContent = 
            `Congratulations ${this.user.name}! You've captured all 10 AI models!`;
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
                <div class="icon">${ai.icon}</div>
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
        hint.innerHTML = 'HOLD PHONE STEADY<br>CALIBRATING...';
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
