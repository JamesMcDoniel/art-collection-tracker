import { useParams } from 'react-router';

const ArtworkDetail = () => {
    const { id } = useParams();

    return <div>Artwork: {id}</div>;
};

export default ArtworkDetail;
