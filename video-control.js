// Add slow motion effect to heritage video
document.addEventListener('DOMContentLoaded', function() {
    const heritageVideo = document.querySelector('.heritage-image video');
    if (heritageVideo) {
        // Set slow playback rate (0.7 = 70% of normal speed)
        heritageVideo.playbackRate = 0.7;
        
        // Ensure video starts playing
        heritageVideo.addEventListener('loadedmetadata', function() {
            heritageVideo.play();
        });
    }
});