import { NavLink, useLocation } from 'react-router';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useMobileContext } from '../../../../hooks/useMobileContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

const Header = () => {
    const {
        isMobileMenuOpen,
        isReportMenuOpen,
        menuButtonRef,
        toggleMobileMenu,
        closeMobileMenu,
        toggleReportMenu
    } = useMobileContext();
    const { user, logout } = useAuthContext();
    const location = useLocation();

    const isReportPage = location.pathname === '/reports';

    const handleLogout = () => {
        closeMobileMenu();
        logout();
    };

    return (
        <header className={styles.container}>
            <div>
                {isReportPage ? (
                    <button
                        className={styles.mobile_btn}
                        onClick={toggleReportMenu}
                    >
                        {!isReportMenuOpen ? (
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
            </div>
            {user ? (
                <div>
                    <button
                        ref={menuButtonRef}
                        className={styles.mobile_btn}
                        onClick={toggleMobileMenu}
                    >
                        {!isMobileMenuOpen ? (
                            <FontAwesomeIcon icon={faBars} />
                        ) : (
                            <FontAwesomeIcon icon={faXmark} />
                        )}
                    </button>
                    <nav
                        className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ''}`.trim()}
                    >
                        <ul>
                            <li>
                                <NavLink
                                    to="/artwork"
                                    onClick={closeMobileMenu}
                                    end
                                >
                                    Artwork
                                </NavLink>
                            </li>
                            {user.role === 'Curator' ? (
                                <li>
                                    <NavLink
                                        to="/reports"
                                        onClick={closeMobileMenu}
                                        end
                                    >
                                        Reports
                                    </NavLink>
                                </li>
                            ) : null}
                            {user.role === 'IT' ? (
                                <li>
                                    <NavLink
                                        to="/users"
                                        onClick={closeMobileMenu}
                                    >
                                        Users
                                    </NavLink>
                                </li>
                            ) : null}
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            ) : null}
        </header>
    );
};

export default Header;
