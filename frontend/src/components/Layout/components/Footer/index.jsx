import { useLocation } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookF,
    faXTwitter,
    faYoutube,
    faPinterest,
    faInstagram,
    faWordpress
} from '@fortawesome/free-brands-svg-icons';

import styles from './Footer.module.css';

const Footer = () => {
    const location = useLocation();

    // Only display on the Login screen
    return location.pathname === '/login' ? (
        <footer className={styles.container}>
            <div className={styles.socials}>
                <a
                    className={styles.social_link}
                    href="https://www.facebook.com/ASUMH"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                    className={styles.social_link}
                    href="https://www.x.com/asumountainhome"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <a
                    className={styles.social_link}
                    href="https://www.youtube.com/user/ASUMountainHome"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faYoutube} />
                </a>
                <a
                    className={styles.social_link}
                    href="https://www.pinterest.com/asumh/"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faPinterest} />
                </a>
                <a
                    className={styles.social_link}
                    href="https://www.instagram.com/asumountainhome/"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                    className={styles.social_link}
                    href="https://www.asumh.wordpress.com/"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faWordpress} />
                </a>
            </div>
            <div className={styles.information}>
                <div className={styles.info_row}>
                    <div className={styles.info_container}>
                        &copy; {new Date().getFullYear()} Arkansas State
                        University-Mountain Home
                    </div>
                    <div className={styles.info_container}>
                        Built by James McDoniel
                    </div>
                    <div className={styles.info_container}>
                        <a
                            className={styles.info_link}
                            href="https://asumh.edu/pages/privacy-policy/"
                            target="_blank"
                        >
                            Privacy Policy
                        </a>
                    </div>
                    <div className={styles.info_container}>
                        <a
                            className={styles.info_link}
                            href="https://asusystem.edu/offices/internal-audit/report-issue-abuse-fraud/"
                            target="_blank"
                        >
                            Report Issue/Abuse/Fraud
                        </a>
                    </div>
                </div>
                <div className={styles.info_row}>
                    <div className={styles.info_container}>
                        1600 South College St.
                    </div>
                    <div className={styles.info_container}>
                        Mountain Home, AR 72653
                    </div>
                    <div className={styles.info_container}>
                        <a
                            className={styles.info_link}
                            href="tel:+18705086100"
                        >
                            870.508.6100
                        </a>
                    </div>
                    <div className={styles.info_container}>
                        <a
                            className={styles.info_link}
                            href="https://www.asusystem.edu/transparency/"
                            target="_blank"
                        >
                            ASU System Fiscal Accountability and Transparency
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    ) : null;
};

export default Footer;
