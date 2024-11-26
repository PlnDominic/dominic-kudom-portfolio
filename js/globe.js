import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from './src/getStarfield.js';
import { drawThreeGeo } from './src/threeGeoJSON.js';

export class Globe {
    constructor() {
        console.log('Initializing Globe...');
        this.scene = new THREE.Scene();
        this.container = document.getElementById('globe-container');
        this.canvas = document.getElementById('globe-canvas');
        
        if (!this.container || !this.canvas) {
            console.error('Required DOM elements not found!');
            return;
        }

        // Define continent colors for both themes
        this.continentColors = {
            dark: {
                'North America': 0xFF6B6B,
                'South America': 0x4ECDC4,
                'Europe': 0x45B7D1,
                'Africa': 0xFFBE0B,
                'Asia': 0x96CEB4,
                'Oceania': 0xFF9F1C,
                'Antarctica': 0xFAFAFA
            },
            light: {
                'North America': 0xE63946,
                'South America': 0x2A9D8F,
                'Europe': 0x1D7A99,
                'Africa': 0xE6A100,
                'Asia': 0x588B7E,
                'Oceania': 0xE67E00,
                'Antarctica': 0xE0E0E0
            }
        };
        
        this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        console.log('Initial theme:', this.currentTheme);

        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createGlobe();
        this.createSunAndClouds();
        this.setupControls();
        this.setupThemeListener();
        
        // Start animation
        this.animate();
    }

    setupCamera() {
        const fov = 60;
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 0.1;
        const far = 10000;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 300);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const pointLight = new THREE.PointLight(0xffffff, 1.0);
        pointLight.position.set(100, 100, 100);
        
        this.scene.add(ambientLight);
        this.scene.add(pointLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 200;
        this.controls.maxDistance = 400;
    }

    setupThemeListener() {
        console.log('Setting up theme listener...');
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Update theme immediately
        this.currentTheme = mediaQuery.matches ? 'dark' : 'light';
        console.log('Theme set to:', this.currentTheme);
        this.updateTheme();

        // Listen for changes
        mediaQuery.addEventListener('change', (e) => {
            console.log('Theme change detected');
            this.currentTheme = e.matches ? 'dark' : 'light';
            console.log('New theme:', this.currentTheme);
            this.updateTheme();
        });
    }

    createSunAndClouds() {
        console.log('Creating sun and clouds...');
        
        // Create Sun
        const sunGeometry = new THREE.SphereGeometry(30, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: this.currentTheme === 'light' ? 1 : 0
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.set(200, 100, -150); // Adjusted position
        this.scene.add(this.sun);
        console.log('Sun created with opacity:', sunMaterial.opacity);

        // Create Sun glow
        const sunGlowGeometry = new THREE.SphereGeometry(35, 32, 32);
        const sunGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFF00,
            transparent: true,
            opacity: this.currentTheme === 'light' ? 0.3 : 0
        });
        this.sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        this.sun.add(this.sunGlow);

        // Create cloud layer
        const cloudGeometry = new THREE.SphereGeometry(105, 32, 32);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: this.currentTheme === 'light' ? 0.3 : 0,
            side: THREE.DoubleSide
        });
        this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.scene.add(this.clouds);
        console.log('Cloud layer created with opacity:', cloudMaterial.opacity);

        // Create cloud particles
        this.cloudParticles = new THREE.Group();
        for (let i = 0; i < 25; i++) {
            const particleGeometry = new THREE.SphereGeometry(3, 8, 8);
            const particleMaterial = new THREE.MeshPhongMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: this.currentTheme === 'light' ? 0.4 : 0
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position particles in a spiral pattern
            const angle = (i / 25) * Math.PI * 2;
            const radius = 110 + Math.random() * 10;
            const height = Math.random() * 40 - 20;
            
            particle.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            particle.scale.set(
                1 + Math.random() * 2,
                1 + Math.random() * 2,
                1 + Math.random() * 2
            );
            
            this.cloudParticles.add(particle);
        }
        this.scene.add(this.cloudParticles);
        console.log('Cloud particles created');
    }

    updateTheme() {
        console.log('Updating theme to:', this.currentTheme);
        const isLight = this.currentTheme === 'light';

        // Update sun
        if (this.sun && this.sun.material) {
            this.sun.material.opacity = isLight ? 1 : 0;
            console.log('Sun opacity set to:', this.sun.material.opacity);
            
            if (this.sunGlow && this.sunGlow.material) {
                this.sunGlow.material.opacity = isLight ? 0.3 : 0;
                console.log('Sun glow opacity set to:', this.sunGlow.material.opacity);
            }
        }

        // Update clouds
        if (this.clouds && this.clouds.material) {
            this.clouds.material.opacity = isLight ? 0.3 : 0;
            console.log('Cloud layer opacity set to:', this.clouds.material.opacity);
        }

        // Update cloud particles
        if (this.cloudParticles) {
            this.cloudParticles.children.forEach((particle, index) => {
                if (particle.material) {
                    particle.material.opacity = isLight ? 0.4 : 0;
                }
            });
            console.log('Cloud particles updated');
        }

        // Update lighting
        this.scene.traverse((child) => {
            if (child instanceof THREE.AmbientLight) {
                child.intensity = isLight ? 0.8 : 0.6;
            }
            if (child instanceof THREE.PointLight) {
                child.intensity = isLight ? 1.2 : 1.0;
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Rotate the globe
        if (this.globe) {
            this.globe.rotation.y += 0.001;
        }
        
        // Rotate clouds
        if (this.clouds) {
            this.clouds.rotation.y += 0.0005;
        }

        // Rotate cloud particles
        if (this.cloudParticles) {
            this.cloudParticles.rotation.y += 0.0003;
        }
        
        // Animate sun glow
        if (this.sunGlow) {
            const time = Date.now() * 0.001;
            const scale = 1 + Math.sin(time) * 0.1;
            this.sunGlow.scale.set(scale, scale, scale);
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    createGlobe() {
        // Create Earth sphere
        const sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        
        this.globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.globe);
        
        // Create wireframe
        const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(sphereGeometry),
            new THREE.LineBasicMaterial({
                color: 0x4ECDC4,
                transparent: true,
                opacity: 0.1
            })
        );
        this.globe.add(wireframe);
        
        // Add stars
        const stars = getStarfield({ numStars: 5000, fog: false });
        this.scene.add(stars);
        this.stars = stars;
    }
}

// Initialize the globe
new Globe();
