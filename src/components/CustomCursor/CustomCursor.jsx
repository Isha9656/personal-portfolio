import { useEffect, useRef } from 'react';
import './CustomCursor.scss';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerPreference = window.matchMedia('(pointer: fine) and (min-width: 992px)');
    if (!pointerPreference.matches || motionPreference.matches) return undefined;

    let frame = 0;
    let activePage = null;
    const move = (event) => {
      if (!activePage || event.pointerType === 'touch') {
        cursor.classList.remove('is-visible');
        return;
      }
      const page = event.target instanceof Element ? event.target.closest('.experience-page') : null;
      if (page !== activePage) {
        cursor.classList.remove('is-visible');
        return;
      }

      cursor.classList.add('is-visible');
      const target = event.target.closest('[data-cursor], a, button');
      cursor.dataset.label = target?.dataset.cursor || (target ? (target.tagName === 'BUTTON' ? 'SELECT' : '↗') : '');
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      });
    };

    const syncPage = () => {
      const page = document.querySelector('.experience-page');
      if (page === activePage) return;
      activePage?.classList.remove('has-custom-cursor');
      activePage = page;
      cursor.classList.remove('is-visible');
      if (activePage) activePage.classList.add('has-custom-cursor');
    };

    syncPage();
    const observer = new MutationObserver(syncPage);
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
    document.addEventListener('pointermove', move, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
      activePage?.classList.remove('has-custom-cursor');
    };
  }, []);

  return <span className="cs_cursor_sm" ref={cursorRef} aria-hidden="true"><span /></span>;
};

export default CustomCursor;
