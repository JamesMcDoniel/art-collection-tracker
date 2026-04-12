import { memo } from 'react';
import { Field, Input, Label } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './TextInput.module.css';

const TextInput = memo(
    ({
        label,
        value,
        onChange,
        icon,
        field,
        hasChanged = false,
        trackNew = false,
        ...props
    }) => {
        const handleFart = (e) => {
            onChange(e.target.value, field);
        };

        return (
            <Field className={styles.container}>
                <Label className={styles.label}>{label}</Label>
                <div className={styles.wrapper}>
                    {icon ? (
                        <div className={styles.icon_container}>
                            <FontAwesomeIcon icon={icon} />
                        </div>
                    ) : null}
                    <Input
                        className={`${styles.input} ${icon ? styles.with_icon : ''} ${hasChanged ? styles.active : ''} ${trackNew && value !== '' ? styles.active : ''}`.trim()}
                        value={value ?? ''}
                        onChange={handleFart}
                        {...props}
                    />
                </div>
            </Field>
        );
    }
);
export default TextInput;
