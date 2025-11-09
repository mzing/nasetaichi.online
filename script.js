//const videos = [
//    { src: 'https://owncloud.cesnet.cz/index.php/s/wb3myaeLHvZ4Mk1/download', description: 'Kop patou' },
//    { src: 'https://owncloud.cesnet.cz/index.php/s/YLCjpWa5L02yc9S/download', description: 'Postoj strom, údery dlaní' },
//    { src: 'https://owncloud.cesnet.cz/index.php/s/YLCjpWa5L02yc9S/download', description: 'Postoj jezdce na koni' }
//];
        
class VideoPlayer {
    constructor() {
        this.videoPlayer1 = document.getElementById('videoPlayer1');
        this.videoPlayer2 = document.getElementById('videoPlayer2');
        this.descriptionElement = document.getElementById('videoDescription');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        
        this.videos = [
            { src: 'https://owncloud.cesnet.cz/index.php/s/wb3myaeLHvZ4Mk1/download', description: 'Kop patou' },
            { src: 'https://owncloud.cesnet.cz/index.php/s/YLCjpWa5L02yc9S/download', description: 'Postoj jezdce na koni' },
            { src: 'https://owncloud.cesnet.cz/index.php/s/vjCYzwc1nhhRZD1/download', description: 'Meditace' },
            { src: 'https://owncloud.cesnet.cz/index.php/s/GI3eeux2DTYTuFq/download', description: 'Zavěšení' }
        ];
        
        this.currentVideoIndex = 0;

        this.setupEventListeners();
        this.initializePlayer();
    }

    setupEventListeners() {
        this.videoPlayer1.addEventListener('ended', () => this.playNextVideo());
        this.videoPlayer2.addEventListener('ended', () => this.playNextVideo());
        
        this.prevButton.addEventListener('click', () => this.navigateVideo(-1));
        this.nextButton.addEventListener('click', () => this.navigateVideo(1));
    }

    initializePlayer() {
        // Nastavení prvního videa
        this.videoPlayer1.src = this.videos[this.currentVideoIndex].src;
        this.descriptionElement.textContent = this.videos[this.currentVideoIndex].description;
        this.videoPlayer1.classList.add('active');
    }

    navigateVideo(direction) {
        // Aktualizace indexu
        this.currentVideoIndex = (this.currentVideoIndex + direction + this.videos.length) % this.videos.length;
        
        // Přepnutí videí
        const activePlayer = document.querySelector('.video-player.active');
        const inactivePlayer = document.querySelector('.video-player:not(.active)');

        // Nastavení nového zdroje a popisu
        inactivePlayer.src = this.videos[this.currentVideoIndex].src;
        this.descriptionElement.textContent = this.videos[this.currentVideoIndex].description;

        // Prolnutí
        activePlayer.classList.remove('active');
        inactivePlayer.classList.add('active');

        // Spuštění nového videa
        inactivePlayer.play();
    }

    playNextVideo() {
        this.navigateVideo(1);
    }
}

// Inicializace přehrávače
document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});

