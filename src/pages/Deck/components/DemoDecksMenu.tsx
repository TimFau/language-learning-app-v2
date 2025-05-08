import { useEffect, useState } from 'react';
import { Menu, MenuItem, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import deckService from '../../../services/deckService';
import '../../../css/partials/components/decks/DemoDecksMenu.scss';

interface ListItem {
    id: string;
    deck_id: string;
    deck_name: string;
}

interface DemoDecksMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

export default function DemoDecksMenu(props: DemoDecksMenuProps) {
    const { anchorEl, onClose } = props;
    const [error, setError] = useState('');
    const [items, setItems] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        deckService.getDemoDecks().then(
            (result) => {
                setItems(result);
                setLoading(false);
            },
            (error) => {
                setError('Failed to load demo decks. Please try again later.');
                console.error(error);
                setLoading(false);
            }
        );
    }, []);

    const handleDeckSelect = (deck: ListItem) => {
        navigate(`/deck?name=${encodeURIComponent(deck.deck_name)}&id=${deck.deck_id}&isDemo=true`);
        onClose();
    };

    // Applying a class for PaperProps to allow SCSS targeting
    const paperProps = {
        className: 'demo-menu-paper',
        style: { maxHeight: 400, width: '300px' }, // Example inline, can be moved to SCSS
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            MenuListProps={{
                'aria-labelledby': 'demo-decks-button',
            }}
            PaperProps={paperProps}
        >
            <div className="menu-header-container">
                <Typography variant="h6" component="h2" className="title">
                    Explore a Demo Deck
                </Typography>
                <Typography variant="body2" className="subtitle">
                    Choose a sample deck to try LangPulse instantly.
                </Typography>
            </div>
            {loading && (
                <MenuItem disabled style={{ justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                </MenuItem>
            )}
            {error && (
                <MenuItem disabled>
                    <Typography color="error">{error}</Typography>
                </MenuItem>
            )}
            {!loading && !error && items.length === 0 && (
                <MenuItem disabled>No demo decks available.</MenuItem>
            )}
            {!loading && !error && items.map(item => (
                <MenuItem
                    key={item.id.toString()}
                    onClick={() => handleDeckSelect(item)}
                >
                    {item.deck_name}
                </MenuItem>
            ))}
        </Menu>
    );
} 