import { useNavigate } from 'react-router';
import { useArtworkContext } from '../../hooks/useArtworkContext';
import { useAuthContext } from '../../hooks/useAuthContext';

const Artwork = () => {
    const { artworks } = useArtworkContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    return artworks.length > 0 ? (
        <>
            {artworks.map((artwork) => (
                <div key={artwork.id}>{artwork.title}</div>
            ))}
        </>
    ) : (
        <>
            {user.role === 'Curator' ? (
                <>
                    <button onClick={() => navigate('/artwork/new')}>
                        New
                    </button>
                    <button onClick={() => navigate('/artwork/upload')}>
                        Upload
                    </button>
                </>
            ) : (
                <p>No content yet</p>
            )}
        </>
    );
};

export default Artwork;
