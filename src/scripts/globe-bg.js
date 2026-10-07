(function () {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const PARTICLE_COUNT = 1800;
    const particles = [];
    let angle = 0;
    let animId;

    const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = 2 * Math.PI * Math.random();
        particles.push({
            x: Math.sin(theta) * Math.cos(phi),
            y: Math.sin(theta) * Math.sin(phi),
            z: Math.cos(theta),
        });
    }

    // Órbitas: raio relativo ao globo, duração em ms, ícones com ângulo inicial
    const GLOBE_SCALE = 0.22; // fração da menor dimensão da tela
    const orbits = [
        { radiusMult: 1.45, duration: 18000, reverse: false, icons: [
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg', angle: -60 },
            { src: 'https://cdn.21st.dev/assets/mirror/fd/fd242636f2a6c8ce90ddf51d45234a7add1a7262d0d517ef551a290d99fdb620.svg', angle: 0 },
            { src: 'https://cdn.21st.dev/assets/mirror/d2/d27b280b7858bb5b89008eb325b9d4bdbd93ee1df92f8210247da4abc8a9c1ce.svg', angle: 60 },
        ]},
        { radiusMult: 1.85, duration: 24000, reverse: true, icons: [
            { src: 'https://cdn.21st.dev/assets/mirror/cd/cdf9d8e18269a990e7854c0255d64513e5f8b6052b8580dd8f24480a85ec130a.svg', angle: 0 },
            { src: 'https://cdn.21st.dev/assets/mirror/83/83a5f27a428146febbe4672046c78bfa796a7931aebab5705655cab4fffb5794.svg', angle: -90 },
        ]},
        { radiusMult: 2.2, duration: 30000, reverse: false, icons: [
            { src: 'https://cdn.21st.dev/assets/mirror/b5/b58af96de173670c64254e6d93ca4e4daf57b2637cc4fb90529f3232ea1bdf3f.svg', angle: -60 },
            { src: 'https://cdn.21st.dev/assets/mirror/a2/a21f0f00193ad70e39d2d82b6437464853f77bf6569adeb1ecc6d1f7bc0f5226.svg', angle: 0 },
            { src: 'https://cdn.21st.dev/assets/mirror/96/96c6123c466766d6714874ae77ba88be923c98313f09bbd72c9860ff26797d53.svg', angle: 60 },
        ]},
    ];

    // Pré-carrega imagens
    const imgCache = {};
    orbits.forEach(o => o.icons.forEach(ic => {
        const img = new Image();
        img.src = ic.src;
        imgCache[ic.src] = img;
    }));

    const draw = (ts) => {
        const w = canvas.width;
        const h = canvas.height;
        const globeRadius = Math.min(w, h) * GLOBE_SCALE;

        ctx.clearRect(0, 0, w, h);
        angle += 0.003;

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        // --- Globo de partículas (centro inferior, espelhado como no original) ---
        const cx = w / 2;
        const cy = h;  // centro do globo fica na base da tela (efeito planeta emergindo)

        for (const p of particles) {
            const x3d = p.x * cosA - p.z * sinA;
            const z3d = p.x * sinA + p.z * cosA;
            const y3d = p.y;

            const perspective = 2.2 / (2.2 + z3d);
            const px = cx + x3d * globeRadius * perspective;
            const py = cy + y3d * globeRadius * perspective;

            const depth = (z3d + 1) / 2;
            const alpha = 0.15 + depth * 0.7;
            const size = (0.8 + depth * 1.0) * perspective;

            const r = Math.round(80 + depth * 140);
            const g = Math.round(120 + depth * 120);
            const b = Math.round(200 + depth * 55);

            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
            ctx.fill();
        }

        // --- Órbitas ---
        const ICON_SIZE = Math.max(24, Math.min(36, w * 0.03));
        const ICON_HALF = ICON_SIZE / 2;

        orbits.forEach(orbit => {
            const orbitRadius = globeRadius * orbit.radiusMult;
            const elapsed = ts % orbit.duration;
            const baseAngle = (elapsed / orbit.duration) * Math.PI * 2 * (orbit.reverse ? -1 : 1);

            // Desenha anel
            ctx.beginPath();
            ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Ícones + espelhados (+ 180°)
            const allIcons = [
                ...orbit.icons.map(ic => ({ ...ic })),
                ...orbit.icons.map(ic => ({ ...ic, angle: ic.angle + 180 })),
            ];

            allIcons.forEach(ic => {
                const a = baseAngle + (ic.angle * Math.PI / 180);
                const ix = cx + Math.cos(a) * orbitRadius;
                const iy = cy + Math.sin(a) * orbitRadius;

                const normalAngle = ((ic.angle % 360) + 360) % 360;
                const originalIcon = orbit.icons.find(o => ((o.angle % 360) + 360) % 360 === normalAngle || ((o.angle + 180) % 360 + 360) % 360 === normalAngle) || orbit.icons[0];
                const image = imgCache[originalIcon.src];

                // Fundo do ícone
                ctx.beginPath();
                ctx.arc(ix, iy, ICON_HALF + 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(10,10,26,0.85)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                ctx.lineWidth = 1;
                ctx.stroke();

                if (image && image.complete) {
                    ctx.drawImage(image, ix - ICON_HALF, iy - ICON_HALF, ICON_SIZE, ICON_SIZE);
                }
            });
        });

        animId = requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
})();