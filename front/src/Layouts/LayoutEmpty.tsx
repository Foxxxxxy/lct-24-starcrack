import React from 'react';

type LayoutProps = {
    children?: React.ReactNode;
};

export const LayoutEmpty: React.FC<LayoutProps> = ({children}) => {
    return (
        <>{children}</>
    );
};
