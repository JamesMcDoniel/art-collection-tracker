import { useNavigate } from 'react-router';
import styles from './Forbidden.module.css';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1>Forbidden</h1>
            <p>
                The page you're looking for requires higher permissions or is
                restricted to specific roles.
            </p>
            <div>
                <button onClick={() => navigate(-1)}>Go Back</button>
                <button onClick={() => navigate('/')}>Go Home</button>
            </div>
        </div>
    );
};

export default Forbidden;
