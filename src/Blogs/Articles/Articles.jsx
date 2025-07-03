import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import './Articles.css';
import '../../utils/AudioPlayer/AudioPlayer.jsx';
import { useAudio } from '../../utils/AudioPlayer/AudioPlayer.jsx';

function Articles() {
    const { url } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { songs, playSong, isPlaying, currentSong, isActive, setIsActive } = useAudio();
    const sidebarRef = useRef(null);
    const selectionBarRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchUrl = `/articles/${url}.md`;
        fetch(fetchUrl)
            .then((response) => {
                if (!response.ok) throw new Error(`Fail to load (${response.status})`);
                return response.text();
            })
            .then((text) => setContent(text))
            .catch((err) => {
                console.error('An err occur while loading files:', err);
                setError(err.message);
                setContent('# article not found\n\nPlease check the link');
            })
            .finally(() => setLoading(false));
    }, [url]);

    useEffect(() => {
        const adjustContainerPosition = () => {
            const selectionBar = selectionBarRef.current;
            const container = document.querySelector('.article-container');
            if (selectionBar && container) {
                const barHeight = selectionBar.offsetHeight;
                container.style.top = `${barHeight}px`;
            }
        };

        adjustContainerPosition();
        window.addEventListener('resize', adjustContainerPosition);
        return () => window.removeEventListener('resize', adjustContainerPosition);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest('button') &&
                !event.target.closest('input')
            ) {
                setIsActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActive, setIsActive]);

    useEffect(() => {
        return () => {
            setIsActive(false);
        };
    }, [setIsActive]);

    if (loading) return <div className="article-container">Loading...</div>;
    if (error) return <div className="article-container">Error: {error}</div>;

    return (
        <div className="articles">
            <div className="selection-bar-blog" ref={selectionBarRef}>
                <Link to="/blogs">
                    <button>BACK</button>
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
                    role="navigation"
                    ref={sidebarRef}
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
            </div>
            <div className="article-container">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={coldarkDark }
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).trimStart()}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default Articles;
