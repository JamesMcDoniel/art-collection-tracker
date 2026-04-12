import { useContext } from 'react';
import { MobileContext } from '../contexts/Mobile/MobileContext';

export const useMobileContext = () => {
    const context = useContext(MobileContext);

    if (!context) {
        throw new Error('MobileContext must be used within an MobileProvider');
    }

    return context;
};
