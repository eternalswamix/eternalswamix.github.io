// Particles Config
const initParticles = () => {
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: ["#8B5CF6", "#0EA5E9"] },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#8B5CF6",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
};

// Custom Cursor Logic
const initCursor = () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards" });
    });
};

// Hover effects for cursor
const updateCursorHover = () => {
    const cursorOutline = document.querySelector('.cursor-outline');
    if (!cursorOutline) return;

    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .logo');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--primary)';
        });
    });
};

// Toggle Mobile Menu
const initMobileMenu = () => {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            menuBtn.innerHTML = navLinks.classList.contains('open')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('open');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
};

// Scroll Reveal Animation
const revealOnScroll = () => {
    const revealElements = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 80;

    revealElements.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

// Active Link Highlighting
const highlightNav = () => {
    const navItems = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        item.classList.remove('active');
        if (itemHref === currentPath) {
            item.classList.add('active');
        }
    });
};

// Dynamic Skills Loading
const fetchSkills = async () => {
    const skillsContainer = document.querySelector('.skills-container');
    if (!skillsContainer) return;

    try {
        const gistUrl = 'https://gist.githubusercontent.com/eternalswamix/25fe3ea0d30094df8117ce6bbeb39736/raw/portfolio-skills.json';
        const response = await fetch(`${gistUrl}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Skills fetch failed');

        const data = await response.json();
        if (data && data.skills) {
            skillsContainer.innerHTML = '';
            data.skills.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.className = 'skill-card reveal';
                skillCard.innerHTML = `
                    <i class="${skill.icon} skill-icon"></i>
                    <h3 class="skill-title">${skill.category}</h3>
                    <ul class="skill-list">
                        ${skill.tags.map(tag => `<li class="skill-tag">${tag}</li>`).join('')}
                    </ul>
                `;
                skillsContainer.appendChild(skillCard);
            });
            setTimeout(revealOnScroll, 100);
            updateCursorHover();
        }
    } catch (error) {
        console.error(error);
        skillsContainer.innerHTML = '<p style="color: var(--accent);">Error loading skills.</p>';
    }
};

// Dynamic Projects Loading
const fetchProjects = async () => {
    const projectsGrid = document.querySelector('.projects-grid');
    const projectHeader = document.querySelector('#projects .section-header');
    if (!projectsGrid) return;

    try {
        const gistUrl = 'https://gist.githubusercontent.com/eternalswamix/28799352555e495550e62812f2b5e199/raw/portfolio-projects.json';
        const response = await fetch(`${gistUrl}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Projects fetch failed');

        const data = await response.json();
        if (data.section && projectHeader) {
            projectHeader.innerHTML = `
                <span class="section-subtitle">${data.section.subtitle}</span>
                <h2 class="section-title">${data.section.title}</h2>
            `;
        }

        if (data && data.projects) {
            projectsGrid.innerHTML = '';
            data.projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card reveal';
                projectCard.innerHTML = `
                    <div class="project-img-container">
                        <img src="${project.image}" alt="${project.title}" class="project-img">
                    </div>
                    <div class="project-content">
                        <span class="project-tagline">${project.tagline}</span>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-desc">${project.description}</p>
                        <div class="project-links">
                            ${project.buttons.primary ? `<a href="${project.buttons.primary.url}" target="_blank" class="project-link primary-btn"><i class="fab fa-github"></i> ${project.buttons.primary.label}</a>` : ''}
                            ${project.buttons.secondary ? `<a href="${project.buttons.secondary.url}" target="_blank" class="project-link secondary-btn"><i class="fas fa-external-link-alt"></i> ${project.buttons.secondary.label}</a>` : ''}
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(projectCard);
            });
            setTimeout(revealOnScroll, 100);
            updateCursorHover();
        }
    } catch (error) {
        console.error(error);
        projectsGrid.innerHTML = '<p style="color: var(--accent);">Error loading projects.</p>';
    }
};

// Dynamic Resume Loading from Gist
const fetchResume = async () => {
    const resumeContainer = document.querySelector('.resume-container');
    const downloadCheckbox = document.getElementById('download-checkbox');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const resumeLoader = document.getElementById('resume-loader');

    if (!resumeContainer) return;

    let resolvedDownloadUrl = null;

    try {
        // Loader removed as requested

        const gistUrl = 'https://gist.githubusercontent.com/eternalswamix/28799352555e495550e62812f2b5e199/raw/portfolio-projects.json';
        const response = await fetch(`${gistUrl}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Config fetch failed');

        const data = await response.json();
        const resumeUrl = data.resumeConfig ? data.resumeConfig.url : null;

        if (resumeUrl) {
            const previewUrl = resumeUrl.replace('/view?usp=sharing', '/preview').replace('/view', '/preview');

            resolvedDownloadUrl = resumeUrl;
            if (resumeUrl.includes('drive.google.com')) {
                const fileId = resumeUrl.match(/\/d\/(.+?)\//);
                if (fileId && fileId[1]) {
                    resolvedDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId[1]}`;
                }
            }

            // Update external link buttons with the resume URL, no iframe injection.
            if (fullscreenBtn) fullscreenBtn.href = resumeUrl;
        }
    } catch (error) {
        console.error('Error loading resume config:', error);
    }

    // Wire up Sync-Download animation button
    if (downloadCheckbox && resolvedDownloadUrl) {
        downloadCheckbox.addEventListener('change', function () {
            if (this.checked) {
                // Wait for animation to complete (~4s), then trigger real download
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = resolvedDownloadUrl;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }, 4000);
            }
        });
    }
};

// Navbar Scroll Effect
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

// ChromaGrid Interactive Engine
const initChromaGrid = () => {
    const grid = document.getElementById('chromaGrid');
    const glow = document.getElementById('chromaGlow');
    if (!grid || !glow) return;

    // Apply per-card CSS custom properties from data attributes
    const cards = grid.querySelectorAll('.chroma-card');
    cards.forEach(card => {
        const borderColor = card.dataset.border;
        const gradient = card.dataset.gradient;
        if (borderColor) card.style.setProperty('--card-border', borderColor);
        if (gradient) card.style.setProperty('--card-gradient', gradient);
    });

    // Mouse-tracking glow with damping
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    const damping = 0.45;

    grid.addEventListener('mousemove', (e) => {
        const rect = grid.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    const animateGlow = () => {
        glowX += (mouseX - glowX) * damping;
        glowY += (mouseY - glowY) * damping;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    };
    animateGlow();

    // Dynamic glow color based on nearest card
    grid.addEventListener('mousemove', (e) => {
        let closestCard = null;
        let closestDist = Infinity;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
            if (dist < closestDist) {
                closestDist = dist;
                closestCard = card;
            }
        });

        if (closestCard && closestDist < 300) {
            const color = closestCard.dataset.border || '#8B5CF6';
            glow.style.background = `radial-gradient(circle, ${color}26 0%, transparent 70%)`;
        }
    });
};

// LightPillar - WebGL shader-based volumetric light effect (Vanilla JS)
const initLightPillar = () => {
    const container = document.getElementById('light-pillar');
    if (!container || typeof THREE === 'undefined') return;

    // Config — tuned for premium subtle background effect
    const topColor = '#7C3AED';
    const bottomColor = '#0EA5E9';
    const intensity = 0.7; // Reduced for better text contrast
    const rotationSpeed = 0.3;
    const interactive = false;
    const glowAmount = 0.008; // More diffused glow
    const pillarWidth = 3.0;
    const pillarHeight = 0.4;
    const noiseIntensity = 0.3;
    const pillarRotation = 0;
    const quality = 'high';

    // WebGL check
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
        container.className = 'light-pillar-fallback';
        container.textContent = '';
        return;
    }

    container.className = 'light-pillar-container';
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    let effectiveQuality = quality;
    if (isLowEnd && quality === 'high') effectiveQuality = 'medium';
    if (isMobile && quality !== 'low') effectiveQuality = 'low';

    const qualitySettings = {
        low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
        medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
        high: { iterations: 80, waveIterations: 4, pixelRatio: Math.min(window.devicePixelRatio, 2), precision: 'highp', stepMultiplier: 1.0 }
    };
    const settings = qualitySettings[effectiveQuality] || qualitySettings.medium;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: effectiveQuality === 'high' ? 'high-performance' : 'low-power',
            precision: settings.precision,
            stencil: false,
            depth: false
        });
    } catch (e) {
        return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(settings.pixelRatio);
    container.appendChild(renderer.domElement);

    const parseColor = (hex) => {
        const color = new THREE.Color(hex);
        return new THREE.Vector3(color.r, color.g, color.b);
    };

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        precision ${settings.precision} float;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform float uIntensity;
        uniform bool uInteractive;
        uniform float uGlowAmount;
        uniform float uPillarWidth;
        uniform float uPillarHeight;
        uniform float uNoiseIntensity;
        uniform float uRotCos;
        uniform float uRotSin;
        uniform float uPillarRotCos;
        uniform float uPillarRotSin;
        uniform float uWaveSin;
        uniform float uWaveCos;
        varying vec2 vUv;

        const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
        const int MAX_ITER = ${settings.iterations};
        const int WAVE_ITER = ${settings.waveIterations};

        void main() {
            vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
            uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

            vec3 ro = vec3(0.0, 0.0, -10.0);
            vec3 rd = normalize(vec3(uv, 1.0));

            float rotC = uRotCos;
            float rotS = uRotSin;
            if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
                float a = uMouse.x * 6.283185;
                rotC = cos(a);
                rotS = sin(a);
            }

            vec3 col = vec3(0.0);
            float t = 0.1;

            for(int i = 0; i < MAX_ITER; i++) {
                vec3 p = ro + rd * t;
                p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

                vec3 q = p;
                q.y = p.y * uPillarHeight + uTime;

                float freq = 1.0;
                float amp = 1.0;
                for(int j = 0; j < WAVE_ITER; j++) {
                    q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
                    q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
                    freq *= 2.0;
                    amp *= 0.5;
                }

                float d = length(cos(q.xz)) - 0.2;
                float bound = length(p.xz) - uPillarWidth;
                float k = 4.0;
                float h = max(k - abs(d - bound), 0.0);
                d = max(d, bound) + h * h * 0.0625 / k;
                d = abs(d) * 0.15 + 0.01;

                float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
                col += mix(uBottomColor, uTopColor, grad) / d;

                t += d * STEP_MULT;
                if(t > 50.0) break;
            }

            float widthNorm = uPillarWidth / 3.0;
            col = tanh(col * uGlowAmount / widthNorm);

            col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;

            gl_FragColor = vec4(col * uIntensity, 1.0);
        }
    `;

    const pillarRotRad = (pillarRotation * Math.PI) / 180;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(width, height) },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uTopColor: { value: parseColor(topColor) },
            uBottomColor: { value: parseColor(bottomColor) },
            uIntensity: { value: intensity },
            uInteractive: { value: interactive },
            uGlowAmount: { value: glowAmount },
            uPillarWidth: { value: pillarWidth },
            uPillarHeight: { value: pillarHeight },
            uNoiseIntensity: { value: noiseIntensity },
            uRotCos: { value: 1.0 },
            uRotSin: { value: 0.0 },
            uPillarRotCos: { value: Math.cos(pillarRotRad) },
            uPillarRotSin: { value: Math.sin(pillarRotRad) },
            uWaveSin: { value: Math.sin(0.4) },
            uWaveCos: { value: Math.cos(0.4) }
        },
        transparent: true,
        depthWrite: false,
        depthTest: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let timeVal = 0;
    let lastTime = performance.now();
    const targetFPS = effectiveQuality === 'low' ? 30 : 60;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime) => {
        const deltaTime = currentTime - lastTime;
        if (deltaTime >= frameTime) {
            timeVal += 0.016 * rotationSpeed;
            material.uniforms.uTime.value = timeVal;
            material.uniforms.uRotCos.value = Math.cos(timeVal * 0.3);
            material.uniforms.uRotSin.value = Math.sin(timeVal * 0.3);
            renderer.render(scene, camera);
            lastTime = currentTime - (deltaTime % frameTime);
        }
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            material.uniforms.uResolution.value.set(w, h);
        }, 150);
    }, { passive: true });
};

// ClickSpark - Canvas-based click spark effect (Vanilla JS)
const initClickSpark = () => {
    const sparkColor = '#fff';
    const sparkSize = 10;
    const sparkRadius = 15;
    const sparkCount = 8;
    const duration = 400;
    const extraScale = 1.0;

    const canvas = document.createElement('canvas');
    canvas.className = 'click-spark-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let sparks = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const easeOut = (t) => t * (2 - t);

    const draw = (timestamp) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sparks = sparks.filter(spark => {
            const elapsed = timestamp - spark.startTime;
            if (elapsed >= duration) return false;

            const progress = elapsed / duration;
            const eased = easeOut(progress);

            const distance = eased * sparkRadius * extraScale;
            const lineLength = sparkSize * (1 - eased);

            const x1 = spark.x + distance * Math.cos(spark.angle);
            const y1 = spark.y + distance * Math.sin(spark.angle);
            const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
            const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

            ctx.strokeStyle = sparkColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            return true;
        });

        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);

    document.addEventListener('click', (e) => {
        const now = performance.now();
        const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
            x: e.clientX,
            y: e.clientY,
            angle: (2 * Math.PI * i) / sparkCount,
            startTime: now
        }));
        sparks.push(...newSparks);
    });
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursor();
    initMobileMenu();
    highlightNav();
    fetchSkills();
    fetchProjects();
    fetchResume();
    initNavbarScroll();
    initChromaGrid();
    initLightPillar();
    initClickSpark();
    revealOnScroll();
    updateCursorHover();

    // Feedback Studio logic
    const closeFeedback = document.querySelector('.feedback-studio .btn-close');
    if (closeFeedback) {
        closeFeedback.addEventListener('click', () => {
            document.querySelector('.feedback-studio').style.display = 'none';
        });
    }
});

window.addEventListener('scroll', revealOnScroll);
