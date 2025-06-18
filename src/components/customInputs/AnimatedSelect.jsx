import Select, { components } from 'react-select';
import { useState } from 'react';

/**
 * カスタムメニューコンポーネント。
 * メニューが開く/閉じるアニメーションのためにクラス名を切り替える。
 *
 * @param {object} props - React Select の Menu コンポーネントが受け取るすべての props。
 * @returns {JSX.Element} カスタムメニュー要素。
 */
const Menu = (props) => {
  return (
    <components.Menu
      {...props}
      // メニューの状態に応じてクラスを切り替え（CSSでアニメーションを適用するため）
      className={`${props.selectProps.menuState === 'closing' ? 'menu-closing' : 'menu-opening'} custom-select__menu`}
    >
      {props.children}
    </components.Menu>
  );
};

/**
 * アニメーション付きのReact Selectコンポーネント。
 * メニュー開閉の状態を内部で管理し、アニメーション用のクラスを動的に付与する。
 *
 * @component
 * @param {object} props - React Select に渡すすべての props（options, onChangeなど）
 * @returns {JSX.Element} アニメーション付きセレクトコンポーネント。
 */
const AnimatedSelect = ({ ...props }) => {
  const [menuState, setMenuState] = useState(null); // メニューの状態を管理（'opening' or 'closing'）
  const [menuOpen, setMenuOpen] = useState(false); // メニューが表示されているかどうか

  // メニューを開くときのハンドラー
  const handleMenuOpen = () => {
    setMenuState('opening');
    setMenuOpen(true);
  };

  // メニューを閉じるときのハンドラー
  const handleMenuClose = () => {
    setMenuState('closing');
    setTimeout(() => {
      setMenuOpen(false);
    }, 200); // アニメーションの時間に合わせて閉じる
  };

  return (
    <Select
      {...props}
      classNamePrefix={'custom'}       // クラス名のprefix
      isSearchable={false}            // 検索ボックスは無効化
      menuIsOpen={menuOpen}           // メニュー開閉状態を制御
      onMenuOpen={handleMenuOpen}     // 開くときのイベントハンドラ
      onMenuClose={handleMenuClose}   // 閉じるときのイベントハンドラ
      components={{ Menu }}           // カスタム Menu コンポーネントを注入
      menuState={menuState}           // Menu コンポーネントに状態を渡す（クラス切り替えのため）
    />
  );
};

export default AnimatedSelect;
