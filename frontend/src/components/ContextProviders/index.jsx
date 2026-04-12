import { BrowserRouter } from 'react-router';
import { AuthProvider } from '../../contexts/Auth/AuthProvider';
import { ArtworkProvider } from '../../contexts/Artwork/ArtworkProvider';
import { ReportProvider } from '../../contexts/Report/ReportProvider';
import { MobileProvider } from '../../contexts/Mobile/MobileProvider';

const ContextProviders = ({ children }) => {
    return (
        <AuthProvider>
            <MobileProvider>
                <BrowserRouter>
                    <ArtworkProvider>
                        <ReportProvider>{children}</ReportProvider>
                    </ArtworkProvider>
                </BrowserRouter>
            </MobileProvider>
        </AuthProvider>
    );
};

export default ContextProviders;
