import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import './Header.scss';

const navigation = [
  { section: 'portfolio', label: 'Work' },
  { section: 'skills', label: 'Skills' },
  { section: 'experience', label: 'Experience' },
  { section: 'about', label: 'About' },
  { section: 'certificates', label: 'Credentials' },
  { resume: true, label: 'Resume' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);
  const location = useLocation();
  const { data } = useData();
  const isHomePage = location.pathname === '/';
  const resumeUrl = data?.aboutData?.resumePdfUrl || data?.aboutData?.cvPdf || '/images/Isha_Kakadiya_RESUME.pdf';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => (window.matchMedia('(max-width: 760px)').matches ? mobileMenuRef.current?.querySelector('a') : firstLinkRef.current)?.focus());
    }
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab' && menuOpen && menuRef.current) {
        const focusable = [...(mobileMenuRef.current?.querySelectorAll('a[href]') || menuRef.current?.querySelectorAll('a[href]') || [])].filter((item) => item.getClientRects().length > 0);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const closeOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target) && !mobileMenuRef.current?.contains(event.target)) setMenuOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!isHomePage || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .2, .5] });
    ['home', 'portfolio', 'skills', 'experience', 'about', 'certificates', 'contact'].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [isHomePage, data]);

  const navHref = (section) => isHomePage ? `#${section}` : `/#${section}`;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`st-site-header st-sticky-header lab-site-header${isScrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <div className="lab-header-inner">
        <Link className="lab-wordmark" to="/" aria-label="Isha Kakadiya, home" onClick={closeMenu}>
          <span className="lab-wordmark-symbol">i<span>.</span></span>
          <span className="lab-wordmark-name">ISHA KAKADIYA<small>DATA SCIENCE · APPLIED AI</small></span>
        </Link>
        <nav className="lab-nav" aria-label="Main navigation" ref={menuRef}>
          <ul className="lab-nav-list" id="primary-navigation">
            {navigation.map((item, index) => <li key={item.section || 'resume'} style={{ '--nav-index': index }}><a ref={index === 0 ? firstLinkRef : undefined} className={isHomePage && activeSection === item.section ? 'is-active' : ''} href={item.resume ? resumeUrl : navHref(item.section)} target={item.resume ? '_blank' : undefined} rel={item.resume ? 'noreferrer' : undefined} onClick={closeMenu}><span>0{index + 1}</span>{item.label}</a></li>)}
          </ul>
          <a className="lab-nav-contact" href={navHref('contact')}>Let’s talk <span>↗</span></a>
          <button ref={menuButtonRef} className={`lab-menu-toggle${menuOpen ? ' is-open' : ''}`} type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
            <span /><span />
          </button>
        </nav>
      </div>
      {menuOpen && createPortal(<nav className="lab-mobile-menu" id="mobile-navigation" aria-label="Mobile navigation" ref={mobileMenuRef}>
        <ul>{navigation.map((item, index) => <li key={item.section || 'resume'} style={{ '--nav-index': index }}><a href={item.resume ? resumeUrl : navHref(item.section)} target={item.resume ? '_blank' : undefined} rel={item.resume ? 'noreferrer' : undefined} onClick={closeMenu}><span>0{index + 1}</span>{item.label}<b aria-hidden="true">↗</b></a></li>)}
          <li><a href={navHref('contact')} onClick={closeMenu}><span>07</span>Let’s talk<b aria-hidden="true">↗</b></a></li></ul>
      </nav>, document.body)}
    </header>
  );
};

export default Header;
