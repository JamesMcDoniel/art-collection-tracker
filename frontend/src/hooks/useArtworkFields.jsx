import { useState, useCallback } from 'react';

export const useArtworkFields = () => {
    const [fields, setFields] = useState({
        collection: '',
        category: '',
        artist: '',
        medium: '',
        location: '',
        loan_Status: '',
        donor: ''
    });

    const updateField = useCallback((key) => (value) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    }, []);

    return { fields, updateField };
};
