import { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';

const Layout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
        const drawerState = localStorage.getItem('isDrawerOpen');

        if (!drawerState) {
            return false;
        }

        return drawerState === 'true';
    });

    useEffect(() => {
        // Synchronize state anytime it changes
        localStorage.setItem('isDrawerOpen', isDrawerOpen);
    }, [isDrawerOpen]);

    const toggleDrawerOpen = useCallback(() => {
        setIsDrawerOpen((prev) => !prev);
    }, []);

    return (
        <>
            <Header
                isDrawerOpen={isDrawerOpen}
                toggleDrawer={toggleDrawerOpen}
            />
            <Content isOpen={isDrawerOpen}>
                <Outlet />
            </Content>
            <Footer />
        </>
    );
};

export default Layout;
