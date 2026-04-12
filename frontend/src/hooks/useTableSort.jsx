import { useState, useMemo, useCallback } from 'react';

export const useTableSort = (data) => {
    const [sort, setSort] = useState({
        column: null,
        direction: 'none'
    });

    const sortedData = useMemo(() => {
        if (!sort.column || sort.direction === 'none') {
            return data;
        }

        const sorted = [...data].sort((current, next) => {
            const a = current[sort.column];
            const b = next[sort.column];

            if (a === b) return 0;
            if (a == null) return 1;
            if (b == null) return -1;
            // if (a < b) return sort.direction === 'ascending' ? -1 : 1;
            // if (a > b) return sort.direction === 'ascending' ? 1 : -1;
            // return 0;

            const res =
                typeof a === 'string'
                    ? a.localeCompare(b, undefined, {
                          sensitivity: 'base',
                          numeric: true
                      })
                    : a < b
                      ? -1
                      : 1;

            return sort.direction === 'ascending' ? res : -res;
        });

        return sorted;
    }, [data, sort]);

    const handleSort = useCallback((column) => {
        setSort((prev) => {
            if (prev.column !== column) {
                return { column, direction: 'ascending' };
            }

            if (prev.direction === 'ascending') {
                return { column, direction: 'descending' };
            }

            if (prev.direction === 'descending') {
                return { column, direction: 'none' };
            }

            return { column, direction: 'ascending' };
        });
    }, []);

    return { sort, sortedData, handleSort };
};
