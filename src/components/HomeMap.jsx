import { useState, useEffect, useRef } from 'react';
import { PlacePicker } from '@googlemaps/extended-component-library/react';
import { fetchFilteredRecords, fetchClickedRecords } from '../supabaseFunctions';
import { useMap, useMapDispatch } from '../context/MapContext';
import { useDeleteModal } from '../context/DeleteModalContext';

const HomeMap = ({ handleShowContents }) => {
  const MAP_ID = import.meta.env.VITE_MAP_ID;
  const INITIAL_ADDRESS = '日本、〒980-0021 宮城県仙台市青葉区中央１丁目１';

  const [formattedAddress, setFormattedAddress] = useState(INITIAL_ADDRESS);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const logMarkerRef = useRef([]);
  const isFirstRender = useRef(true);

  const mapDispatch = useMapDispatch();
  const { filterParams } = useMap();

  const { hasDeleted } = useDeleteModal();

  const handlePlaceChange = (e) => {
    const address = e.target.value?.formattedAddress ?? '';
    setFormattedAddress(address);
  };

  useEffect(() => {
    const updateMapWithAddress = async () => {
      try {
        const [{ Map }, { Geocoder }] = await Promise.all([
          google.maps.importLibrary('maps'),
          google.maps.importLibrary('geocoding'),
        ]);

        const geocoder = new Geocoder();

        geocoder.geocode({ address: formattedAddress }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const zoomLevel = isFirstRender.current ? 7 : 15;

            if (!mapInstance.current) {
              mapInstance.current = new Map(mapRef.current, {
                mapId: MAP_ID,
                zoom: zoomLevel,
                center: location,
              });
            } else {
              mapInstance.current.setCenter(location);
              mapInstance.current.setZoom(zoomLevel);
            }

            isFirstRender.current = false;
            setMapReady(true);
          }
        });
      } catch (error) {
        console.error('Google Maps API の読み込みに失敗しました:', error);
      }
    };

    updateMapWithAddress();
  }, [formattedAddress]);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;

    fetchFilteredRecords(
      filterParams.year,
      filterParams.month,
      filterParams.day,
      filterParams.prefecture,
      filterParams.type,
      filterParams.numArr
    ).then(async (filteredRecords) => {
      const [{ AdvancedMarkerElement }, { PinElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('marker'),
      ]);

      logMarkerRef.current.forEach(marker => marker.setMap(null));
      logMarkerRef.current = [];

      filteredRecords.forEach((record) => {
        const pin = new PinElement({
          scale: 1.5,
          background: '#f75a1a',
          borderColor: 'none',
          glyph: '',
          glyphColor: '#474747',
        });

        pin.element.style.filter = 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))';

        const glyphDiv = document.createElement('div');
        glyphDiv.style.backgroundColor = '#fffdfa';
        glyphDiv.style.borderRadius = '50%';
        glyphDiv.style.width = '28px';
        glyphDiv.style.height = '28px';
        glyphDiv.style.display = 'flex';
        glyphDiv.style.alignItems = 'center';
        glyphDiv.style.justifyContent = 'center';
        glyphDiv.style.position = 'absolute';
        glyphDiv.style.top = '6px';
        glyphDiv.style.left = '6px';
        glyphDiv.style.zIndex = '2';

        // 文字用の span を作る
        const glyphText = document.createElement('span');
        glyphText.textContent = `${record.name_count}`;
        glyphText.style.fontSize = '1.8em';
        glyphText.style.fontFamily = '"Kaisei Opti", serif';
        glyphText.style.color = '#474747';
        // 文字だけを少し上に移動
        glyphText.style.position = 'relative';
        glyphText.style.top = '-1.5px';  // ここで文字だけ上にずらす

        // glyphText を glyphDiv に追加
        glyphDiv.appendChild(glyphText);

        // pin.element に追加
        pin.element.style.position = 'relative'; // 親に relative 忘れずに
        pin.element.appendChild(glyphDiv);

        pin.element.classList.add('pin-drop-animation');

        const marker = new AdvancedMarkerElement({
          map: mapInstance.current,
          position: { lat: record.lat, lng: record.lng },
          content: pin.element,
          gmpClickable: true,
          zIndex: 0,
        });

        pin.element.addEventListener('mouseenter', () => {
          marker.zIndex = 1;
          pin.element.classList.add('pin-hovered');
        });
        pin.element.addEventListener('mouseleave', () => {
          marker.zIndex = 0;
          pin.element.classList.remove('pin-hovered');
        });

        // スマホ対応：タップしたら浮き上がる
        pin.element.addEventListener('touchstart', () => {
          marker.zIndex = 1000;
          pin.element.classList.add('pin-hovered');

          // 1秒後に元に戻す（必要に応じて時間調整）
          setTimeout(() => {
            marker.zIndex = 0;
            pin.element.classList.remove('pin-hovered');
          }, 200);
        });

        marker.addListener('gmp-click', () => {
          fetchClickedRecords(record.name).then((clickedRecords) => {
            mapDispatch({
              type: 'click',
              payload: clickedRecords
            });
            handleShowContents();
          });
        });

        logMarkerRef.current.push(marker);
      });
    });
  }, [filterParams, mapReady, hasDeleted]);

  return (
    <>
      <div className='place-picker-container'>
        <h2>場所を検索：</h2>
        <PlacePicker
          className='place-picker'
          placeholder="場所を入力してください"
          onPlaceChange={handlePlaceChange}
        />
      </div>
      <div
        className='map'
        ref={mapRef}
        aria-label="地図"
        style={{ height: "700px" }}
      />
    </>
  );
};

export default HomeMap;
