import { useState } from 'react';
import {
    Field,
    Label,
    Input,
    Button,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
} from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faAngleDown,
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import styles from './Search.module.css';

const Search = ({ onSearch, filterOptions }) => {
    const [query, setQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        onSearch(query, selectedFilter);
    };

    return (
        <div className={styles.container}>
            <Field className={styles.search}>
                <Label className={styles.label}>Search</Label>
                <form
                    className={styles.search_container}
                    onSubmit={handleSearch}
                >
                    <Input
                        className={styles.search_input}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button
                        className={styles.search_button}
                        type="submit"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </form>
            </Field>
            <Field className={styles.filter}>
                <Label className={styles.label}>Search Filters</Label>
                <Listbox
                    value={selectedFilter}
                    onChange={setSelectedFilter}
                >
                    <ListboxButton
                        className={`${styles.button} ${selectedFilter !== '' ? styles.active : ''}`}
                    >
                        {selectedFilter === ''
                            ? 'None (Search All)'
                            : selectedFilter.charAt(0).toUpperCase() +
                              selectedFilter.slice(1)}
                        <FontAwesomeIcon icon={faAngleDown} />
                    </ListboxButton>
                    <ListboxOptions
                        className={styles.options}
                        anchor="bottom"
                        transition
                    >
                        <ListboxOption
                            className={styles.option}
                            value=""
                        >
                            <FontAwesomeIcon
                                className={styles.check}
                                icon={faCheck}
                            />
                            <div className={styles.option_text}>
                                None (Search All)
                            </div>
                        </ListboxOption>
                        {filterOptions.map((option) => (
                            <ListboxOption
                                key={option}
                                className={styles.option}
                                value={option}
                            >
                                <FontAwesomeIcon
                                    className={styles.check}
                                    icon={faCheck}
                                />
                                <div className={styles.option_text}>
                                    {option.charAt(0).toUpperCase() +
                                        option.slice(1)}
                                </div>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Listbox>
            </Field>
        </div>
    );
};

export default Search;
