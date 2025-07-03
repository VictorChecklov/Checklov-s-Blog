import { Link } from 'react-router-dom';
import './Messages.css';
import '../utils/AudioPlayer/AudioPlayer.jsx';
import { useAudio } from '../utils/AudioPlayer/AudioPlayer.jsx';
import { useEffect, useRef, useState, useMemo } from 'react';

function Messages() {
    const { songs, playSong, isPlaying, currentSong, isActive, setIsActive } = useAudio();
    const sidebarRef = useRef(null);
    const selectionBarRef = useRef(null);
    const [messageList, setMessageList] = useState([]);
    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 10;

    useEffect(() => {
        const adjustContainerPosition = () => {
            const selectionBar = selectionBarRef.current;
            const container = document.querySelector('.message-index-container');
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim() && content.trim()) {
            const newMessage = {
                id: messageList.length ? Math.max(...messageList.map((m) => m.id)) + 1 : 1,
                nickname: nickname.trim(),
                content: content.trim(),
                date: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }).replace(/,/, ' '), // YYYY-MM-DD HH:mm
            };
            setMessageList([...messageList, newMessage]);
            setNickname('');
            setContent('');
        }
    };

    const filteredMessages = useMemo(() => {
        if (!keyword) return messageList;
        const lowerKeyword = keyword.toLowerCase();
        return messageList.filter(
            (message) =>
                message.nickname.toLowerCase().includes(lowerKeyword) ||
                message.content.toLowerCase().includes(lowerKeyword)
        );
    }, [messageList, keyword]);

    const totalMessages = filteredMessages.length;
    const totalPages = Math.max(1, Math.ceil(totalMessages / messagesPerPage));
    const startIndex = (currentPage - 1) * messagesPerPage;
    const endIndex = Math.min(startIndex + messagesPerPage, totalMessages);
    const currentMessages = filteredMessages.slice(startIndex, endIndex);

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
        <div className="messages">
            <div className="selection-bar-message" ref={selectionBarRef}>
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

            <div className="message-index-container">
                <div className="message-index">
                    <h2 className="message-index-title">Сообщение</h2>
                    <div className="message-controls">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search messages (nickname or content)"
                            className="message-search-input"
                            aria-label="Search messages by nickname or content"
                        />
                        <form onSubmit={handleSubmit} className="message-form">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Nickname"
                                className="message-input"
                                aria-label="Enter your nickname"
                            />
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Leave a message"
                                className="message-input"
                                aria-label="Enter your message"
                            />
                            <button type="submit" className="message-submit-button">
                                Submit
                            </button>
                        </form>
                    </div>
                    <ul className="message-index-list">
                        {currentMessages.length > 0 ? (
                            currentMessages.map((message) => (
                                <li key={message.id} className="message-index-item">
                                    <span className="message-nickname">{message.nickname}</span>
                                    <p className="message-content">{message.content}</p>
                                    <p className="message-meta">Date: {message.date}</p>
                                </li>
                            ))
                        ) : (
                            <li className="message-index-empty">No messages</li>
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
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                            )}
                            <span className="pagination-info">
                                Total: {totalMessages} messages / {totalPages} pages
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;
