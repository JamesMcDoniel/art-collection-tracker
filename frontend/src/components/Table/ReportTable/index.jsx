import { Link } from 'react-router';
import { Table, TableHeader } from '..';
import { useTableSort } from '../../../hooks/useTableSort';
import { useReportContext } from '../../../hooks/useReportContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import {
    faArrowUpRightFromSquare,
    faDownload
} from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../../helpers/date';
import styles from '../Table.module.css';

const columns = [
    'download',
    'preview',
    'title',
    'createdAt',
    'collection',
    'category',
    'artist',
    'medium',
    'location',
    'loan_Status',
    'donor',
    'omitEstimates',
    'delete'
];

const ReportTable = ({ data }) => {
    const { sort, sortedData, handleSort } = useTableSort(data);
    const { downloadReport, deleteReport } = useReportContext();

    const removeExtension = (title) => {
        const dot = title.lastIndexOf('.');
        return title.substring(0, dot);
    };

    return (
        <Table
            className={styles.report_table}
            Header={columns.map((column) => (
                <TableHeader
                    key={column}
                    title={column}
                    sort={sort}
                    handleSort={handleSort}
                />
            ))}
            Rows={sortedData.map((report) => (
                <tr key={report.id}>
                    <td>
                        <button
                            onClick={() =>
                                downloadReport(report.id, report.title)
                            }
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                    </td>
                    <td>
                        {!report.externalReport ? (
                            <Link
                                to={`/reports/${report.id}?title=${removeExtension(report.title)}`}
                                className={styles.preview_link}
                            >
                                <FontAwesomeIcon
                                    icon={faArrowUpRightFromSquare}
                                />
                            </Link>
                        ) : null}
                    </td>
                    <td>{report.title}</td>
                    <td>{formatDate(report.createdAt)}</td>
                    <td>{report.collection}</td>
                    <td>{report.category}</td>
                    <td>{report.artist}</td>
                    <td>{report.medium}</td>
                    <td>{report.location}</td>
                    <td>{report.loan_Status}</td>
                    <td>{report.donor}</td>
                    <td>{report.omitEstimates ? 'Yes' : ''}</td>
                    <td>
                        <button onClick={() => deleteReport(report.id)}>
                            <FontAwesomeIcon
                                icon={faCircleXmark}
                                className={styles.delete}
                            />
                        </button>
                    </td>
                </tr>
            ))}
        />
    );
};

export default ReportTable;
