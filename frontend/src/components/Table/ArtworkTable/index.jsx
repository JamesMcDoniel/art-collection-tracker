import { memo, useMemo } from 'react';
import { Link } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useTableSort } from '../../../hooks/useTableSort';
import { Table, TableHeader } from '..';
import styles from '../Table.module.css';

const columns = [
    'asset_Num',
    'title',
    'dimensions',
    'description',
    'collection',
    'category',
    'artist',
    'medium',
    'location',
    'loan_Status',
    'donor',
    'retail_Low_Estimate',
    'retail_High_Estimate'
];
const curatorColumns = ['retail_Low_Estimate', 'retail_High_Estimate'];

const ArtworkRow = memo(({ artwork, isPreview, columns }) => {
    return (
        <tr>
            {columns.map((column) => {
                const value = artwork[column];

                if (column === 'title') {
                    return (
                        <td key={column}>
                            {!isPreview ? (
                                <Link
                                    className={styles.row_link}
                                    to={`/artwork/${artwork.id}`}
                                >
                                    {value}
                                </Link>
                            ) : (
                                value
                            )}
                        </td>
                    );
                }

                if (
                    column === 'retail_Low_Estimate' ||
                    column === 'retail_High_Estimate'
                ) {
                    return (
                        <td
                            key={column}
                            className={styles.align_right}
                        >
                            {value != null
                                ? value.toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD'
                                  })
                                : ''}
                        </td>
                    );
                }

                return <td key={column}>{value ?? ''}</td>;
            })}
        </tr>
    );
});

const ArtworkTable = ({ data, isPreview = false }) => {
    const { user } = useAuthContext();
    const { sort, sortedData, handleSort } = useTableSort(data);

    const filteredColumns = useMemo(() => {
        if (user.role === 'Curator') {
            return columns;
        }

        return columns.filter((column) => !curatorColumns.includes(column));
    }, [user]);

    const rows = useMemo(
        () =>
            sortedData.map((artwork) => (
                <ArtworkRow
                    key={artwork.id ?? artwork.title}
                    artwork={artwork}
                    columns={filteredColumns}
                    isPreview={isPreview}
                />
            )),
        [sortedData, filteredColumns, isPreview]
    );

    return (
        <Table
            Header={filteredColumns.map((column) => (
                <TableHeader
                    key={column}
                    title={column}
                    sort={sort}
                    handleSort={handleSort}
                />
            ))}
            Rows={rows}
        />
    );
};

export default ArtworkTable;
