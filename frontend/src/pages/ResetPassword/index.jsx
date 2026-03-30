import { useState } from 'react';
import { useSearchParams } from 'react-router';

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
        <>
            <h1>Set New Password</h1>
            <p>Resetting for: {email}</p>
            <form onSubmit={handleReset}>
                <div>
                    <label htmlFor="new-password">New Password</label>
                    <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter a new password..."
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password..."
                        required
                    />
                </div>
                <p>{error ? error : ''}</p>
                <button type="submit">Reset Password</button>
            </form>
        </>
    );
};

export default ResetPassword;
