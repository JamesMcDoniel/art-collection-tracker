import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useArtworkContext } from '../../hooks/useArtworkContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import ArtworkTable from '../../components/Table/ArtworkTable';
import Search from '../../components/Search';
import SplitButton from '../../components/SplitButton';
import Loading from '../../components/Loading';
import styles from './Artwork.module.css';

const ArtworkFields = [
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

const Artwork = () => {
    const [search, setSearch] = useState({ query: '', filter: '' });
    const { artworks, isLoading } = useArtworkContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleSearch = useCallback((query, filter) => {
        setSearch({ query, filter });
    }, []);

    const filteredArtworks = useMemo(() => {
        const { query, filter } = search;

        return artworks.filter((artwork) => {
            const searchTerm = query.toLowerCase();

            if (filter === '') {
                return Object.values(artwork).some((value) =>
                    String(value).toLowerCase().includes(searchTerm)
                );
            }

            return String(artwork[filter]).toLowerCase().includes(searchTerm);
        });
    }, [artworks, search]);

    const handleMenuClick = () => navigate('/artwork/new');

    const menuOptions = [
        {
            label: 'Upload Spreadsheet',
            onClick: () => navigate('/artwork/upload')
        }
    ];

    return !isLoading.artworks ? (
        artworks.length > 0 ? (
            <>
                <div className={styles.search_container}>
                    <Search
                        filterOptions={ArtworkFields}
                        onSearch={handleSearch}
                    />
                    {user.role === 'Curator' ? (
                        <>
                            <div className={styles.search_separator} />
                            <SplitButton
                                label="New"
                                onClick={handleMenuClick}
                                options={menuOptions}
                            />
                        </>
                    ) : null}
                </div>
                <div className={styles.table_container}>
                    <ArtworkTable data={filteredArtworks} />
                </div>
            </>
        ) : (
            <>
                {user.role === 'Curator' ? (
                    <section className={styles.container}>
                        <div className={styles.getting_started}>
                            <div className={styles.instructions}>
                                <h2>Getting Started</h2>
                                <p>
                                    Choose an option below to add an individual
                                    artwork item or bulk upload items exported
                                    from Microsoft Access.
                                </p>
                            </div>
                            <div className={styles.options}>
                                <button
                                    className={styles.new}
                                    type="button"
                                    onClick={() => navigate('/artwork/new')}
                                >
                                    <FontAwesomeIcon icon={faPalette} />
                                    <span>Individual Artwork</span>
                                </button>
                                <div className={styles.separator} />
                                <button
                                    className={styles.upload}
                                    type="button"
                                    onClick={() => navigate('/artwork/upload')}
                                >
                                    <FontAwesomeIcon icon={faFileExcel} />
                                    <span>Spreadsheet Upload</span>
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className={styles.empty}>
                        <h2>No Artwork Found</h2>
                        <p>
                            No artwork found. This could be due to a connection
                            error or because nothing has been uploaded yet.
                        </p>
                        <p>Please try again later</p>
                    </div>
                )}
            </>
        )
    ) : (
        <Loading />
    );
};

export default Artwork;
