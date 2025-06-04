import Select, { components } from 'react-select';
import { useState } from 'react';

const Menu = (props) => {
  return (
    <components.Menu
      {...props}
      className={`${props.selectProps.menuState === 'closing' ? 'menu-closing' : 'menu-opening'} custom-select__menu`}
    >
      {props.children}
    </components.Menu>
  );
};

const AnimatedSelect = ({ ...props }) => {
  const [menuState, setMenuState] = useState(null); // 'opening' or 'closing'
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuState('opening');
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuState('closing');
    setTimeout(() => {
      setMenuOpen(false);
    }, 200); // アニメーションの時間に合わせる
  };

  return (
    <Select
      {...props}
      classNamePrefix={'custom'}
      isSearchable={false}
      menuIsOpen={menuOpen}
      onMenuOpen={handleMenuOpen}
      onMenuClose={handleMenuClose}
      components={{ Menu }}
      menuState={menuState} // propsとして渡す
    />
  );
};

export default AnimatedSelect;
