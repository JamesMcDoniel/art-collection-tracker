import { useState } from 'react';
import { Link } from 'react-router';
import TextInput from '../../components/TextInput';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            setMessage('A reset link has been sent to your email');
        }
    };

    return (
        <section className={styles.card}>
            <h1 className={styles.heading}>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Enter your email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                />
                {message ? <p className={styles.message}>{message}</p> : null}
                <button
                    type="submit"
                    className={styles.submit}
                >
                    Send Reset Link
                </button>
            </form>
            <Link
                className={styles.link}
                to={'/login'}
                replace
            >
                Return to Login
            </Link>
        </section>
    );
};

export default ForgotPassword;
