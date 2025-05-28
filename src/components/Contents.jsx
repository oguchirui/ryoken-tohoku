import { useMap } from "../context/MapContext";
import KebabMenu from "./KebabMenu";

const Contents = ({ handleHideContents }) => {
  const { clickedRecords } = useMap();

  return (
    <>
      {clickedRecords.length === 0 && (
        <div className="contents-no-data">
          <div className="contents-header">
            <h2>a</h2>
            <button
              className="contents-close-button"
              onClick={handleHideContents}
            ></button>
          </div>
          <div className="contents-item">
            <h2>記録がありません</h2>
            <p>地図上のピンを選択すると、ここに記録が表示されます。</p>
          </div>
        </div>
      )}
      {clickedRecords.length > 0 && (
        <>
          <div className="contents-header">
            <h2>{clickedRecords[0] ? clickedRecords[0].name : ''}</h2>
            <button
              className="contents-close-button"
              onClick={handleHideContents}
            ></button>
          </div>
          <div className="contents-main">
            {clickedRecords.map(record => {
              return (
                <div key={record.id} className="contents-item">
                  <h3>{record.year}年{record.month}月{record.day}日</h3>
                  <p>{record.description}</p>
                  <KebabMenu record={record} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Contents;
