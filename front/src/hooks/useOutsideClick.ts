import {RefObject, useEffect} from 'react';

export const useOutsideClick = <T extends HTMLElement>(
    ref: RefObject<T>,
    handler: (event: MouseEvent | TouchEvent) => void,
): void => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler(event);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, handler]);
};

export default useOutsideClick;
