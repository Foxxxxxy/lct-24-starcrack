import {useCallback, useEffect, useState} from 'react';

export const useScrollToBottom = (callback: () => void): boolean => {
    const [isBottom, setIsBottom] = useState(false);

    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        // Check if the user has scrolled to the bottom
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1; // Use a small offset for precision

        setIsBottom(isAtBottom);

        if (isAtBottom) {
            callback();
        }
    }, [callback]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return isBottom;
};
