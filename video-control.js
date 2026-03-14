// Heritage video slow-motion effect
document.addEventListener('DOMContentLoaded', function() {
    var heritageVideo = document.querySelector('.heritage-image video');
    if (heritageVideo) {
        heritageVideo.playbackRate = 0.7;
        heritageVideo.addEventListener('loadedmetadata', function() {
            heritageVideo.play();
        });
    }
});