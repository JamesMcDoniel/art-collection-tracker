import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const ProtectedRoutes = ({ roles }) => {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        // Temporary placeholder
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (roles && !roles.includes(user.role)) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoutes;
