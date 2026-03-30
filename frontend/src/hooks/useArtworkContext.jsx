import { useContext } from 'react';
import { ArtworkContext } from '../contexts/Artwork/ArtworkContext';

export const useArtworkContext = () => {
    const context = useContext(ArtworkContext);

    if (!context) {
        throw new Error(
            'ArtworkContext must be used within an ArtworkProvider'
        );
    }

    return context;
};
