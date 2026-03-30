import { Navigate } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const RootRedirect = () => {
    const { user } = useAuthContext();

    return (
        <Navigate
            to={user ? '/artwork' : '/login'}
            replace
        />
    );
};

export default RootRedirect;
