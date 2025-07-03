import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AudioPlayer } from './utils/AudioPlayer/AudioPlayer.jsx';
import Blogs from './Blogs/Blogs.jsx';
import Messages from './Messages/Messages.jsx';
import EasterEGG from './easter_egg/EasterEGG.jsx';
import Articles from './Blogs/Articles/Articles.jsx';
import App from './App.jsx';
import Background from "./utils/Background/Background.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AudioPlayer>
            <BrowserRouter>
                <Background />
                <div className="content-layer" style={{ zIndex: 1 }}>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path='/messages' element={<Messages />} />
                        <Route path="/easteregg" element={<EasterEGG />} />
                        <Route path="/articles/:url" element={<Articles />} />
                        <Route path="/index.html" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AudioPlayer>
    </StrictMode>,
);
