import { useContext } from 'react';
import { ReportContext } from '../contexts/Report/ReportContext';

export const useReportContext = () => {
    const context = useContext(ReportContext);

    if (!context) {
        throw new Error('ReportContext must be used within an ReportProvider');
    }

    return context;
};
