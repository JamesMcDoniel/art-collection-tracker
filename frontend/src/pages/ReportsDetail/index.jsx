import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useReportContext } from '../../hooks/useReportContext';
import NotFound from '../NotFound';
import Loading from '../../components/Loading';
import ArtworkTable from '../../components/Table/ArtworkTable';
import styles from './ReportsDetail.module.css';

const ReportsDetail = () => {
    const { preview, isLoading, previewReport } = useReportContext();
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchPreview = async () => {
            await previewReport(id);
        };

        fetchPreview();
    }, [id, previewReport]);

    return !isLoading ? (
        preview ? (
            <section className={styles.container}>
                {searchParams ? (
                    <div className={styles.info_container}>
                        <span>{searchParams.get('title')}</span>
                        <span>({preview.length.toLocaleString()} records)</span>
                    </div>
                ) : null}
                <div className={styles.table_container}>
                    <ArtworkTable
                        data={preview}
                        isPreview
                    />
                </div>
            </section>
        ) : (
            <NotFound />
        )
    ) : (
        <Loading />
    );
};

export default ReportsDetail;
