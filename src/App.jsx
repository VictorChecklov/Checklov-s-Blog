import './App.css'
import { useState } from 'react';
import Introduce from "./utils/Introduce/Introduce.jsx";
import { Link } from 'react-router-dom';
import logos from '../public/logos.json';

function App() {
    const [, setShowIntro] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);

    const handleIntroComplete = () => {
        setShowIntro(false);
    };

    const handleMouseEnter = (id) => {
        setHoveredId(id);
    };

    const handleMouseLeave = () => {
        setHoveredId(null);
    };
  return (
      <div>
          <Introduce onComplete={handleIntroComplete}/>
          <div className="image-text-container">
              <div className="image-wrapper">
                  <Link to='/easteregg'>
                      <img src="/images/AUG-Para.jpg" alt="VictorChecklov" className="side-image"/>
                  </Link>
                  <p className="image-caption">VictorChecklov</p>
              </div>
              <div className="side-text">
                  <p className="side-title">✨About Myself</p>
                  <p> An enthusiast of Rust. Previously explored Computer Graphics.
                      Currently focus on Computer Vision</p>
                  <p> Now I'm a sophomore majoring in Automation</p>
                  <div className="divider"></div>
                  <p className="side-title">🛠️Languages, Frameworks and Tools</p>
                  <div className="logo-container">
                      {logos.map((logo) => (
                          <a
                              key={logo.id}
                              href={logo.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onMouseEnter={() => handleMouseEnter(logo.id)}
                              onMouseLeave={handleMouseLeave}
                              style={{
                                  display: 'inline-block',
                                  filter: hoveredId === logo.id && logo.hoverColor
                                      ? `drop-shadow(0 0 1em ${logo.hoverColor})`
                                      : 'none',
                                  transition: 'filter 0.3s ease',
                              }}
                          >
                              <img
                                  src={logo.image}
                                  alt={logo.alt}
                                  style={{
                                      width: '75px',
                                      height: 'auto',
                                      margin: '5px',
                                  }}
                              />
                          </a>
                      ))}

                  </div>
                  <div className="divider"></div>
                  <p className="side-title">💡Motto</p>
                  <p className="side-text">
                      Some things, once you take the first step, and the rest will
                      follow naturally, each leading to the next,
                      until they are complete
                  </p>
              </div>
          </div>
      </div>

  )
}


export default App
