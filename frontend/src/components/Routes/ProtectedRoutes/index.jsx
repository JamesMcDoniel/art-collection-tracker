import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const ProtectedRoutes = ({ roles }) => {
    const { user } = useAuthContext();

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
                to="/forbidden"
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoutes;
