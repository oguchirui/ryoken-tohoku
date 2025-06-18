import SearchFilter from './SearchFilter';
import MapAndContents from './MapAndContents';
import ToRecordPageButton from '@/components/changePageButtons/ToRecordPageButton';
import DeleteModal from '@/components/modals/DeleteModal';

/**
 * HomePageコンポーネント
 * 
 * ホーム画面の主要コンポーネントをまとめて表示する。
 * - 検索フィルター(SearchFilter)
 * - 地図と選択された記録の表示(MapAndContents)
 * - 活動記録作成ページへの遷移ボタン(ToRecordPageButton)
 * - 活動記録削除用モーダル(DeleteModal)
 * 
 * @returns {JSX.Element} ホームページのUI全体
 */
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
