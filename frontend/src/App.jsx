import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { ArtworkProvider } from './contexts/Artwork/ArtworkProvider';
import RootRedirect from './components/Routes/RootRedirect';
import PublicOnlyRoute from './components/Routes/PublicOnlyRoute';
import ProtectedRoutes from './components/Routes/ProtectedRoutes';
import Layout from './components/Layout';
import Artwork from './pages/Artwork';
import ArtworkDetail from './pages/ArtworkDetail';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import NewArtwork from './pages/NewArtwork';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import ReportsDetail from './pages/ReportsDetail';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import UploadArtwork from './pages/UploadArtwork';
import Users from './pages/Users';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ArtworkProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            {/* Public / Redirect Routes */}
                            <Route index element={<RootRedirect />} />

                            <Route element={<PublicOnlyRoute />}>
                                <Route path="/login" element={<Login />} />
                            </Route>

                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />

                            <Route path="/unauthorized" element={<Unauthorized />} />

                            {/* Authenticated Routes */}
                            <Route element={<ProtectedRoutes />}>
                                <Route path="artwork">
                                    <Route index element={<Artwork />} />

                                    <Route path=":id" element={<ArtworkDetail />} />

                                    <Route element={<ProtectedRoutes roles={['Curator']} />}>
                                        <Route path="new" element={<NewArtwork />} />
                                        <Route path="upload" element={<UploadArtwork />} />
                                    </Route>
                                </Route>

                                {/* Role-Specific Routes */}

                                {/* IT Only */}
                                <Route element={<ProtectedRoutes roles={['IT']} />}>
                                    <Route path="/users" element={<Users />} />
                                </Route>

                                {/* Curator Only */}
                                <Route element={<ProtectedRoutes roles={['Curator']} />}>
                                    <Route path="reports">
                                        <Route index element={<Reports />} />

                                        <Route path=":id" element={<ReportsDetail />} />
                                    </Route>
                                </Route>
                            </Route>

                            {/* Catch-all Wildcard */}
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </ArtworkProvider>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
