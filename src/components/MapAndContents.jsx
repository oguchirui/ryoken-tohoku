import { useState } from "react";
import HomeMap from "./HomeMap";
import Contents from "./Contents";

const MapAndContents = () => {
  const [showContents, setShowContents] = useState(false);

  const handleShowContents = () => setShowContents(true);
  const handleHideContents = () => setShowContents(false);

  return (
    <div className="map-and-contents">
      <div className={`home-map ${showContents ? '' : 'show'}`}>
        <HomeMap handleShowContents={handleShowContents}/>
      </div>
      <div className={`contents ${showContents ? 'show' : ''}`}>
        <Contents handleHideContents={handleHideContents}/>      
      </div>
    </div>
  );
};

export default MapAndContents;