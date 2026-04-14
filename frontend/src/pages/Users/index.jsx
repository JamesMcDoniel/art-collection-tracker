import { useState, useCallback, useMemo } from 'react';
import { useUserContext } from '../../hooks/useUserContext';
import { Button } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/Loading';
import Search from '../../components/Search';
import UserDialog from '../../components/UserDialog';
import UserTable from '../../components/Table/UserTable';
import styles from './Users.module.css';

const UserFields = [
    'email',
    'firstName',
    'lastName',
    'role',
    'createdAt',
    'notes',
    'disabled'
];

const Users = () => {
    const [search, setSearch] = useState({ query: '', filter: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { users, isLoading } = useUserContext();

    const handleSearch = useCallback((query, filter) => {
        setSearch({ query, filter });
    }, []);

    const filteredUsers = useMemo(() => {
        const { query, filter } = search;

        return users.filter((user) => {
            const searchTerm = query.toLowerCase();

            if (filter === '') {
                return Object.values(user).some((value) =>
                    String(value).toLowerCase().includes(searchTerm)
                );
            }

            return String(user[filter]).toLowerCase().includes(searchTerm);
        });
    }, [users, search]);

    return !isLoading ? (
        <section>
            <div className={styles.search_container}>
                <Search
                    filterOptions={UserFields}
                    onSearch={handleSearch}
                />
                <div className={styles.search_separator} />
                <Button
                    className={styles.button}
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <FontAwesomeIcon
                        className={styles.button_icon}
                        icon={faPlus}
                    />
                    New
                </Button>
                <UserDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                />
            </div>
            <div className={styles.table_container}>
                <UserTable data={filteredUsers} />
            </div>
        </section>
    ) : (
        <Loading />
    );
};

export default Users;
