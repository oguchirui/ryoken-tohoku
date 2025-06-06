import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { PlacePicker } from '@googlemaps/extended-component-library/react';
import { fetchFilteredRecords } from '../supabaseFunctions';
import { useMap } from '../context/MapContext';
import format from 'date-fns/format';
import { ja } from 'date-fns/locale/ja';
import AnimatedDatePicker from './Animated/AnimatedDatePicker';
import EditButton from './EditButton';
import ToHomePageButton from './ToHomePageButton';
import { useInputErrors } from '../context/InputErrorsContext';

const EditMap = () => {
  const MAP_ID = import.meta.env.VITE_MAP_ID;
  const INITIAL_ADDRESS = '日本、〒980-0021 宮城県仙台市青葉区中央１丁目１';

  const location = useLocation();
  const oldRecord = location.state;
  const oldYear = oldRecord.year;
  const oldMonth = oldRecord.month;
  const oldDay = oldRecord.day;
  const oldDate = `${oldYear}-${String(oldMonth).padStart(2, '0')}-${String(oldDay).padStart(2, '0')}`;
  const oldName = oldRecord.name;
  const oldLat = oldRecord.lat;
  const oldLng = oldRecord.lng;
  const oldPrefecture = oldRecord.prefecture;
  const oldDescription = oldRecord.description;

  const [formattedAddress, setFormattedAddress] = useState(INITIAL_ADDRESS);
  const [mapReady, setMapReady] = useState(false);
  const [date, setDate] = useState(oldDate);
  const [placeName, setPlaceName] = useState(oldName);
  const [lat, setLat] = useState(oldLat);
  const [lng, setLng] = useState(oldLng);
  const [prefecture, setPrefecture] = useState(oldPrefecture);
  const [description, setDescription] = useState(oldDescription);
  const [isDateEntered, setIsDateEntered] = useState(true);
  const [isPlaceNameEntered, setIsPlaceNameEntered] = useState(true);
  const [isLatLngEntered, setIsLatLngEntered] = useState(true);
  const [isDescriptionEntered, setIsDescriptionEntered] = useState(true);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const logMarkerRef = useRef([]);
  const isFirstRender = useRef(true);

  const { filterParams } = useMap();

  const inputErrors = useInputErrors();

  const handlePlaceChange = (e) => {
    const address = e.target.value?.formattedAddress ?? '';
    setFormattedAddress(address);
  };

  const reverseGeocode = (latLng) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        const prefectureComponent = addressComponents.find(component =>
          component.types.includes('administrative_area_level_1')
        );
        if (prefectureComponent) {
          setPrefecture(prefectureComponent.long_name);
        }
      } else {
        console.error('逆ジオコーディングに失敗:', status);
      }
    });
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

    let clickMarker = null;

    mapInstance.current.addListener('click', async (e) => {
      const [{ AdvancedMarkerElement }, { PinElement }] = await Promise.all([
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('marker'),
      ]);

      if (clickMarker) {
        clickMarker.setMap(null);
      }

      const pin = new PinElement({
        scale: 1.2,
        background: '#ffcc4d',
        borderColor: 'none',
        glyph: '',
      });

      pin.element.style.filter = 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))';

      const glyphDiv = document.createElement('div');
      glyphDiv.style.backgroundColor = '#fffdfa';
      glyphDiv.style.borderRadius = '50%';
      glyphDiv.style.width = '22px';
      glyphDiv.style.height = '22px';
      glyphDiv.style.display = 'flex';
      glyphDiv.style.alignItems = 'center';
      glyphDiv.style.justifyContent = 'center';
      glyphDiv.style.position = 'absolute';
      glyphDiv.style.top = '4.5px';
      glyphDiv.style.left = '5px';
      glyphDiv.style.zIndex = '2';

      pin.element.appendChild(glyphDiv);

      pin.element.classList.add('pin-drop-animation');

      clickMarker = new AdvancedMarkerElement({
        position: e.latLng,
        map: mapInstance.current,
        content: pin.element,
        zIndex: 2,
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

      setLat(e.latLng.lat());
      setLng(e.latLng.lng());
      setIsLatLngEntered(true);

      reverseGeocode(e.latLng);
    });

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
          scale: 1.2,
          background: '#f75a1a',
          borderColor: 'none',
          glyph: '',
          glyphColor: '#474747',
        });

        pin.element.style.filter = 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))';

        const glyphDiv = document.createElement('div');
        glyphDiv.style.backgroundColor = '#fffdfa';
        glyphDiv.style.borderRadius = '50%';
        glyphDiv.style.width = '22px';
        glyphDiv.style.height = '22px';
        glyphDiv.style.display = 'flex';
        glyphDiv.style.alignItems = 'center';
        glyphDiv.style.justifyContent = 'center';
        glyphDiv.style.position = 'absolute';
        glyphDiv.style.top = '4.5px';
        glyphDiv.style.left = '5px';
        glyphDiv.style.zIndex = '2';

        // 文字用の span を作る
        const glyphText = document.createElement('span');
        glyphText.textContent = `${record.name_count}`;
        glyphText.style.fontSize = '1.5em';
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
          setPlaceName(record.name);
          const latLng = { lat: record.lat, lng: record.lng };
          setLat(latLng.lat);
          setLng(latLng.lng);
          setIsPlaceNameEntered(true);
          setIsLatLngEntered(true);
          reverseGeocode(latLng);

          if (clickMarker) {
            clickMarker.setMap(null);
          }

          const pin = new PinElement({
            scale: 1.2,
            background: '#ffcc4d',
            borderColor: 'none',
            glyph: '',
          });

          pin.element.style.filter = 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))';

          const glyphDiv = document.createElement('div');
          glyphDiv.style.backgroundColor = '#fffdfa';
          glyphDiv.style.borderRadius = '50%';
          glyphDiv.style.width = '22px';
          glyphDiv.style.height = '22px';
          glyphDiv.style.display = 'flex';
          glyphDiv.style.alignItems = 'center';
          glyphDiv.style.justifyContent = 'center';
          glyphDiv.style.position = 'absolute';
          glyphDiv.style.top = '4.5px';
          glyphDiv.style.left = '5px';
          glyphDiv.style.zIndex = '2';

          pin.element.appendChild(glyphDiv);

          pin.element.classList.add('pin-drop-animation');

          clickMarker = new AdvancedMarkerElement({
            position: latLng,
            map: mapInstance.current,
            content: pin.element,
            zIndex: 2,
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
        });

        logMarkerRef.current.push(marker);
      });

      const addInitialBluePin = async () => {
        const [{ AdvancedMarkerElement }, { PinElement }] = await Promise.all([
          google.maps.importLibrary('marker'),
          google.maps.importLibrary('marker'),
        ]);

        const pin = new PinElement({
          scale: 1.2,
          background: '#ffcc4d',
          borderColor: 'none',
          glyph: '',
        });

        pin.element.style.filter = 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))';

        const glyphDiv = document.createElement('div');
        glyphDiv.style.backgroundColor = '#fffdfa';
        glyphDiv.style.borderRadius = '50%';
        glyphDiv.style.width = '22px';
        glyphDiv.style.height = '22px';
        glyphDiv.style.display = 'flex';
        glyphDiv.style.alignItems = 'center';
        glyphDiv.style.justifyContent = 'center';
        glyphDiv.style.position = 'absolute';
        glyphDiv.style.top = '4.5px';
        glyphDiv.style.left = '5px';
        glyphDiv.style.zIndex = '2';

        pin.element.appendChild(glyphDiv);

        pin.element.classList.add('pin-drop-animation');

        clickMarker = new AdvancedMarkerElement({
          position: { lat: oldLat, lng: oldLng },
          map: mapInstance.current,
          content: pin.element,
          zIndex: 2,
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
      };

      addInitialBluePin();
    });
  }, [filterParams, mapReady]);

  return (
    <>
      <div className='date-place-container'>
        <div className='date-place'>
          <div className='date-place-row'>
            <div className='date-place-item'>
              <h2>活動年月日：</h2>
              <AnimatedDatePicker
                selected={date ? new Date(date) : null}
                onChange={(newDate) => {
                  if (newDate) {;
                    setDate(format(newDate, 'yyyy-MM-dd'));
                    setIsDateEntered(true);
                  } else {
                    setDate('');
                    setIsDateEntered(false);
                  }
                }}
                placeholderText="日付を選択"
                locale={ja}
                dropdownMode="select"
                // showMonthDropdown={true}
                // showYearDropdown={true}
              />
            </div>
            <div className='date-place-item'>
              <h2>活動場所：</h2>
              <input
                className='place-input'
                type="text"
                value={placeName}
                onChange={(e) => {
                  setPlaceName(e.target.value);
                  if (e.target.value) {
                    setIsPlaceNameEntered(true);
                  } else {
                    setIsPlaceNameEntered(false);
                  }
                }}
              />
              <p className='place-input-description'>
                以前行ったことがある場所は<br />
                地図上のピンを選択することで自動的に入力されます。
              </p>
            </div>
          </div>
          <div className='date-place-row'>
            <div className='date-place-item'>
              <h2>活動場所：</h2>
              <h3>
                地図上にピンを立ててください。<br />
                以前行ったことがある場所は地図上のピンを選択してください。
              </h3>
            </div>
          </div>
          <div className='date-place-row'>
            <div className='date-place-item'>
              <h2>活動内容：</h2>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value) {
                    setIsDescriptionEntered(true);
                  } else {
                    setIsDescriptionEntered(false);
                  }
                }}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

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
        style={{
          width: '100%',
        }}
        aria-label="地図"
      />

      <div className='footer-buttons'>
        <div className='footer-buttons-item-left'>
          <ToHomePageButton />
        </div>
        <div className='footer-buttons-item-errors'>
          {inputErrors.length > 0 && (
            <div className='input-errors'>
              {inputErrors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
        </div>
        <div className='footer-buttons-item-right'>
          <EditButton
            date={date}
            name={placeName}
            lat={lat}
            lng={lng}
            prefecture={prefecture}
            description={description}
            isDateEntered={isDateEntered}
            isPlaceNameEntered={isPlaceNameEntered}
            isLatLngEntered={isLatLngEntered}
            isDescriptionEntered={isDescriptionEntered}
          />
        </div>
      </div>
    </>
  );
};

export default EditMap;
