import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../AudioPlayer/AudioPlayer.jsx';
import { gsap } from 'gsap';
import './Introduce.css';

function Introduce() {
    const titleRef = useRef(null);
    const selectionBarRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const sidebarRef = useRef(null);
    const { songs, playSong, isPlaying, currentSong} = useAudio();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest('button')
            ) {
                setIsActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);

        };
    }, [isActive]);

    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        scrollToTop();

        const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onStart: scrollToTop,

        });

        tl.fromTo(
            titleRef.current,
            { opacity: 0, y: -20, fontSize: '100px' },
            { opacity: 1, y: 0, fontSize: '100px', duration: 0.4 }
        );

        tl.to(
            titleRef.current,
            {
                y: '+=30%',
                fontSize: '120px',
                duration: 0.5,
                ease: 'back.out(1)'
            },
            '>-=0.3'
        );

        tl.to(
            selectionBarRef.current,
            {
                y: 100,
                duration: 0.2,
            },
            '-=0.3'
        );

        return () => {
            tl.kill();
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    return (
        <div className="introduce">
            <h1 ref={titleRef} className="main-title">
                CreativeProgrammer
            </h1>
            <div ref={selectionBarRef} className="selection-bar">
                <Link to="/blogs">
                    <button>BLOG</button>
                </Link>
                <button
                    onClick={() => setIsActive(!isActive)}
                    aria-controls="sidebar"
                    aria-expanded={isActive}
                    aria-label="Toggle music sidebar"
                >
                    MUSIC
                </button>
                <div
                    id="sidebar"
                    className={`sidebar ${isActive ? 'active' : ''}`}
                    ref={sidebarRef}
                    role="navigation"
                    aria-label="Music menu"
                >
                    <div className="sidebar-content">
                        <h1>Musics</h1>
                        <div className="divider"></div>
                        {songs.map((song) => (
                            <div key={song.id}>
                                <button
                                    className={`sidebar-button ${currentSong?.id === song.id && isPlaying ? 'playing' : ''}`}
                                    onClick={() => playSong(song)}
                                    aria-label={`Play ${song.title}`}
                                    tabIndex={isActive ? 0 : -1}
                                >
                                    {song.title}
                                </button>
                            </div>
                        ))}
                        <div className="player-controls">
                            <button
                                onClick={() => playSong(currentSong)}
                                disabled={!currentSong}
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                                className={isPlaying ? 'playing-logo' : ''}
                            >
                                <img src="/images/audio_player.png" alt="AudioPlayer" />
                            </button>
                        </div>
                    </div>
                </div>
                <Link to="/messages">
                    <button>MESSAGE</button>
                </Link>
            </div>
        </div>
    );
}

export default Introduce;
