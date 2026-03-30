import { useState } from 'react';
import { NavLink } from 'react-router';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

const Header = ({ isDrawerOpen, toggleDrawer }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { user, logout } = useAuthContext();

    return (
        <header className={styles.container}>
            {user ? (
                <button onClick={toggleDrawer}>
                    {!isDrawerOpen ? (
                        <FontAwesomeIcon icon={faBars} />
                    ) : (
                        <FontAwesomeIcon icon={faXmark} />
                    )}
                </button>
            ) : null}
            <img
                className={styles.logo}
                src="/landscape-white.png"
                alt="ASUMH"
            />
            {user ? (
                <>
                    <button onClick={() => setIsMobileOpen((prev) => !prev)}>
                        {!isMobileOpen ? (
                            <FontAwesomeIcon icon={faBars} />
                        ) : (
                            <FontAwesomeIcon icon={faXmark} />
                        )}
                    </button>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/artwork">Artwork</NavLink>
                            </li>
                            {user.role === 'Curator' ? (
                                <li>
                                    <NavLink to="/reports">Reports</NavLink>
                                </li>
                            ) : null}
                            {user.role === 'IT' ? (
                                <li>
                                    <NavLink to="/users">Users</NavLink>
                                </li>
                            ) : null}
                            <li>
                                <button onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </nav>
                </>
            ) : null}
        </header>
    );
};

export default Header;
