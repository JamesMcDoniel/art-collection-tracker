import { useState } from 'react';
import { useUserContext } from '../../hooks/useUserContext';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogBackdrop,
    Button
} from '@headlessui/react';
import TextInput from '../TextInput';
import DropDown from '../DropDown';
import styles from './UserDialog.module.css';

const Roles = ['Curator', 'Facilities', 'IT', 'Guest'];

const UserDialog = ({ isOpen, onClose }) => {
    const [user, setUser] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const { createUser } = useUserContext();

    const handleChange = (value, field) => {
        setUser((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimUser = Object.fromEntries(
            Object.entries(user).map(([key, value]) => [key, value.trim()])
        );
        const invalidFields = Object.entries(trimUser)
            .filter(([, value]) => value === '')
            .map(([key]) => key);

        if (invalidFields.length > 0) {
            setErrorFields(invalidFields);
            setErrorMessage('All fields required');
            return;
        }

        try {
            await createUser(trimUser);
            setIsSubmitted(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleClose = () => {
        onClose();

        // Reset State - After close animation is finished
        setTimeout(() => {
            setUser({
                email: '',
                firstName: '',
                lastName: '',
                role: ''
            });
            setErrorFields([]);
            setErrorMessage(null);
            setIsSubmitted(false);
        }, 300);
    };

    return (
        <Dialog
            className={`${styles.container} ${errorFields.map((field) => styles[field]).join(' ')}`.trim()}
            open={isOpen}
            onClose={handleClose}
        >
            <DialogBackdrop
                className={styles.backdrop}
                transition
            />
            <div className={styles.wrapper}>
                <DialogPanel
                    className={styles.panel}
                    transition
                >
                    {!isSubmitted ? (
                        <>
                            <DialogTitle className={styles.title}>
                                Create New User
                            </DialogTitle>
                            <form
                                className={styles.form}
                                onSubmit={handleSubmit}
                            >
                                <TextInput
                                    type="email"
                                    label="Email"
                                    field="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                />
                                <TextInput
                                    type="text"
                                    label="First Name"
                                    field="firstName"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <TextInput
                                    type="text"
                                    label="Last Name"
                                    field="lastName"
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={handleChange}
                                    required
                                />
                                <DropDown
                                    label="Role"
                                    list={Roles}
                                    value={user.role}
                                    onChange={(value) =>
                                        setUser((prev) => ({
                                            ...prev,
                                            role: value
                                        }))
                                    }
                                />
                                <p
                                    className={styles.error}
                                    aria-label="login-error"
                                    aria-live="assertive"
                                >
                                    {errorMessage}
                                </p>
                                <div className={styles.buttons}>
                                    <Button
                                        className={styles.button}
                                        type="submit"
                                    >
                                        Create User
                                    </Button>
                                    <Button
                                        className={styles.button}
                                        type="button"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <DialogTitle className={styles.title}>
                                User Created!
                            </DialogTitle>
                            <div className={styles.success_content}>
                                <p>
                                    The new user has been successfully added to
                                    the database.
                                </p>
                                <p>
                                    A welcome email has been sent to the
                                    registered email address.
                                </p>
                                <Button
                                    className={styles.button}
                                    type="button"
                                    onClick={handleClose}
                                >
                                    Done
                                </Button>
                            </div>
                        </>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default UserDialog;
