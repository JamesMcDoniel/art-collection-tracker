import { useState, memo } from 'react';
import {
    Field,
    Label,
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption
} from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './ComboBox.module.css';

const ComboBox = memo(
    ({
        label,
        list,
        value,
        onChange,
        disabled,
        field,
        hasChanged = false,
        trackNew = false
    }) => {
        const [query, setQuery] = useState('');
        const options = list || [];

        const filteredOptions =
            query === ''
                ? options
                : options.filter((option) =>
                      option.toLowerCase().includes(query.toLowerCase())
                  );

        const handleClose = () => {
            if (query !== '' && query !== value) {
                onChange(query, field);
            }

            setQuery('');
        };

        const handleChange = (e) => {
            // I have to check if this is the event object
            // or a regular string value.
            const value = e?.target ? e.target.value : e;

            onChange(value, field);
        };

        return (
            <Field className={styles.container}>
                <Label>{label}</Label>
                <Combobox
                    value={value}
                    onChange={handleChange}
                    onClose={handleClose}
                    disabled={disabled}
                >
                    <div className={styles.wrapper}>
                        <ComboboxInput
                            className={`${styles.input} ${hasChanged ? styles.active : ''} ${trackNew && (value || query) ? styles.active : ''}`.trim()}
                            displayValue={(val) => val || ''}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <ComboboxButton className={styles.button}>
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                className={styles.arrow}
                            />
                        </ComboboxButton>
                    </div>

                    <ComboboxOptions
                        anchor="bottom"
                        transition
                        className={styles.options}
                    >
                        {options.length === 0 ? (
                            <ComboboxOption
                                value=""
                                className={styles.option}
                            >
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={styles.check}
                                />
                                <div className={styles.option_text}>
                                    No previously saved values
                                </div>
                            </ComboboxOption>
                        ) : filteredOptions.length === 0 && query !== '' ? (
                            <ComboboxOption
                                value={query}
                                className={styles.option}
                            >
                                <div className={styles.option_text}>
                                    New {label}: {query}
                                </div>
                            </ComboboxOption>
                        ) : (
                            filteredOptions.map((option) => (
                                <ComboboxOption
                                    key={option}
                                    value={option}
                                    className={styles.option}
                                >
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={styles.check}
                                    />
                                    <div className={styles.option_text}>
                                        {option}
                                    </div>
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </Combobox>
            </Field>
        );
    }
);

export default ComboBox;
