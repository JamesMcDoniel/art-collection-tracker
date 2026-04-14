import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowUpShortWide,
    faArrowDownShortWide
} from '@fortawesome/free-solid-svg-icons';
import styles from './Table.module.css';

export const TableHeader = memo(({ title, sort, handleSort }) => {
    return (
        <th
            id={`col-${title}`}
            scope="col"
            aria-sort={sort.column === title ? sort.direction : 'none'}
        >
            <button
                aria-label={`sort by ${title}`}
                onClick={() => handleSort(title)}
            >
                {title}
            </button>
            {sort.column === title && sort.direction !== 'none' ? (
                <FontAwesomeIcon
                    icon={
                        sort.direction === 'ascending'
                            ? faArrowDownShortWide
                            : faArrowUpShortWide
                    }
                    className={styles.sort_icon}
                />
            ) : null}
        </th>
    );
});

export const Table = ({ className, Header, Rows }) => {
    return (
        <table className={`${styles.table} ${className}`}>
            <thead className={styles.table_header}>
                <tr>{Header}</tr>
            </thead>
            <tbody className={styles.table_rows}>{Rows}</tbody>
        </table>
    );
};
