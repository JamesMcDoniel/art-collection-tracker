import { memo, useState, useRef, useLayoutEffect } from 'react';
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
        disabled,
        hasChanged = false,
        trackNew = false,
        ...props
    }) => {
        const [isOverflowing, setIsOverflowing] = useState(false);
        const inputRef = useRef(null);

        useLayoutEffect(() => {
            if (!disabled) return;

            const checkOverflow = () => {
                const element = inputRef.current;

                if (element) {
                    setIsOverflowing(element.scrollWidth > element.offsetWidth);
                }
            };

            checkOverflow();

            window.addEventListener('resize', checkOverflow);
            return () => window.removeEventListener('resize', checkOverflow);
        }, [value, disabled]);

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
                        ref={inputRef}
                        className={`${styles.input} ${icon ? styles.with_icon : ''} ${hasChanged ? styles.active : ''} ${trackNew && value !== '' ? styles.active : ''}`.trim()}
                        value={value ?? ''}
                        onChange={handleFart}
                        disabled={disabled}
                        title={disabled && isOverflowing ? value : null}
                        {...props}
                    />
                </div>
            </Field>
        );
    }
);
export default TextInput;
