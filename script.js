// Global Variables
let cursorX = 0;
let cursorY = 0;
let trailX = 0;
let trailY = 0;
let activeWindows = [];
let terminalHistory = [];
let terminalHistoryIndex = -1;
let wallpapers = [];
let currentWallpaper = 0;
let particles = [];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');

    // Initialize all systems
    initializeCursor();
    initializeParticleBackground();
    initializeClock();
    initializeTerminal();
    initializeWallpapers();
    initializeBootSequence(); // This should be last

    // Make windows draggable
    makeWindowsDraggable();

    // Handle clicks outside windows
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.power-menu') && !e.target.closest('.power-menu-popup')) {
            closePowerMenu();
        }
        if (!e.target.closest('.app-launcher') && !e.target.closest('.app-menu')) {
            closeAppMenu();
        }
    });
});

// Enhanced Cursor System
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');

    if (!cursor || !cursorTrail) return;

    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;

        cursor.style.left = cursorX - 12 + 'px';
        cursor.style.top = cursorY - 12 + 'px';
    });

    // Smooth trail animation
    function animateTrail() {
        trailX += (cursorX - trailX) * 0.15;
        trailY += (cursorY - trailY) * 0.15;

        cursorTrail.style.left = trailX - 6 + 'px';
        cursorTrail.style.top = trailY - 6 + 'px';

        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    console.log('Cursor initialized');
}

// Enhanced Particle Background
function initializeParticleBackground() {
    const canvas = document.getElementById('particle-background');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#89b4fa' : '#cba6f7'
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + '80';
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
    console.log('Particle background initialized');
}

// Clock
function initializeClock() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const currentTimeEl = document.getElementById('current-time');
        if (currentTimeEl) {
            currentTimeEl.textContent = timeString;
        }
    }

    updateTime();
    setInterval(updateTime, 1000);
    console.log('Clock initialized');
}

// Wallpaper System
function initializeWallpapers() {
    wallpapers = [
        {
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
            title: 'Mountain Vista',
            author: 'Unsplash'
        },
        {
            url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&q=80',
            title: 'Ocean Sunset',
            author: 'Unsplash'
        },
        {
            url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80',
            title: 'Forest Path',
            author: 'Unsplash'
        },
	{
	    url: 'https://images.unsplash.com/photo-1680055197785-4275f17adba6?w=1920&h=1080&fit=crop&q=80',
	    title: 'Arch (Not the OS)',
	    author: 'Unsplash'
	},
	{
	    url: 'https://images.unsplash.com/photo-1635488591151-c7a12939669b?w=1920&h=1080&fit=crop&q=80',
	    title: 'NFS',
	    author: 'Unsplash'
	},
	{
	    url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop&q=80',
	    title: 'Anime',
	    author: 'Unsplash'
	}
    ];

    setWallpaper(wallpapers[5].url);
    console.log('Wallpapers initialized');
}

function loadWallpaperGrid() {
    const grid = document.getElementById('wallpaper-grid');
    if (!grid) return;

    grid.innerHTML = '';

    wallpapers.forEach((wallpaper, index) => {
        const item = document.createElement('div');
        item.className = 'wallpaper-item' + (index === currentWallpaper ? ' active' : '');
        item.onclick = () => selectWallpaper(index);

        item.innerHTML = '<img src="' + wallpaper.url + '" alt="' + wallpaper.title + '" loading="lazy"><div class="wallpaper-overlay"><div class="wallpaper-title">' + wallpaper.title + '</div></div>';

        grid.appendChild(item);
    });
}

function selectWallpaper(index) {
    currentWallpaper = index;
    setWallpaper(wallpapers[index].url);
    updateWallpaperGrid();
    showNotification('Wallpaper Changed', 'Applied "' + wallpapers[index].title + '"', 'success');
}

function setWallpaper(url) {
    const backgroundContainer = document.querySelector('.background-image-layer');
    if (backgroundContainer) {
        backgroundContainer.style.backgroundImage = 'url("' + url + '")';
        backgroundContainer.style.backgroundSize = 'cover';
        backgroundContainer.style.backgroundPosition = 'center';
        backgroundContainer.style.backgroundRepeat = 'no-repeat';
    }
}

function updateWallpaperGrid() {
    const items = document.querySelectorAll('.wallpaper-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentWallpaper);
    });
}

function setRandomWallpaper() {
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    selectWallpaper(randomIndex);
}

function refreshWallpapers() {
    showNotification('Refreshing...', 'Loading new wallpapers', 'info');
    setTimeout(() => {
        loadWallpaperGrid();
        showNotification('Refreshed', 'Wallpaper gallery updated', 'success');
    }, 1000);
}

// Settings System
function openSettings() {
    openWindow('settings-window');
}

function showSettingsTab(tabName) {
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) targetTab.classList.add('active');

    event.target.classList.add('active');
}

function setTheme(themeName) {
    document.body.className = themeName;

    document.querySelectorAll('.color-scheme').forEach(scheme => {
        scheme.classList.remove('active');
    });
    const targetScheme = document.querySelector('[data-theme="' + themeName + '"]');
    if (targetScheme) targetScheme.classList.add('active');

    showNotification('Theme Changed', 'Applied ' + themeName + ' theme', 'success');
}

// App Launcher
function toggleAppMenu() {
    const appMenu = document.getElementById('app-menu');
    if (appMenu) {
        appMenu.classList.toggle('show');
    }
}

function closeAppMenu() {
    const appMenu = document.getElementById('app-menu');
    if (appMenu) {
        appMenu.classList.remove('show');
    }
}

// Terminal Commands
const terminalCommands = {
    help: () => {
        return 'Available commands:\n  help      - Show this help message\n  ls        - List files\n  whoami    - Display current user\n  uname     - System information\n  neofetch  - System information with ASCII art\n  clear     - Clear terminal\n  pwd       - Show current directory\n  echo      - Echo text\n  date      - Show current date and time\n  uptime    - Show system uptime\n  history   - Show command history\n  wallpaper - Change wallpaper\n  theme     - Change color theme\n  exit      - Close terminal';
    },

    ls: () => {
        return 'total 12\ndrwxr-xr-x  6 randomboi404 users  4096 Sep  9 17:31 .\ndrwxr-xr-x  3 root        root   4096 Sep  9 16:52 ..\n-rw-r--r--  1 randomboi404 users   220 Sep  9 16:52 .bash_logout\n-rw-r--r--  1 randomboi404 users  3771 Sep  9 16:52 .bashrc\n-rw-r--r--  1 randomboi404 users   807 Sep  9 16:52 .profile\ndrwxr-xr-x  2 randomboi404 users  4096 Sep  9 17:31 Desktop\ndrwxr-xr-x  2 randomboi404 users  4096 Sep  9 16:53 Documents\ndrwxr-xr-x  2 randomboi404 users  4096 Sep  9 16:53 Downloads\ndrwxr-xr-x  2 randomboi404 users  4096 Sep  9 17:31 Music\ndrwxr-xr-x  2 randomboi404 users  4096 Sep  9 16:53 Pictures\ndrwxr-xr-x  3 randomboi404 users  4096 Sep  9 16:53 Projects\n-rw-r--r--  1 randomboi404 users    96 Sep  9 16:53 README.md';
    },

    whoami: () => 'randomboi404',
    pwd: () => '/home/randomboi404',
    uname: () => 'Linux arch 6.20.4-5-web x86_64 GNU/Linux',
    clear: () => {
        const output = document.getElementById('terminal-output');
        if (output) output.innerHTML = '';
        return '';
    },
    date: () => new Date().toString(),
    uptime: () => 'up 14:48, 1 user, load average: 0.18, 0.25, 0.29',

    neofetch: () => {
        return '                   -`                    randomboi404@arch\n                  .o+`                   -----------------\n                 `ooo/                   OS: Arch Linux x86_64\n                `+oooo:                  Host: Custom Build\n               `+oooooo:                 Kernel: 6.5.9-arch2-1\n               -+oooooo+:                Uptime: 14 hours, 48 mins\n             `/:-:++oooo+:               Packages: 358 (pacman)\n            `/++++/+++++++:              Shell: zsh 5.9\n           `/++++++++++++++:             Resolution: Depends on your screen\n          `/+++ooooooooooooo/`           WM: Hyprland Web Edition\n         ./ooosssso++osssssso+`          OS Age: 420 Days\n        .oossssso-````/ossssss+`         Portfolio Version: 1.0\n       -osssssso.      :ssssssso.        Terminal: Web Terminal\n      :osssssss/        osssso+++.       CPU: Your Browser Engine\n     /ossssssss/        +ssssooo/-       GPU: Hardware Accelerated\n   `/ossssso+/:-        -:/+osssso+-     Memory: Optimized for Web';
    },

    wallpaper: (args) => {
        const action = args[0];
        switch(action) {
            case 'random':
                setRandomWallpaper();
                return 'Applied random wallpaper';
            case 'list':
                return wallpapers.map((w, i) => (i + 1) + '. ' + w.title).join('\n');
            case 'set':
                const index = parseInt(args[1]) - 1;
                if (index >= 0 && index < wallpapers.length) {
                    selectWallpaper(index);
                    return 'Applied wallpaper: ' + wallpapers[index].title;
                } else {
                    return 'Invalid wallpaper index. Use "wallpaper list" to see available options.';
                }
            default:
                return 'Usage: wallpaper [random|list|set <number>]';
        }
    },

    theme: (args) => {
        const themeName = args[0];
        const themes = ['catppuccin-mocha', 'gruvbox-dark', 'nord'];

        if (!themeName) {
            return 'Available themes: ' + themes.join(', ');
        }

        if (themes.includes(themeName)) {
            setTheme(themeName);
            return 'Applied ' + themeName + ' theme';
        } else {
            return 'Unknown theme. Available: ' + themes.join(', ');
        }
    },

    echo: (args) => args.join(' '),

    exit: () => {
        closeWindow('terminal-window');
        return '';
    }
};

// Initialize terminal
function initializeTerminal() {
    const terminalInput = document.getElementById('terminal-input');

    
addToTerminal('Welcome to Portfolio OS which is Arch Linux Enhanced Edition!\n\n' +
'██╗  ██╗ ██████╗ ██╗  ██╗\n' +
'██║  ██║██╔═████╗██║  ██║\n' +
'███████║██║██╔██║███████║\n' +
'╚════██║████╔╝██║╚════██║\n' +
'     ██║╚██████╔╝     ██║\n' +
'     ╚═╝ ╚═════╝      ╚═╝\n\n' +
'Last login: ' + new Date().toLocaleString() + '\nType "help" to see available commands.');


    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    terminalHistory.push(command);
                    terminalHistoryIndex = terminalHistory.length;
                    executeCommand(command);
                }
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (terminalHistoryIndex > 0) {
                    terminalHistoryIndex--;
                    terminalInput.value = terminalHistory[terminalHistoryIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (terminalHistoryIndex < terminalHistory.length - 1) {
                    terminalHistoryIndex++;
                    terminalInput.value = terminalHistory[terminalHistoryIndex];
                } else {
                    terminalHistoryIndex = terminalHistory.length;
                    terminalInput.value = '';
                }
            }
        });
    }

    console.log('Terminal initialized');
}

function executeCommand(commandLine) {
    const args = commandLine.split(' ');
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    addToTerminal('[randomboi404@arch ~]$ ' + commandLine);

    if (terminalCommands[command]) {
        const output = terminalCommands[command](commandArgs);
        if (output) {
            addToTerminal(output);
        }
    } else {
        addToTerminal('zsh: command not found: ' + command);
    }

    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

function addToTerminal(text) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;

    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    terminalOutput.appendChild(line);
}

// FIXED Boot Sequence
function initializeBootSequence() {
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
        console.log('Starting boot sequence...');

        // Wait for 3 seconds, then hide loading screen
        setTimeout(() => {
            loadingScreen.style.transition = 'opacity 0.5s ease';
            loadingScreen.style.opacity = '0';

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('Boot sequence complete, desktop loaded');
                showNotification('System Ready', 'Welcome to randomboi404\'s enhanced workspace!', 'success');
            }, 500);
        }, 3000);
    } else {
        console.log('Loading screen not found');
    }
}

// Window Management
function openWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    window.classList.add('active');
    if (!activeWindows.includes(windowId)) {
        activeWindows.push(windowId);
    }

    const maxZ = Math.max(...activeWindows.map(id => {
        const el = document.getElementById(id);
        return el ? parseInt(getComputedStyle(el).zIndex) || 100 : 100;
    }));

    window.style.zIndex = maxZ + 1;

    if (windowId === 'terminal-window') {
        setTimeout(() => {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) terminalInput.focus();
        }, 300);
    } else if (windowId === 'settings-window') {
        loadWallpaperGrid();
    }
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    window.classList.remove('active');
    activeWindows = activeWindows.filter(id => id !== windowId);
}

function minimizeWindow(windowId) {
    closeWindow(windowId);
    const windowName = windowId.replace('-window', '').replace('-', ' ');
    showNotification('Window Minimized', windowName + ' minimized to taskbar', 'info');
}

function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    if (window.classList.contains('maximized')) {
        window.classList.remove('maximized');
        window.style.top = '';
        window.style.left = '';
        window.style.width = '';
        window.style.height = '';
    } else {
        window.classList.add('maximized');
        window.style.top = '40px';
        window.style.left = '0';
        window.style.width = '100vw';
        window.style.height = 'calc(100vh - 40px)';
    }
}

// Desktop Icon Actions
function openTerminal() {
    openWindow('terminal-window');
}

function openAbout() {
    openWindow('about-window');
}

function openProjects() {
    openWindow('projects-window');
}

function openContact() {
    openWindow('contact-window');
}

function openRice() {
    openWindow('rice-window');
}

// Make windows draggable
function makeWindowsDraggable() {
    const windows = document.querySelectorAll('.window');

    windows.forEach(window => {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        if (header) {
            header.addEventListener('mousedown', function(e) {
                if (e.target.classList.contains('window-btn')) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = window.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;

                window.style.zIndex = 1000;
            });
        }

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newLeft = Math.max(0, Math.min(window.innerWidth - window.offsetWidth, initialLeft + deltaX));
            const newTop = Math.max(40, Math.min(window.innerHeight - window.offsetHeight, initialTop + deltaY));

            window.style.left = newLeft + 'px';
            window.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    });
}

// Power Menu
function togglePowerMenu() {
    const powerMenu = document.getElementById('power-menu');
    if (powerMenu) {
        powerMenu.classList.toggle('show');
    }
}

function closePowerMenu() {
    const powerMenu = document.getElementById('power-menu');
    if (powerMenu) {
        powerMenu.classList.remove('show');
    }
}

function systemAction(action) {
    closePowerMenu();

    let message = '';
    switch(action) {
        case 'reboot':
	    setTimeout(() => {
	        location.reload();
		}, 5000);
            message = 'System rebooting... See you in a moment!';
	    
            break;
    }

    showNotification('System Action', message, 'info');
}

// Social Links
function openLink(url) {
    window.open(url, '_blank');
    showNotification('Link Opened', 'Opened link in new tab', 'success');
}

function copyDiscord() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText('randomboiii5').then(() => {
            showNotification('Copied!', 'Discord username copied to clipboard', 'success');
        }).catch(() => {
            showNotification('Copy Failed', 'Could not copy to clipboard', 'error');
        });
    } else {
        showNotification('Discord', 'Username: randomboiii5 (ID: 806782240851886091)', 'info');
    }
}

// Notifications
function showNotification(title, message, type) {
    const notificationArea = document.getElementById('notifications');
    if (!notificationArea) return;

    const notification = document.createElement('div');
    notification.className = 'notification ' + (type || 'info');

    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';

    notification.innerHTML = '<div style="display: flex; align-items: center; gap: 8px; font-weight: bold; margin-bottom: 4px;"><span style="font-size: 16px;">' + icon + '</span>' + title + '</div><div style="font-size: 13px; color: var(--subtext1);">' + message + '</div>';

    notificationArea.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.95)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Project Actions
function openProject(projectName) {
    if (projectName === 'eww') {
        window.open('https://github.com/randomboi404/eww', '_blank');
        showNotification('Project Opened', 'EWW repository opened in new tab', 'success');
    }
}

// Add error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

console.log('Script loaded successfully');
