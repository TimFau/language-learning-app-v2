import { createContext, useState } from 'react';

type deck = {
  deck_name?: string,
  deck_id?: string,
  id?: string,
  Language1?: string,
  Language2?: string,
  isPublic?: boolean
}

interface ModalContextProps {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  mode: string;
  setModeEdit: () => void;
  existingDeck?: deck | null;
  setDeck: (deck: deck) => void;
  resetDeck?: () => void;
}

const defaultState = {
    isModalOpen: false,
    mode: 'add',
    setModeEdit: () => {},
    setDeck: () => {},
    openModal: () => {},
    closeModal: () => {}
}

const ModalContext = createContext<ModalContextProps>(defaultState);

export const ModalContextProvider = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [existingDeck, setExistingDeck] = useState<deck | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setMode('add');
    setExistingDeck({})
    setIsModalOpen(false);
  }
  const setModeEdit = () => setMode('edit');
  const setDeck = (deck: deck) => setExistingDeck(deck);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, mode, setModeEdit, existingDeck, setDeck }}>
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalContext