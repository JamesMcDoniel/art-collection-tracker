import { useState, useRef, useMemo, useCallback } from 'react';
import { MobileContext } from './MobileContext';

export const MobileProvider = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
    const menuButtonRef = useRef(null);

    const toggleMobileMenu = useCallback(() => {
        if (isReportMenuOpen) {
            setIsReportMenuOpen(false);
        }

        setIsMobileMenuOpen((prev) => !prev);
    }, [isReportMenuOpen]);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
    }, []);

    const toggleReportMenu = useCallback(() => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }

        setIsReportMenuOpen((prev) => !prev);
    }, [isMobileMenuOpen]);

    const value = useMemo(
        () => ({
            isMobileMenuOpen,
            isReportMenuOpen,
            menuButtonRef,
            toggleMobileMenu,
            closeMobileMenu,
            toggleReportMenu
        }),
        [
            isMobileMenuOpen,
            isReportMenuOpen,
            menuButtonRef,
            toggleMobileMenu,
            closeMobileMenu,
            toggleReportMenu
        ]
    );

    return (
        <MobileContext.Provider value={value}>
            {children}
        </MobileContext.Provider>
    );
};
