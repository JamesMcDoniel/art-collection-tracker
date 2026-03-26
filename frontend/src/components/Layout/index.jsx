import { Outlet } from 'react-router';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';

const Layout = () => {
    return (
        <>
            <Header />
            <Content>
                <Outlet />
            </Content>
            <Footer />
        </>
    );
};

export default Layout;
