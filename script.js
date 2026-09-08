class VideoPlayer {
    constructor() {
        this.videoPlayer1 = document.getElementById('videoPlayer1');
        this.videoPlayer2 = document.getElementById('videoPlayer2');
        this.descriptionElement = document.getElementById('videoDescription');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.playPauseButton = document.getElementById('playPauseButton');
        this.muteButton = document.getElementById('muteButton');
        this.menuToggleButton = document.getElementById('menuToggleButton');
        this.chapterMenu = document.getElementById('chapterMenu');
        this.spinner = document.getElementById('spinner');
        this.errorOverlay = document.getElementById('errorOverlay');
        this.retryButton = document.getElementById('retryButton');

        this.videos = [
            { src: 'videa/sestava-8-pohybu.mp4', description: 'Sestava 8 pohybů' },
            { src: 'videa/zvedani-rukou.mp4', description: 'Zvedání rukou' },
            { src: 'videa/zacatek-osmicky.mp4', description: 'Začátek osmičky' },
            { src: 'videa/zacatek-trinactky.mp4', description: 'Začátek třináctky' },
            { src: 'videa/13-forem.mp4', description: '13 forem' },
            { src: 'videa/24-forem.mp4', description: '24 forem' },
            { src: 'videa/meditace-dlane.mp4', description: 'Meditace s dlaněmi v sedě' }
        ];

        this.currentVideoIndex = 0;
        this.loadWatchdog = null;

        this.setupEventListeners();
        this.buildChapterMenu();
        this.initializePlayer();
    }

    setupEventListeners() {
        this.prevButton.addEventListener('click', () => this.navigateVideo(-1));
        this.nextButton.addEventListener('click', () => this.navigateVideo(1));
        this.playPauseButton.addEventListener('click', () => this.togglePlayPause());
        this.muteButton.addEventListener('click', () => this.toggleMute());
        this.menuToggleButton.addEventListener('click', () => this.toggleMenu());
        this.retryButton.addEventListener('click', () => this.retry());

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
            if (e.key === 'ArrowRight') this.navigateVideo(1);
            else if (e.key === 'ArrowLeft') this.navigateVideo(-1);
            else if (e.key === ' ') { e.preventDefault(); this.togglePlayPause(); }
            else if (e.key.toLowerCase() === 'm') this.toggleMute();
        });

        [this.videoPlayer1, this.videoPlayer2].forEach((player) => {
            player.addEventListener('ended', () => this.onVideoEnded(player));
            player.addEventListener('waiting', () => this.showSpinner());
            player.addEventListener('playing', () => this.onVideoPlaying());
            player.addEventListener('canplay', () => this.hideSpinner());
            player.addEventListener('error', () => this.showError());
        });
    }

    buildChapterMenu() {
        this.videos.forEach((video, index) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'chapter-item';
            item.textContent = video.description;
            item.setAttribute('aria-label', `Přehrát: ${video.description}`);
            item.addEventListener('click', () => {
                this.goToVideo(index);
                this.closeMenu();
            });
            this.chapterMenu.appendChild(item);
        });
    }

    initializePlayer() {
        this.videoPlayer1.src = this.videos[this.currentVideoIndex].src;
        this.descriptionElement.textContent = this.videos[this.currentVideoIndex].description;
        this.updateChapterMenu();
        this.playCurrent();
    }

    activePlayer() {
        return document.querySelector('.video-player.active');
    }

    inactivePlayer() {
        return document.querySelector('.video-player:not(.active)');
    }

    playCurrent() {
        this.activePlayer().play().catch(() => { /* autoplay muted by měl projít; ignorujeme */ });
    }

    goToVideo(index) {
        this.currentVideoIndex = (index + this.videos.length) % this.videos.length;
        this.switchPlayers();
    }

    navigateVideo(direction) {
        this.goToVideo(this.currentVideoIndex + direction);
    }

    switchPlayers() {
        this.hideError();
        const activePlayer = this.activePlayer();
        const inactivePlayer = this.inactivePlayer();

        inactivePlayer.src = this.videos[this.currentVideoIndex].src;
        this.descriptionElement.textContent = this.videos[this.currentVideoIndex].description;
        this.updateChapterMenu();
        this.updatePlayPauseButton();

        activePlayer.classList.remove('active');
        inactivePlayer.classList.add('active');

        inactivePlayer.muted = activePlayer.muted;
        inactivePlayer.play().catch(() => {});
    }

    playNextVideo() {
        this.navigateVideo(1);
    }

    onVideoEnded(player) {
        // Pojistka proti falešnému "ended": přechod na další video jen tehdy,
        // když video skutečně doběhlo na konec své (známé) délky.
        const remaining = isFinite(player.duration)
            ? player.duration - player.currentTime
            : Infinity;
        if (remaining > 1.5) {
            // Stream se přerušil daleko před koncem — obnovíme od stejné pozice.
            console.warn(`Předčasný konec (zbývá ${isFinite(remaining) ? remaining.toFixed(1) : '?'} s) — obnovuji stream.`);
            const resumeAt = player.currentTime;
            const onLoaded = () => {
                player.removeEventListener('loadedmetadata', onLoaded);
                player.currentTime = Math.max(0, resumeAt - 0.5);
                player.play().catch(() => {});
            };
            player.addEventListener('loadedmetadata', onLoaded);
            player.load();
            return;
        }
        this.playNextVideo();
    }

    togglePlayPause() {
        const player = this.activePlayer();
        if (player.paused) {
            player.play().catch(() => {});
        } else {
            player.pause();
        }
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        const player = this.activePlayer();
        this.playPauseButton.textContent = player.paused ? '▶' : '⏸';
        this.playPauseButton.setAttribute('aria-label', player.paused ? 'Přehrát' : 'Pozastavit');
    }

    toggleMute() {
        const player = this.activePlayer();
        player.muted = !player.muted;
        this.updateMuteButton();
    }

    updateMuteButton() {
        const player = this.activePlayer();
        this.muteButton.textContent = player.muted ? '🔇' : '🔊';
        this.muteButton.setAttribute('aria-pressed', String(!player.muted));
        this.muteButton.setAttribute('aria-label', player.muted ? 'Zapnout zvuk' : 'Ztlumit zvuk');
    }

    toggleMenu() {
        if (this.chapterMenu.hidden) this.openMenu();
        else this.closeMenu();
    }

    openMenu() {
        this.chapterMenu.hidden = false;
        this.menuToggleButton.setAttribute('aria-expanded', 'true');
    }

    closeMenu() {
        this.chapterMenu.hidden = true;
        this.menuToggleButton.setAttribute('aria-expanded', 'false');
    }

    updateChapterMenu() {
        const items = this.chapterMenu.querySelectorAll('.chapter-item');
        items.forEach((item, index) => {
            const isCurrent = index === this.currentVideoIndex;
            item.classList.toggle('current', isCurrent);
            item.setAttribute('aria-current', isCurrent ? 'true' : 'false');
        });
    }

    showSpinner() {
        if (!this.errorOverlay.hidden) return;
        this.spinner.classList.add('visible');
        this.armWatchdog();
    }

    armWatchdog() {
        clearTimeout(this.loadWatchdog);
        this.loadWatchdog = setTimeout(() => {
            const player = this.activePlayer();
            if (!this.errorOverlay.hidden) return;
            if (player.readyState < 3 && player.currentTime === 0) {
                this.showError();
            }
        }, 15000);
    }

    onVideoPlaying() {
        clearTimeout(this.loadWatchdog);
        this.hideSpinner();
    }

    hideSpinner() {
        this.spinner.classList.remove('visible');
    }

    showError() {
        this.hideSpinner();
        this.errorOverlay.hidden = false;
    }

    hideError() {
        this.errorOverlay.hidden = true;
    }

    retry() {
        const player = this.activePlayer();
        this.hideError();
        this.showSpinner();
        player.load();
        player.play().catch(() => {});
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});
