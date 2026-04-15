import { useState } from 'react';
import { Link } from 'react-router';
import { useAuthContext } from '../../hooks/useAuthContext';
import TextInput from '../../components/TextInput';
import { faEnvelope, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import styles from './Login.module.css';

const EMAIL = 'helpdesk@asumh.edu';
const EMAIL_HREF = `mailto:${EMAIL}?subject=Request Access: Artwork Inventory Management&body=Hello,%0D%0AI am requesting a new login for the Artwork Inventory Management system. Could you please look into this at your earliest convinience?%0D%0AThanks,%0D%0A[ENTER-YOUR-NAME]`;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const { login } = useAuthContext();

    const isValidLogin = (user) =>
        email === 'default_admin' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (!isValidLogin(email.trim())) {
                setErrorMessage('Invalid email address');
                return;
            }

            await login(email.trim(), password.trim());
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <section className={styles.card}>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <TextInput
                    label="Email"
                    type="text"
                    value={email}
                    onChange={setEmail}
                    icon={faEnvelope}
                    required
                />
                <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    icon={faUnlockKeyhole}
                    required
                />
                <p
                    className={styles.error}
                    aria-label="login-error"
                    aria-live="assertive"
                >
                    {errorMessage}
                </p>
                <button
                    type="submit"
                    className={styles.submit}
                >
                    Login
                </button>
            </form>
            <Link
                to="/forgot-password"
                className={styles.forgot_link}
            >
                Forgot Password?
            </Link>
            <div className={styles.request_link}>
                <p>Don't Have an Account?</p>
                <a href={EMAIL_HREF}>Request Access</a>
            </div>
        </section>
    );
};

export default Login;
