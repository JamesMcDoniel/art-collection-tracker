import { useState, useMemo } from 'react';
import { useArtworkContext } from '../../hooks/useArtworkContext';
import { useReportContext } from '../../hooks/useReportContext';
import { useMobileContext } from '../../hooks/useMobileContext';
import { useArtworkFields } from '../../hooks/useArtworkFields';
import { useFileUpload } from '../../hooks/useFileUpload';
import Loading from '../../components/Loading';
import Search from '../../components/Search';
import ReportTable from '../../components/Table/ReportTable';
import FileUpload from '../../components/FileUpload';
import DropDown from '../../components/DropDown';
import CheckBox from '../../components/CheckBox';
import FileList from '../../components/FileList';
import styles from './Reports.module.css';

const REPORT_MIME_TYPES = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];
const REPORT_FILE_EXT = ['txt', 'pdf', 'docx', 'xlsx', 'pptx'];
const reportFields = [
    'title',
    'createdAt',
    'collection',
    'category',
    'artist',
    'medium',
    'location',
    'loan_Status',
    'donor',
    'omitEstimates'
];

const Reports = () => {
    const [search, setSearch] = useState({ query: '', filter: '' });
    const [omitEstimates, setOmitEstimates] = useState(false);
    const { artworks, filters, isLoading } = useArtworkContext();
    const {
        reports,
        isLoading: isReportsLoading,
        generateReport
    } = useReportContext();
    const { fields, updateField } = useArtworkFields();
    const {
        files,
        handleFileChange,
        handleFileDrop,
        handleReportUpload,
        handleRemoveFile
    } = useFileUpload({ mime: REPORT_MIME_TYPES, ext: REPORT_FILE_EXT });
    const { isReportMenuOpen } = useMobileContext();

    const handleSearch = (query, filter) => {
        setSearch({ query, filter });
    };

    const filteredReports = useMemo(() => {
        const { query, filter } = search;

        return reports.filter((report) => {
            const searchTerm = query.toLowerCase();

            if (filter === '') {
                return Object.values(report).some((value) =>
                    String(value).toLowerCase().includes(searchTerm)
                );
            }

            return String(report[filter]).toLowerCase().includes(searchTerm);
        });
    }, [reports, search]);

    const filteredData = useMemo(() => {
        return artworks
            .filter((artwork) => {
                return Object.entries(fields).every(([key, value]) => {
                    if (value === '') return true;

                    return artwork[key] === value;
                });
            })
            .map((artwork) => {
                if (!omitEstimates) return artwork;

                // Rename with underscore to quiet the warning about unused variables
                const {
                    retail_Low_Estimate: _,
                    retail_High_Estimate: __,
                    ...rest
                } = artwork;

                return rest;
            });
    }, [artworks, omitEstimates, fields]);

    const handleGenerateReport = async (e) => {
        e.preventDefault();

        const normalizeFilterState = () => {
            const combinedState = {
                ...fields,
                omitEstimates
            };

            return Object.fromEntries(
                Object.entries(combinedState).map(([key, value]) => [
                    key,
                    value === '' ? null : value
                ])
            );
        };

        await generateReport({
            data: filteredData,
            filters: normalizeFilterState()
        });
    };

    return !isLoading.filters ? (
        <div className={styles.container}>
            <aside
                className={`${styles.create_reports} ${isReportMenuOpen ? styles.open : ''}`.trim()}
            >
                <section className={styles.generate_report}>
                    <h2>Generate Report</h2>
                    <form onSubmit={handleGenerateReport}>
                        <DropDown
                            label="Collection"
                            list={filters.collections}
                            value={fields.collection}
                            onChange={updateField('collection')}
                        />
                        <DropDown
                            label="Category"
                            list={filters.categories}
                            value={fields.category}
                            onChange={updateField('category')}
                        />
                        <DropDown
                            label="Artist"
                            list={filters.artists}
                            value={fields.artist}
                            onChange={updateField('artist')}
                        />
                        <DropDown
                            label="Medium"
                            list={filters.mediums}
                            value={fields.medium}
                            onChange={updateField('medium')}
                        />
                        <DropDown
                            label="Location"
                            list={filters.locations}
                            value={fields.location}
                            onChange={updateField('location')}
                        />
                        <DropDown
                            label="Loan Status"
                            list={filters.loan_Statuses}
                            value={fields.loan_Status}
                            onChange={updateField('loan_Status')}
                        />
                        <DropDown
                            label="Donor"
                            list={filters.donors}
                            value={fields.donor}
                            onChange={updateField('donor')}
                        />
                        <CheckBox
                            label="Omit Estimates?"
                            checked={omitEstimates}
                            onChange={setOmitEstimates}
                        />
                        <button type="submit">Generate</button>
                    </form>
                </section>
                <section className={styles.upload_report}>
                    <h2>Upload Reports / Documents</h2>
                    <form onSubmit={handleReportUpload}>
                        <FileUpload
                            accept=".txt, .pdf, .pptx, .docx, .xlsx"
                            files={files}
                            onChange={handleFileChange}
                            onDrop={handleFileDrop}
                        />
                        <FileList
                            files={files}
                            onDelete={handleRemoveFile}
                        />
                        <button type="submit">Upload</button>
                    </form>
                </section>
            </aside>
            <section className={styles.stored_reports}>
                <div className={styles.search_container}>
                    <Search
                        filterOptions={reportFields}
                        onSearch={handleSearch}
                    />
                </div>
                <div className={styles.table_container}>
                    {!isReportsLoading ? (
                        <ReportTable data={filteredReports} />
                    ) : (
                        <Loading />
                    )}
                </div>
            </section>
        </div>
    ) : (
        <Loading />
    );
};

export default Reports;
