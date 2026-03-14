// Optimize hero video loading
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const desktopVideo = document.getElementById('heroVideoDesktop');
    const mobileVideo  = document.getElementById('heroVideoMobile');

    // Only inject src for the active video — the other never downloads
    const activeVideo  = isMobile ? mobileVideo  : desktopVideo;
    const inactiveVideo = isMobile ? desktopVideo : mobileVideo;

    // Keep inactive video empty (no src, no download)
    if (inactiveVideo) {
        inactiveVideo.removeAttribute('data-src');
    }

    if (activeVideo && activeVideo.dataset.src) {
        // Set src directly on the element (not via <source>) so we control timing
        activeVideo.src = activeVideo.dataset.src;
        activeVideo.muted = true;
        activeVideo.setAttribute('muted', '');
        activeVideo.setAttribute('playsinline', '');
        activeVideo.load();

        // Show video once it can play
        activeVideo.addEventListener('canplay', function() {
            activeVideo.classList.add('loaded');
        });
        if (activeVideo.readyState >= 3) {
            activeVideo.classList.add('loaded');
        }

        // Trigger play
        var playPromise = activeVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                // iOS Safari fallback: play on first touch
                document.addEventListener('touchstart', function() {
                    activeVideo.play().catch(function() {});
                }, { once: true });
            });
        }
    }


    // Add slow motion effect to heritage video
    const heritageVideo = document.querySelector('.heritage-image video');
    if (heritageVideo) {
        heritageVideo.playbackRate = 0.7;
        heritageVideo.addEventListener('loadedmetadata', function() {
            heritageVideo.play();
        });
    }
});