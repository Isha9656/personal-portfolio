import { Link, useLocation } from 'react-router-dom';
import './Header.scss';
import { Link as ScrollLink } from 'react-scroll';
import { useEffect, useRef, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleToggleMenu = () => {
    setMobileToggle((open) => !open);
  }

  useEffect(() => {
    document.body.style.overflow = mobileToggle ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileToggle]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileToggle(false);
    };
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMobileToggle(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const renderNavLink = (to, text) => {
    if (isHomePage) {
      return <ScrollLink to={to} spy={true} smooth={true} offset={-80} duration={500} onClick={() => setMobileToggle(false)}>{text}</ScrollLink>;
    } else {
      return <Link to={to === 'home' ? '/' : `/#${to}`} onClick={() => setMobileToggle(false)}>{text}</Link>;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <header className={`st-site-header st-sticky-header st-style1 ${isScrolled ? 'st-sticky-active' : ''}`}>
      <div className="st-main-header">
        <div className="container-fluid" style={{ padding: '0 40px' }}>
          <div className="st-main-header-in">
            <div className="st-main-header-left">
              <Link className="st-site-branding" to='/' id="hero" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <span style={{ fontSize: '32px', fontWeight: '300', color: '#6366f1', fontFamily: 'monospace', lineHeight: 1 }}>{"{"}</span>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, fontFamily: '"Poppins", sans-serif' }}>
                  <span style={{ fontWeight: '800', fontSize: '14px', letterSpacing: '0.15em', color: '#ffffff' }}>ISHA</span>
                  <span style={{ fontWeight: '800', fontSize: '14px', letterSpacing: '0.15em', color: '#ffffff' }}>KAKADIYA</span>
                </div>
                <span style={{ fontSize: '32px', fontWeight: '300', color: '#6366f1', fontFamily: 'monospace', lineHeight: 1 }}>{"}"}</span>
              </Link>
            </div>
            <div className="st-main-header-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <div className="st-nav" ref={menuRef}>
                <ul id="primary-navigation" className="st-nav-list st-onepage-nav" style={{ display: `${mobileToggle ? 'block' : 'none'}` }}>
                  <li>{renderNavLink('home', 'Home')}</li>
                  <li>{renderNavLink('about', 'About')}</li>
                  <li>{renderNavLink('resume', 'Resume')}</li>
                  <li>{renderNavLink('certificates', 'Certificates')}</li>
                  <li>{renderNavLink('portfolio', 'Projects')}</li>
                  <li>{renderNavLink('contact', 'Contact')}</li>
                </ul>
                <button className={`st-munu-toggle ${mobileToggle ? "st-toggle-active" : ""}`} type="button" onClick={handleToggleMenu} aria-label={mobileToggle ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileToggle} aria-controls="primary-navigation">
                  <span></span>
                </button>
                <div className="sp-phone" style={{ textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" style={{ fill: '#ffffff', width: '16px', height: '16px' }}>
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:ikakadiya36@gmail.com" className="sp-phone-no" style={{ textDecoration: 'none', color: '#6366f1' }}>ikakadiya36@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header >
  )
}

export default Header;
