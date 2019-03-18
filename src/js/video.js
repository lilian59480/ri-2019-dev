/// @ts-check

/**
 * Play the video when it appears on the screen
 */
const playVideoOnScroll = () => {
    const bounds = document.querySelector("video").getBoundingClientRect()
    const isViewable = bounds.top < window.innerHeight * 0.5
        && bounds.bottom >= window.innerHeight * 0.5

    if (isViewable)
        document.querySelector("video").play();

    if (!isViewable)
        document.querySelector("video").pause();
};

// Add Event onScroll
window.addEventListener('scroll', () => {
    playVideoOnScroll();
});
