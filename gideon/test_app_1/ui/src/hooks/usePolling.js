// TODO: improve/refactor

import { useEffect } from 'react';

const DEFAULT_POLLING_INTERVAL = 60; // in seconds

function usePolling(callback = () => {}, seconds = DEFAULT_POLLING_INTERVAL) {
    useEffect(() => {
        callback();

        const interval = setInterval(() => {
            callback();
        }, seconds * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [callback, seconds]);
}

export default usePolling;
