import { useLocation } from 'react-router-dom';
import Particles from '../Particles/Particles.jsx';
import './Background.css';

function Background() {
    const location = useLocation();
    const path = location.pathname;

    const showBackgroundRoutes = ['/', '/blogs', '/messages'];

    const shouldShowBackground = showBackgroundRoutes.some((route) =>
        path === route || path.startsWith(route + '/')
    );

    if (!shouldShowBackground) {
        return (
            <div className="sub-background"></div>
        );
    }

    return (
        <div className="background">
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={300}
                particleSpread={10}
                speed={0.05}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />
        </div>
    );
}

export default Background;
