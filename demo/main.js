document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('stage');
    const layerFar = document.getElementById('layer-far');
    const layerMid = document.getElementById('layer-mid');
    const layerFore = document.getElementById('layer-fore');
    const player = document.getElementById('player');
    const bloom = document.getElementById('bloom');

    // Game State
    const state = {
        playerX: 50, // Percentage
        playerY: 15, // Percentage from bottom
        worldX: 0,   // Scroll offset
        speed: 1.0,
        isRunning: false,
        keys: {},
        facingRight: true,
        isMoving: false
    };

    // Input Handling
    window.addEventListener('keydown', (e) => {
        state.keys[e.code] = true;
        state.keys[e.key] = true;
        if (e.shiftKey) state.isRunning = true;
    });

    window.addEventListener('keyup', (e) => {
        state.keys[e.code] = false;
        state.keys[e.key] = false;
        if (!e.shiftKey) state.isRunning = false;
    });

    // Debug Info
    const debug = document.createElement('div');
    debug.style.position = 'absolute';
    debug.style.top = '10px';
    debug.style.left = '10px';
    debug.style.color = 'lime';
    debug.style.fontFamily = 'monospace';
    debug.style.fontSize = '12px';
    debug.style.display = 'block'; // Show debug info by default
    stage.appendChild(debug);

    let frameCount = 0;
    function update() {
        // Toggle Debug with H
        if (state.keys['KeyH']) {
            debug.style.display = debug.style.display === 'none' ? 'block' : 'none';
            state.keys['KeyH'] = false; // Prevent rapid toggling
        }

        frameCount++;
        if (frameCount % 60 === 0) console.log("Game loop running...", state);

        let dx = 0;
        let dy = 0;
        const currentSpeed = state.isRunning ? state.speed * 2 : state.speed;

        // Support both code (KeyW) and key (w)
        if (state.keys['KeyW'] || state.keys['ArrowUp'] || state.keys['w'] || state.keys['W']) dy += currentSpeed;
        if (state.keys['KeyS'] || state.keys['ArrowDown'] || state.keys['s'] || state.keys['S']) dy -= currentSpeed;
        if (state.keys['KeyA'] || state.keys['ArrowLeft'] || state.keys['a'] || state.keys['A']) {
            dx -= currentSpeed;
            state.facingRight = false;
        }
        if (state.keys['KeyD'] || state.keys['ArrowRight'] || state.keys['d'] || state.keys['D']) {
            dx += currentSpeed;
            state.facingRight = true;
        }

        state.isMoving = Math.abs(dx) > 0 || Math.abs(dy) > 0;

        // Update player position
        state.playerY = Math.max(0, Math.min(15, state.playerY + dy));
        
        const margin = 20;
        if (state.playerX + dx > 100 - margin && dx > 0) {
            state.worldX -= dx * 10;
        } else if (state.playerX + dx < margin && dx < 0) {
            state.worldX -= dx * 10;
        } else {
            state.playerX += dx;
        }

        const heartbeat = frameCount % 60 < 30 ? '●' : '○';
        debug.innerText = `${heartbeat} X: ${state.playerX.toFixed(1)}, Y: ${state.playerY.toFixed(1)}, WorldX: ${state.worldX.toFixed(1)}, Moving: ${state.isMoving}`;

        render();
        requestAnimationFrame(update);
    }

    function render() {
        // Player Position & Animation
        player.style.left = `${state.playerX}%`;
        player.style.bottom = `${state.playerY}%`;
        
        // Depth Effect: Scale player based on Y position (back = smaller)
        const scaleBase = 1.0;
        const scaleDepth = 1.0 - (state.playerY / 100);
        const flip = state.facingRight ? 1 : -1;
        player.style.transform = `translate(-50%, 0) scaleX(${flip}) scale(${scaleDepth})`;
        
        if (state.isMoving) {
            player.classList.add('player-walking');
            player.classList.remove('player-idle');
        } else {
            player.classList.add('player-idle');
            player.classList.remove('player-walking');
        }

        // Parallax Layers - Infinite Scroll using backgroundPosition (pixels)
        // We use worldX (as a base pixel value)
        const farMove = state.worldX * 0.2;
        const midMove = state.worldX * 1.5;
        const foreMove = state.worldX * 4.0;

        layerFar.style.backgroundPosition = `${farMove}px center`;
        layerMid.style.backgroundPosition = `${midMove}px center`;
        layerFore.style.backgroundPosition = `${foreMove}px center`;

        // Clear previous transforms (from old mouse parallax code if any)
        layerFar.style.transform = '';
        layerMid.style.transform = '';
        layerFore.style.transform = '';
    }

    // Initialize
    update();

    // Mouse/Touch Support
    stage.addEventListener('mousedown', (e) => {
        const rect = stage.getBoundingClientRect();
        const targetX = ((e.clientX - rect.left) / rect.width) * 100;
        
        // Move towards target
        if (targetX > state.playerX) {
            state.keys['ArrowRight'] = true;
            setTimeout(() => state.keys['ArrowRight'] = false, 300);
        } else {
            state.keys['ArrowLeft'] = true;
            setTimeout(() => state.keys['ArrowLeft'] = false, 300);
        }

        // Toggle Bloom
        bloom.classList.toggle('bloom-active');
    });

    console.log("Noir Fantasy Belt Scroll Demo Initialized");
});
