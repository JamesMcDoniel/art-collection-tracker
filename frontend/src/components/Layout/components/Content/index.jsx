import Drawer from '../Drawer';
import styles from './Content.module.css';

const Content = ({ isOpen, children }) => {
    return (
        <div className={styles.container}>
            <Drawer isOpen={isOpen} />
            <main className={styles.content}>{children}</main>
        </div>
    );
};

export default Content;
