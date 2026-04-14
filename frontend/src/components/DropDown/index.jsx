import {
    Field,
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
} from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './DropDown.module.css';

const DropDown = ({ label, list, value, onChange, hasNone = true }) => {
    const options = list || [];

    return (
        <Field className={styles.container}>
            <Label>{label}</Label>
            <Listbox
                value={value}
                onChange={onChange}
            >
                <ListboxButton
                    className={`${styles.button} ${value !== '' ? styles.active : ''}`}
                >
                    {value === '' ? 'None' : value}
                    <FontAwesomeIcon
                        icon={faAngleDown}
                        aria-hidden="true"
                    />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    transition
                    className={styles.options}
                >
                    {hasNone ? (
                        <ListboxOption
                            value=""
                            className={styles.option}
                        >
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={styles.check}
                            />
                            <div className={styles.option_text}>None</div>
                        </ListboxOption>
                    ) : null}
                    {options.map((option) => (
                        <ListboxOption
                            key={option}
                            value={option}
                            className={styles.option}
                        >
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={styles.check}
                            />
                            <div className={styles.option_text}>{option}</div>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </Field>
    );
};

export default DropDown;
