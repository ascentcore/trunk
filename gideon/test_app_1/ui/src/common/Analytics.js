import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Analytics() {
    const location = useLocation();
    const { pathname } = location;

    useEffect(() => {
        if (window.gtag) {
            window.gtag('event', 'virtualPageView', {
                event_category: 'general',
                event_label: pathname,
                value: pathname,
            });
        }
    }, [pathname]);

    return null;
}

export default Analytics;
