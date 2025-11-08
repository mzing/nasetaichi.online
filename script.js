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
        this.isFirstVideoActive = true;

        this.setupEventListeners();
        this.playNextVideo();
    }

    setupEventListeners() {
        // Automatické přehrávání dalšího videa po skončení
        this.videoPlayer1.addEventListener('ended', () => this.playNextVideo());
        this.videoPlayer2.addEventListener('ended', () => this.playNextVideo());
        
        // Navigační tlačítka
        this.prevButton.addEventListener('click', () => this.manualNavigate(-1));
        this.nextButton.addEventListener('click', () => this.manualNavigate(1));
    }

    manualNavigate(direction) {
        // Ruční navigace s pozastavením automatického přehrávání
        this.currentVideoIndex = (this.currentVideoIndex + direction + this.videos.length) % this.videos.length;
        this.playNextVideo();
    }

    playNextVideo() {
        const currentVideo = this.videos[this.currentVideoIndex];
        
        // Výběr aktivního a neaktivního přehrávače
        const activePlayer = this.isFirstVideoActive ? this.videoPlayer1 : this.videoPlayer2;
        const inactivePlayer = this.isFirstVideoActive ? this.videoPlayer2 : this.videoPlayer1;

        // Nastavení zdroje a popisu
        inactivePlayer.src = currentVideo.src;
        this.descriptionElement.textContent = currentVideo.description;

        // Prolnutí videí
        activePlayer.classList.remove('active');
        inactivePlayer.classList.add('active');

        // Spuštění nového videa
        inactivePlayer.play();

        // Posun na další video pro automatické přehrávání
        this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
        
        // Přepnutí příznaku aktivního videa
        this.isFirstVideoActive = !this.isFirstVideoActive;
    }
}

// Inicializace přehrávače po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});

