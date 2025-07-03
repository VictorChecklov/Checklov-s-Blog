import { createContext, useContext, useEffect, useRef, useState } from 'react';
import songs from '../../../public/audios.json'

const AudioContext = createContext(undefined);

export function AudioPlayer({ children }) {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [isActive, setIsActive] = useState(false);

    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch((error) => console.error('播放失败:', error));
                setIsPlaying(true);
            }
        } else {
            setCurrentSong(song);
            audioRef.current.src = song.url;
            audioRef.current.play().catch((error) => console.error('播放失败:', error));
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    return (
        <AudioContext.Provider value={{ songs, playSong, isPlaying, currentSong, isActive, setIsActive }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    return useContext(AudioContext);
}
