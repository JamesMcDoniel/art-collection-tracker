import { useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import TextInput from '../../components/TextInput';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    const token = decodeURI(searchParams.get('token'));
    const email = searchParams.get('email');

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                token,
                newPassword
            })
        });

        if (!response.ok) {
            setError('Link is invalid or has expired');
            return;
        }

        // Change this to something else
        setError('Password reset successfully');
    };

    return (
        <section className={styles.card}>
            <h1>Set New Password</h1>
            <p>Resetting for:</p>
            <p>{email}</p>
            <form onSubmit={handleReset}>
                <TextInput
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                    required
                />
                <TextInput
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    required
                />
                {error ? <p className={styles.message}>{error}</p> : null}
                <button
                    type="submit"
                    className={styles.submit}
                >
                    Reset Password
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

export default ResetPassword;
