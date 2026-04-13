import { Navigate, useNavigate } from 'react-router';
import { useAuthContext } from '../../hooks/useAuthContext';
import styles from './NotFound.module.css';

const NotFound = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // If it's an authenticated user, show a 404 screen, otherwise
    // redirect to login page.
    return user ? (
        <div className={styles.container}>
            <h1>Not Found</h1>
            <p>
                The page or resource you're looking for does not exist or has
                been moved.
            </p>
            <div>
                <button onClick={() => navigate(-1)}>Go Back</button>
                <button onClick={() => navigate('/')}>Go Home</button>
            </div>
        </div>
    ) : (
        <Navigate
            to={'/login'}
            replace
        />
    );
};

export default NotFound;
