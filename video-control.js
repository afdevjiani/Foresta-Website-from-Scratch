// Inject the correct hero video src based on device, then play
(function() {
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    var src = isMobile ? 'assets/Foresta_video_Mobile.mp4' : 'assets/Foresta_video.mp4';
    var vid = document.getElementById('heroVideo');
    if (!vid) return;
    vid.src = src;
    vid.muted = true;
    vid.load();
    var playAttempt = vid.play();
    if (playAttempt !== undefined) {
        playAttempt.catch(function() {
            document.addEventListener('touchstart', function() {
                vid.play().catch(function() {});
            }, { once: true });
        });
    }
    vid.addEventListener('canplay', function() {
        vid.classList.add('loaded');
    });
    if (vid.readyState >= 3) vid.classList.add('loaded');
})();

document.addEventListener('DOMContentLoaded', function() {

    // Add slow motion effect to heritage video
    const heritageVideo = document.querySelector('.heritage-image video');
    if (heritageVideo) {
        heritageVideo.playbackRate = 0.7;
        heritageVideo.addEventListener('loadedmetadata', function() {
            heritageVideo.play();
        });
    }
});