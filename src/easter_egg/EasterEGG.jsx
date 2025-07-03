import { useEffect, useRef } from 'react';
import './EasterEgg.css';

function EasterEgg() {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {

            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            } else if (videoElement.webkitRequestFullscreen) { // Safari
                videoElement.webkitRequestFullscreen();
            } else if (videoElement.msRequestFullscreen) { // IE/Edge
                videoElement.msRequestFullscreen();
            }

            videoElement.play().catch((error) => {
                console.error("Video play failed:", error);
            });
        }

        return () => {};
    }, []);

    return (
        <div className="egg-container">
            <video
                ref={videoRef}
                autoPlay
                controls
                src="../../public/images/easter_egg.mp4"
                className="egg-video"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default EasterEgg;
