import { Link } from 'react-router-dom';
import './Blogs.css';
import '../utils/AudioPlayer/AudioPlayer.jsx';
import { useAudio } from '../utils/AudioPlayer/AudioPlayer.jsx';
import { useEffect, useRef, useState, useMemo } from 'react';
import articles from '../../public/articles.json';

function Blogs() {
    const { songs, playSong, isPlaying, currentSong, isActive, setIsActive } = useAudio();
    const sidebarRef = useRef(null);
    const selectionBarRef = useRef(null);
    const [articleList] = useState(articles);
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 10;

    useEffect(() => {
        const adjustContainerPosition = () => {
            const selectionBar = selectionBarRef.current;
            const container = document.querySelector('.blog-index-container');
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

    const filteredArticles = useMemo(() => {
        if (!keyword) return articleList;
        const lowerKeyword = keyword.toLowerCase();
        return articleList.filter(
            (article) =>
                article.name.toLowerCase().includes(lowerKeyword) ||
                article.author.toLowerCase().includes(lowerKeyword) ||
                article.date.toLowerCase().includes(lowerKeyword)
        );
    }, [articleList, keyword]);

    const totalArticles = filteredArticles.length;
    const totalPages = Math.max(1, Math.ceil(totalArticles / articlesPerPage));
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
    const currentArticles = filteredArticles.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const maxVisiblePages = 6;
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="blogs">
            <div className="selection-bar-blog" ref={selectionBarRef}>
                <Link to="/">
                    <button>MAIN PAGE</button>
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

            <div className="blog-index-container">
                <div className="blog-index">
                    <h2 className="blog-index-title">Каталог</h2>
                    <div className="blog-controls">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search articles (title, author, or date)"
                            className="blog-search-input"
                            aria-label="Search articles by title, author, or date"
                        />
                    </div>
                    <ul className="blog-index-list">
                        {currentArticles.length > 0 ? (
                            currentArticles.map((article) => (
                                <li key={article.id} className="blog-index-item">
                                    <Link
                                        to={`/articles/${article.url}`}
                                        className="blog-index-link"
                                        aria-label={`View ${article.name}`}
                                    >
                                        {article.name}
                                    </Link>
                                    <p className="blog-index-meta"> {article.author} | {article.date}</p>
                                </li>
                            ))
                        ) : (
                            <li className="blog-index-empty">Oops, Nothing here</li>
                        )}
                    </ul>
                    {totalPages > 0 && (
                        <div className="pagination">
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                                >
                                    {page}
                                </button>
                            ))}
                            {currentPage < totalPages && (
                                <button onClick={() => setCurrentPage(currentPage + 1)} className="pagination-button">
                                    Next
                                </button>
                            )}
                            <span className="pagination-info">
                Total: {totalArticles} articles / {totalPages} pages
              </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Blogs;
