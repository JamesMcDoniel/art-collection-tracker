import { memo } from 'react';
import { Textarea, Field, Label } from '@headlessui/react';
import styles from './TextArea.module.css';

const TextArea = memo(
    ({
        label,
        value,
        onChange,
        rows = 4,
        field,
        hasChanged = false,
        trackNew = false,
        ...props
    }) => {
        const handleChange = (e) => {
            onChange(e.target.value, field);
        };

        return (
            <Field className={styles.container}>
                <Label>{label}</Label>
                <Textarea
                    className={`${styles.textarea} ${hasChanged ? styles.active : ''} ${trackNew && value !== '' ? styles.active : ''}`.trim()}
                    value={value ?? ''}
                    onChange={handleChange}
                    rows={rows}
                    {...props}
                />
            </Field>
        );
    }
);

export default TextArea;
