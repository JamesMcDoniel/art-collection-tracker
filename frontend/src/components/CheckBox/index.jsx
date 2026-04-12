import { Checkbox, Field, Label } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './CheckBox.module.css';

const CheckBox = ({ label, checked, onChange }) => {
    return (
        <Field className={styles.container}>
            <Label>{label}</Label>
            <Checkbox
                checked={checked}
                onChange={onChange}
                className={styles.checkbox}
            >
                <FontAwesomeIcon
                    icon={faCheck}
                    className={styles.check}
                />
            </Checkbox>
        </Field>
    );
};

export default CheckBox;
