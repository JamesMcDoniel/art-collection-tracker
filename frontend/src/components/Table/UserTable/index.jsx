import { useState } from 'react';
import { Table, TableHeader } from '..';
import {
    Input,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
} from '@headlessui/react';
import { useTableSort } from '../../../hooks/useTableSort';
import { useUserContext } from '../../../hooks/useUserContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSquare,
    faSquareCheck,
    faCircleXmark,
    faCircleCheck,
    faPenToSquare
} from '@fortawesome/free-regular-svg-icons';
import { faBan, faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../../helpers/date';
import styles from '../Table.module.css';

const columns = [
    'email',
    'firstName',
    'lastName',
    'role',
    'createdAt',
    'notes',
    'disabled',
    'edit',
    'delete'
];

const roles = ['Curator', 'Facilities', 'IT', 'Guest'];

const EditableRow = ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [changes, setChanges] = useState(null);
    const [error, setError] = useState({
        firstName: false,
        lastName: false
    });
    const { editUser, toggleDisabled, deleteUser } = useUserContext();
    const { user } = useAuthContext();

    const handleStartEdit = () => {
        setChanges(data);
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { value, name } = e.target;

        setChanges((prev) => ({
            ...prev,
            [name]: value === '' ? null : value
        }));
    };

    const handleSubmitChanges = async () => {
        if (!changes) return; // Shouldn't be possible, but just in case.

        // FirstName and LastName are required, but I have to do this w/out
        // a form...
        if (!changes.firstName) {
            setError((prev) => ({ ...prev, firstName: true }));
        }
        if (!changes.lastName) {
            setError((prev) => ({ ...prev, lastName: true }));
        }

        if (error.firstName || error.lastName) {
            return;
        }

        await editUser(data.id, changes);

        setIsEditing(false);
        setError({ firstName: false, lastName: false });
    };

    const handleCancelEdit = () => {
        setChanges(data);
        setIsEditing(false);
        setError({ firstName: false, lastName: false });
    };

    return (
        <tr id={`row-${data.id}`}>
            <td>{data.email}</td>
            <td>
                {isEditing ? (
                    <Input
                        className={`${styles.table_input} ${changes.firstName !== data.firstName ? styles.active : ''} ${error.firstName ? styles.input_error : ''}`.trim()}
                        aria-labelledby={`row-${data.id} col-firstName`}
                        name="firstName"
                        type="text"
                        value={changes.firstName ?? ''}
                        onChange={handleChange}
                        required
                    />
                ) : (
                    data.firstName
                )}
            </td>
            <td>
                {isEditing ? (
                    <Input
                        className={`${styles.table_input} ${changes.lastName !== data.lastName ? styles.active : ''} ${error.lastName ? styles.input_error : ''}`.trim()}
                        aria-labelledby={`row-${data.id} col-lastName`}
                        name="lastName"
                        type="text"
                        value={changes.lastName ?? ''}
                        onChange={handleChange}
                        required
                    />
                ) : (
                    data.lastName
                )}
            </td>
            <td>
                {isEditing && user.email !== 'default_admin' ? (
                    <Listbox
                        value={changes.role}
                        onChange={(value) =>
                            setChanges((prev) => ({ ...prev, role: value }))
                        }
                    >
                        <ListboxButton
                            className={`${styles.table_listbox_button} ${changes.role !== data.role ? styles.active : ''}`}
                        >
                            {changes.role}
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions
                            anchor="bottom"
                            transition
                            className={styles.table_listbox_options}
                        >
                            {roles.map((role) => (
                                <ListboxOption
                                    key={role}
                                    value={role}
                                    className={styles.table_listbox_option}
                                >
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={styles.table_listbox_check}
                                    />
                                    <div
                                        className={
                                            styles.table_listbox_option_text
                                        }
                                    >
                                        {role}
                                    </div>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                ) : (
                    data.role
                )}
            </td>
            <td>{formatDate(data.createdAt)}</td>
            <td>
                {isEditing ? (
                    <Input
                        className={styles.table_input}
                        aria-labelledby={`row-${data.id} col-notes`}
                        name="notes"
                        type="text"
                        value={changes.notes ?? ''}
                        onChange={handleChange}
                    />
                ) : (
                    data.notes
                )}
            </td>
            <td>
                <button onClick={() => toggleDisabled(data.id)}>
                    <FontAwesomeIcon
                        icon={data.disabled ? faSquareCheck : faSquare}
                    />
                </button>
            </td>
            <td>
                {!isEditing ? (
                    <button
                        aria-label="Edit"
                        type="button"
                        onClick={handleStartEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                ) : (
                    <div className={styles.edit_controls}>
                        <button
                            aria-label="Save Edit"
                            type="button"
                            onClick={handleSubmitChanges}
                        >
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </button>
                        <button
                            aria-label="Cancel Edit"
                            type="button"
                            onClick={handleCancelEdit}
                        >
                            <FontAwesomeIcon icon={faBan} />
                        </button>
                    </div>
                )}
            </td>
            <td>
                <button onClick={() => deleteUser(data.id)}>
                    <FontAwesomeIcon
                        className={styles.delete}
                        icon={faCircleXmark}
                    />
                </button>
            </td>
        </tr>
    );
};

const UserTable = ({ data }) => {
    const { sort, sortedData, handleSort } = useTableSort(data);

    return (
        <Table
            className={styles.users_table}
            Header={columns.map((column) => (
                <TableHeader
                    key={column}
                    title={column}
                    sort={sort}
                    handleSort={handleSort}
                />
            ))}
            Rows={sortedData.map((user) => (
                <EditableRow
                    key={user.id}
                    data={user}
                />
            ))}
        />
    );
};

export default UserTable;
