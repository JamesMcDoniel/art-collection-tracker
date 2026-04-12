import styles from './Content.module.css';

const Content = ({ children }) => {
    return <main className={styles.container}>{children}</main>;
};

export default Content;
