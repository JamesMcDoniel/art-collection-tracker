import { useContext } from 'react';
import { UserContext } from '../contexts/User/UserContext';

export const useUserContext = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('UserContext must be used within an UserProvider');
    }

    return context;
};
