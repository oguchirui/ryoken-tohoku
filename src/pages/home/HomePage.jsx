import SearchFilter from './SearchFilter'
import MapAndContents from './MapAndContents'
import ToRecordPageButton from '@/components/changePageButtons/ToRecordPageButton';
import DeleteModal from '@/components/modals/DeleteModal';

const HomePage = () => {

  return (
    <>
      <SearchFilter />
      <MapAndContents />
      <ToRecordPageButton />
      <DeleteModal />
    </>
  );
};

export default HomePage;
