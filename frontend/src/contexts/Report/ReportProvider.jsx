import { useState, useEffect, useCallback, useMemo } from 'react';
import { ReportContext } from './ReportContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { saveAs } from 'file-saver';

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, authFetch } = useAuthContext();

    const fetchReports = useCallback(async () => {
        try {
            const response = await authFetch('/api/report', {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            });
            const data = await response.json();

            setReports(data);
        } catch (error) {
            console.log(error);
            setReports([]);
        } finally {
            setIsLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        if (!user) return;

        fetchReports();
    }, [user, fetchReports]);

    const generateReport = useCallback(
        async (obj) => {
            setIsLoading(true);
            try {
                await authFetch('/api/report', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                });

                await fetchReports();
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        },
        [authFetch, fetchReports]
    );

    const uploadReports = useCallback(
        async (files) => {
            setIsLoading(true);
            try {
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append('reports', file);
                });

                await authFetch('/api/report/upload', {
                    method: 'POST',
                    body: formData
                });

                fetchReports();
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        },
        [authFetch, fetchReports]
    );

    const downloadReport = useCallback(
        async (id, fileName) => {
            try {
                const response = await authFetch(`/api/report/${id}/download`);
                if (!response.ok) {
                    throw new Error('Download Failed');
                }
                const blob = await response.blob();

                saveAs(blob, fileName);
            } catch (error) {
                console.log(error);
            }
        },
        [authFetch]
    );

    const previewReport = useCallback(
        async (id) => {
            setIsLoading(true);

            const response = await authFetch(`/api/report/${id}/preview`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok && response.status === '204') {
                setPreview(null);
                return;
            }

            const data = await response.json();

            setPreview(data);
            setIsLoading(false);
        },
        [authFetch]
    );

    const deleteReport = useCallback(
        async (id) => {
            const response = await authFetch(`/api/report/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setReports((prev) => prev.filter((report) => report.id !== id));
            }
        },
        [authFetch]
    );

    const value = useMemo(
        () => ({
            reports,
            preview,
            isLoading,
            generateReport,
            uploadReports,
            downloadReport,
            previewReport,
            deleteReport
        }),
        [
            reports,
            preview,
            isLoading,
            generateReport,
            uploadReports,
            downloadReport,
            previewReport,
            deleteReport
        ]
    );

    return (
        <ReportContext.Provider value={value}>
            {children}
        </ReportContext.Provider>
    );
};
