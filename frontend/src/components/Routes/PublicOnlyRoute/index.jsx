import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const PublicOnlyRoute = () => {
    // const { user, isLoading } = useAuthContext();
    const { user } = useAuthContext();

    // if (isLoading) {
    //     // Temp placeholder
    //     return <div>Loading...</div>;
    // }

    if (user) {
        // There's no reason for an authenticated user to visit the Login page,
        // so redirect them to their proper landing page.
        return (
            <Navigate
                to={user.role === 'IT' ? '/users' : '/collection'}
                replace
            />
        );
    }

    return <Outlet />;
};

export default PublicOnlyRoute;
