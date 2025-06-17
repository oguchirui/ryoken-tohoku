import { useMapDispatch } from "@/contexts/MapContext";
import { useDeleteModalDispatch } from "@/contexts/DeleteModalContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const KebabMenu = ({ record }) => {
  const mapDispatch = useMapDispatch();
  const deleteModalDispatch = useDeleteModalDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleEdit = () => {
    mapDispatch({
      type: 'click',
      payload: []
    });
    navigate("/edit", { state: record });
  };

  const handleDelete = () => {
    deleteModalDispatch({
      type: 'open',
      payload: record
    });
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    // PCとスマホの両方に対応
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef}>
      <div className={`menu-options ${menuOpen ? 'open' : ''}`}>
        <button onClick={handleEdit}>編集</button>
        <span className="divider"></span>
        <button onClick={handleDelete}>削除</button>
      </div>
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </button>
    </div>
  )
};

export default KebabMenu;
