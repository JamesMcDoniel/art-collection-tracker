import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './SplitButton.module.css';

const SplitButton = ({ label, onClick, options = [] }) => {
    return (
        <div className={styles.container}>
            <Button
                className={styles.button}
                onClick={onClick}
            >
                <FontAwesomeIcon
                    className={styles.button_icon}
                    icon={faPlus}
                />
                {label}
            </Button>
            <Menu>
                <MenuButton className={styles.menu_button}>
                    <FontAwesomeIcon icon={faChevronDown} />
                </MenuButton>
                <MenuItems
                    className={styles.menu_items}
                    anchor="bottom end"
                    transition
                >
                    {options.map((option) => (
                        <MenuItem key={option.label}>
                            <button
                                className={styles.menu_item}
                                type="button"
                                onClick={option.onClick}
                            >
                                {option.label}
                            </button>
                        </MenuItem>
                    ))}
                </MenuItems>
            </Menu>
        </div>
    );
};

export default SplitButton;
