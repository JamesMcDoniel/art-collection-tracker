import { Navigate } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const RootRedirect = () => {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        // Placeholder, For now...
        return <div>Loading...</div>;
    }

    return (
        <Navigate
            to={user ? '/collection' : '/login'}
            replace
        />
    );
};

export default RootRedirect;
