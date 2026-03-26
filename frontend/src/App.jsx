import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/Auth/AuthProvider';
import RootRedirect from './components/Routes/RootRedirect';
import ProtectedRoutes from './components/Routes/ProtectedRoutes';
import Layout from './components/Layout';
import ArtworkDetail from './pages/ArtworkDetail';
import Collection from './pages/Collection';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import ReportsDetail from './pages/ReportsDetail';
import Unauthorized from './pages/Unauthorized';
import Users from './pages/Users';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        {/* Redirect '/' to '/login', or '/collection' */}
                        <Route
                            path="/"
                            element={<RootRedirect />}
                        />

                        {/* Unauthenticated Routes */}
                        <Route
                            path="/login"
                            element={<Login />}
                        />
                        <Route
                            path="/unauthorized"
                            element={<Unauthorized />}
                        />

                        {/* Authenticated Routes */}
                        <Route element={<ProtectedRoutes />}>
                            <Route
                                path="/collection"
                                element={<Collection />}
                            />
                            <Route
                                path="/artwork/:id"
                                element={<ArtworkDetail />}
                            />
                        </Route>

                        {/* Authenticated and ONLY IT role */}
                        <Route element={<ProtectedRoutes roles={['IT']} />}>
                            <Route
                                path="/users"
                                element={<Users />}
                            />
                        </Route>

                        {/* Authenticated and ONLY Curator role */}
                        <Route
                            element={<ProtectedRoutes roles={['Curator']} />}
                        >
                            <Route
                                path="/reports"
                                element={<Reports />}
                            />
                            <Route
                                path="/reports/:id"
                                element={<ReportsDetail />}
                            />
                        </Route>

                        {/* Wildcard, catch-all route */}
                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
