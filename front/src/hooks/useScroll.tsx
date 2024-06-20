import {useEffect, useRef, useState} from 'react';

function useBottomScrollDetection<T extends HTMLElement>(
    ref: React.RefObject<T>,
    threshold: number = 0.1,
): boolean {
    const [isBottom, setIsBottom] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const handleObserver: IntersectionObserverCallback = (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                setIsBottom(true);
            } else {
                setIsBottom(false);
            }
        };

        observer.current = new IntersectionObserver(handleObserver, {
            root: null, // relative to the viewport
            rootMargin: '0px', // margin around the root
            threshold: threshold, // percentage of target's visible area. Triggers "onChange" when this amount is visible.
        });

        if (ref.current) {
            observer.current.observe(ref.current);
        }

        // Clean up observer on component unmount
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [ref, threshold]);

    return isBottom;
}

export default useBottomScrollDetection;
