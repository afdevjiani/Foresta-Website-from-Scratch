// Optimize hero video loading
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Show video when it can play
        heroVideo.addEventListener('canplay', function() {
            heroVideo.classList.add('loaded');
        });
        
        // If video is already loaded (from cache)
        if (heroVideo.readyState >= 3) {
            heroVideo.classList.add('loaded');
        }
    }
    
    // Add slow motion effect to heritage video
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