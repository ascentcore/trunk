import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';

function ScrollToTop({ children }) {
    const location = useLocation();

    useEffect(() => {
        scroll.scrollToTop({ duration: 300 });
    }, [location]);

    return children;
}

export default ScrollToTop;
