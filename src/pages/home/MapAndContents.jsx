import { useState } from "react";
import HomeMap from "./HomeMap";
import Contents from "./Contents";

/**
 * MapAndContentsコンポーネント
 * 
 * 地図表示部分（HomeMap）と活動内容表示部分（Contents）を管理。
 * 
 * 地図のピンが選択されるとContentsを表示し、
 * Contentsの閉じるボタンで非表示に戻す切り替えを制御する。
 * 
 * @returns {JSX.Element} 地図と活動内容表示のコンテナ
 */
const MapAndContents = () => {
  const [showContents, setShowContents] = useState(false); // Contentsの表示・非表示状態を管理するフラグ

  const handleShowContents = () => setShowContents(true); // Contentsを表示する関数（HomeMapから呼ばれる）
  const handleHideContents = () => setShowContents(false); // Contentsを非表示にする関数（Contentsから呼ばれる）

  return (
    <div className="map-and-contents">
      {/* 地図部分。showContentsがfalseなら"show"クラス付与（表示） */}
      <div className={`home-map ${showContents ? '' : 'show'}`}>
        <HomeMap handleShowContents={handleShowContents}/>
      </div>

      {/* 活動内容表示部分。showContentsがtrueなら"show"クラス付与（表示） */}
      <div className={`contents ${showContents ? 'show' : ''}`}>
        <Contents handleHideContents={handleHideContents}/>      
      </div>
    </div>
  );
};

export default MapAndContents;
