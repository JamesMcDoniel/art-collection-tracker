import { useState } from 'react';
import { Field, Label, Description, Input } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import styles from './FileUpload.module.css';

const FileUpload = ({ files, onChange, onDrop, ...props }) => {
    const [isOver, setIsOver] = useState(false);
    const isActive = files.length > 0;

    const handleDrag = (e) => {
        e.preventDefault();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsOver(true);
        } else if (e.type === 'dragleave') {
            setIsOver(false);
        }
    };

    const handleDrop = (e) => {
        onDrop(e);
        setIsOver(false);
    };

    return (
        <Field className={styles.container}>
            <Label
                className={`${styles.label} ${isOver || isActive ? styles.over : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDrag}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
            >
                <Description className={styles.wrapper}>
                    <FontAwesomeIcon
                        icon={faFileCirclePlus}
                        className={styles.icon}
                        aria-hidden="true"
                    />
                    <span className={styles.title}>
                        Drag and drop file(s) here
                    </span>
                    <span className={styles.subtitle}>or click to browse</span>
                </Description>
                <Input
                    className={styles.input}
                    type="file"
                    onChange={onChange}
                    {...props}
                />
            </Label>
        </Field>
    );
};

export default FileUpload;
