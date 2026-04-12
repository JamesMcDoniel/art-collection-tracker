import {
    Field,
    Disclosure,
    DisclosureButton,
    DisclosurePanel
} from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faFile, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import styles from './FileList.module.css';

const FileList = ({ files, onDelete }) => {
    const count = files.length;

    const splitName = (file) => {
        const ext_dot = file.name.lastIndexOf('.');
        const name = file.name.substring(0, ext_dot);
        const ext = file.name.substring(ext_dot);

        return { name, ext };
    };

    return (
        <Field className={styles.container}>
            <Disclosure as="div">
                <DisclosureButton className={styles.button}>
                    <span className={styles.button_text}>
                        {count} file(s) to upload
                    </span>
                    <FontAwesomeIcon
                        icon={faAngleDown}
                        className={styles.arrow}
                    />
                </DisclosureButton>
                <DisclosurePanel
                    transition
                    className={styles.panel}
                >
                    <ul className={styles.list}>
                        {count > 0 ? (
                            files.map((file) => {
                                const { name, ext } = splitName(file);

                                return (
                                    <li
                                        key={file.name}
                                        className={styles.list_item}
                                        title={file.name}
                                    >
                                        <FontAwesomeIcon
                                            icon={faFile}
                                            className={styles.file_icon}
                                        />
                                        <div className={styles.name_wrapper}>
                                            <span className={styles.file_name}>
                                                {name}
                                            </span>
                                            <span className={styles.file_ext}>
                                                &nbsp;
                                                {ext}
                                            </span>
                                        </div>
                                        <button
                                            className={styles.delete}
                                            type="button"
                                            title="Remove from Upload List"
                                            onClick={() => onDelete(file.name)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                            />
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className={styles.empty_list}>
                                No files selected
                            </li>
                        )}
                    </ul>
                </DisclosurePanel>
            </Disclosure>
        </Field>
    );
};

export default FileList;
