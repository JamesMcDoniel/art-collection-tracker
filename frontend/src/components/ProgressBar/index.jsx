import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress, isUploading }) => {
    return isUploading ? (
        <div className={styles.container}>
            <div className={styles.label}>
                <span>{progress.file}</span>
                <span>{progress.percent}%</span>
            </div>
            <div className={styles.progress_bar}>
                <div
                    className={styles.progress_fill}
                    style={{
                        width: `${progress.percent}%`
                    }}
                />
            </div>
        </div>
    ) : null;
};

export default ProgressBar;
