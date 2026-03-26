import { useLocation } from 'react-router';

const Header = () => {
    const location = useLocation();

    return <div>{location.pathname === '/login' ? 'Unauth' : 'Auth'}</div>;
};

export default Header;
