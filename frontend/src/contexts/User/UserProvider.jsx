import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserContext } from './UserContext';
import { useAuthContext } from '../../hooks/useAuthContext';

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, authFetch } = useAuthContext();

    const fetchUsers = useCallback(async () => {
        try {
            const response = await authFetch('/api/auth/users', {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            });
            const data = await response.json();

            setUsers(data);
        } catch (error) {
            console.log(error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        if (!user || user.role !== 'IT') return;

        fetchUsers();
    }, [user, fetchUsers]);

    const createUser = useCallback(
        async (user) => {
            const response = await authFetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                let errorMessage = 'Something went wrong';

                try {
                    const errorResponse = await response.text();
                    errorMessage = errorResponse || errorMessage;
                } catch (error) {
                    console.log(error);
                }

                throw new Error(errorMessage);
            }

            await fetchUsers();
        },
        [authFetch, fetchUsers]
    );

    const editUser = useCallback(
        async (id, user) => {
            try {
                const response = await authFetch(`/api/auth/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });

                if (response.ok) {
                    setUsers((prev) =>
                        prev.map((usr) =>
                            usr.id === id ? { ...usr, ...user } : usr
                        )
                    );
                }
            } catch (error) {
                console.log(error);
            }
        },
        [authFetch]
    );

    const toggleDisabled = useCallback(
        async (id) => {
            try {
                setUsers((prev) => {
                    const user = prev.find((user) => user.id === id);
                    if (!user) throw new Error('User not found');

                    const isDisabled = !user.disabled;

                    authFetch(`/api/auth/users/${id}/disabled`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ disabled: isDisabled })
                    }).catch(console.log);

                    return prev.map((user) =>
                        user.id === id
                            ? { ...user, disabled: isDisabled }
                            : user
                    );
                });
            } catch (error) {
                console.log(error);
            }
        },
        [authFetch]
    );

    const deleteUser = useCallback(
        async (id) => {
            try {
                const response = await authFetch(`/api/auth/users/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setUsers((prev) => prev.filter((user) => user.id !== id));
                }
            } catch (error) {
                console.log(error);
            }
        },
        [authFetch]
    );

    const value = useMemo(
        () => ({
            users,
            isLoading,
            createUser,
            editUser,
            toggleDisabled,
            deleteUser
        }),
        [users, isLoading, createUser, editUser, toggleDisabled, deleteUser]
    );

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
