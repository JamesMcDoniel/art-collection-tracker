import { useState } from 'react';
import { Link } from 'react-router';
import { useAuthContext } from '../../hooks/useAuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthContext();

    const handleLogin = (e) => {
        e.preventDefault();
        login(email.trim(), password.trim());
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your username..."
                        required={true}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password..."
                        required={true}
                    />
                </div>

                <button type="submit">Login</button>
            </form>
            <Link to="/forgot-password">Forgot Password</Link>
        </div>
    );
};

export default Login;
