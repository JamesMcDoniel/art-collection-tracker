import { Navigate } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const RootRedirect = () => {
    const { user } = useAuthContext();

    const home = user.role === 'IT' ? '/users' : '/artwork';

    return (
        <Navigate
            to={user ? home : '/login'}
            replace
        />
    );
};

export default RootRedirect;
