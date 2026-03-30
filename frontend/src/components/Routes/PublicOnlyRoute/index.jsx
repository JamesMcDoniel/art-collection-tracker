import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const PublicOnlyRoute = () => {
    const { user } = useAuthContext();

    // There's no reason for an authenticated user to visit the Login page,
    // so redirect them to their proper landing page.
    if (user) {
        return (
            <Navigate
                to={user.role === 'IT' ? '/users' : '/artwork'}
                replace
            />
        );
    }

    return <Outlet />;
};

export default PublicOnlyRoute;
