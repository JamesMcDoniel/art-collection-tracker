import { useAuthContext } from '../../../../hooks/useAuthContext';
import styles from './Drawer.module.css';

const Drawer = ({ isOpen }) => {
    const { user } = useAuthContext();
    // Eventually, something like useArtworkContext() to store inventory items
    // - Make sure ArtworkContext doesn't fetch if (!user)

    return user ? (
        <aside className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            {/* Map the Artwork Items here, only use Title */}
        </aside>
    ) : null;
};

export default Drawer;
