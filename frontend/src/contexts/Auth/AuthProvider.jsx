import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { fetchWrapper } from '../../helpers/fetch';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // On page reload, Check if the user already has an ongoing session,
        // if so, add the session data to state, otherwise clear it.
        const restoreSession = async () => {
            try {
                // The /refresh route does refresh the user's tokens, but it also
                // returns the current session data.
                const response = await fetchWrapper('/api/auth/refresh', {
                    method: 'POST'
                });
                const data = await response.json();

                setUser(data);
            } catch {
                // Ignore errors, this means there wasn't a previous session.
                // Clear the User object, if there was one.
                setUser(null);
            } finally {
                // After session has been restored or cleared, lift the loading
                // state. This toggles the visibility of the UI.
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = useCallback(async (username, password) => {
        // We're using the regular, unauthenticated fetch here because the
        // user wouldn't have tokens, at this point, until after successfully
        // logging in.
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'include', // Lets us retrieve a token back in response.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid Credentials');
            }

            throw new Error('Login failed');
        }

        const data = await response.json();
        setUser(data);
    }, []);

    const logout = useCallback(async () => {
        try {
            // Logout is a protected route, and we need to hit the endpoint
            // to logout because it clears our tokens.
            await fetchWrapper('/api/auth/logout', {
                method: 'POST',
                skipRetry: true // If tokens are expired, no need to refresh them just to logout
            });
        } catch {
            // Blanket catch-all, ignoring any errors
            // because the tokens could already be expired / invalid.
        }

        setUser(null);
    }, []);

    const authFetch = useCallback(
        async (url, options = {}) => {
            try {
                return await fetchWrapper(url, options);
            } catch (error) {
                // fetchWrapper throws an error due to expired refreshTokens, AKA
                // an expired session. If that's the case, Logout.
                if (error.message === 'Session expired') {
                    await logout();
                }

                // Re-throw the error if it's not about the session from
                // fetchWrapper.
                throw error;
            }
        },
        [logout]
    );

    const value = useMemo(
        () => ({ user, isLoading, login, logout, authFetch }),
        [user, isLoading, login, logout, authFetch]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
