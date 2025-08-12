/* eslint-env browser */

/**
 * Essential Card Functionality
 * Minimal Ghost card support for Neo Brutalics theme
 */

(function (window, document) {
    'use strict';

    // Gallery card layout
    function initGalleryCards() {
        document.querySelectorAll(".kg-gallery-image img").forEach(function(img) {
            const galleryImage = img.closest(".kg-gallery-image");
            const aspectRatio = img.attributes.width.value / img.attributes.height.value;
            galleryImage.style.flex = aspectRatio + " 1 0%";
        });
    }

    // Toggle card functionality  
    function initToggleCards() {
        const toggleHeadings = document.getElementsByClassName("kg-toggle-heading");
        
        const handleToggle = function(e) {
            const toggleCard = e.target.closest(".kg-toggle-card");
            const currentState = toggleCard.getAttribute("data-kg-toggle-state");
            
            if (currentState === "close") {
                toggleCard.setAttribute("data-kg-toggle-state", "open");
            } else {
                toggleCard.setAttribute("data-kg-toggle-state", "close");
            }
        };
        
        for (let i = 0; i < toggleHeadings.length; i++) {
            toggleHeadings[i].addEventListener("click", handleToggle, false);
        }
    }

    // Video card aspect ratio and basic functionality
    function initVideoCards() {
        const videoCards = document.querySelectorAll(".kg-video-card");
        
        videoCards.forEach(function(card) {
            const videoContainer = card.querySelector(".kg-video-container");
            const video = videoContainer ? videoContainer.querySelector("video") : null;
            
            if (videoContainer && video && video.width && video.height) {
                // Set aspect ratio for responsive video
                const aspectRatio = (video.height / video.width * 100).toFixed(3);
                videoContainer.style.paddingBottom = aspectRatio + "%";
            }
            
            // Basic play/pause functionality
            const playButton = card.querySelector(".kg-video-large-play-icon");
            const overlay = card.querySelector(".kg-video-overlay");
            
            if (playButton && video) {
                playButton.addEventListener("click", function(e) {
                    e.stopPropagation();
                    if (playButton) playButton.style.display = 'none';
                    if (overlay) overlay.style.display = 'none';
                    video.play();
                });
            }
            
            // Click to play/pause
            if (video) {
                card.addEventListener("click", function() {
                    if (video.paused) {
                        if (playButton) playButton.style.display = 'none';
                        if (overlay) overlay.style.display = 'none';
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }
        });
    }

    // Audio card aspect ratio fix
    function initAudioCards() {
        const audioCards = document.querySelectorAll(".kg-audio-card");
        
        audioCards.forEach(function(card) {
            const thumbnail = card.querySelector(".kg-audio-thumbnail");
            if (thumbnail) {
                // Force 1:1 aspect ratio for thumbnails
                thumbnail.style.aspectRatio = "1";
                thumbnail.style.objectFit = "cover";
            }
        });
    }

    // Initialize all card functionality
    function initCards() {
        initGalleryCards();
        initToggleCards();
        initVideoCards();
        initAudioCards();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCards);
    } else {
        initCards();
    }

    // Re-initialize after content loads (for infinite scroll, etc.)
    document.addEventListener('contentLoaded', initCards);

    // Expose for debugging
    if (window.console && window.console.log) {
        window.NeoCards = {
            init: initCards,
            gallery: initGalleryCards,
            toggle: initToggleCards,
            video: initVideoCards,
            audio: initAudioCards
        };
    }

})(window, document);
