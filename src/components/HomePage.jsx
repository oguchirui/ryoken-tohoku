import Header from './Header';
import { DeleteModalProvider } from '../context/DeleteModalContext';
import SearchFilter from './SearchFilter'
import MapAndContents from './MapAndContents'
import ToRecordPageButton from './ToRecordPageButton'
import DeleteModal from './DeleteModal';

const HomePage = () => {

  return (
    <>
      <DeleteModalProvider>
        <SearchFilter />
        <MapAndContents />
        <ToRecordPageButton />
        <DeleteModal />
      </DeleteModalProvider>
    </>
  );
};

export default HomePage;
