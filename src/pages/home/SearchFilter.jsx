import { useEffect, useState } from 'react';
import { useMapDispatch } from "@/contexts/MapContext";
import { useDeleteModal } from '@/contexts/DeleteModalContext';
import { fetchUniqueYears, fetchUniquePrefectures } from "@/api/supabaseFunctions";
import AnimatedSelect from "@/components/customInputs/AnimatedSelect";

/**
 * SearchFilterコンポーネント
 * 
 * 活動記録の地図上ピン表示条件を指定するフィルターUIを提供。
 * - 年、月、日、都道府県、訪問回数での絞り込みが可能
 * - 回数の絞り込みは「ちょうど」か「範囲を指定」で入力方式を切り替え
 * - 外部APIから年・都道府県の選択肢を取得
 * - フィルター条件の変更をMapContextにディスパッチして状態を共有
 * - 削除モーダル状態が変わった場合に選択肢を再取得し直す
 * 
 * @returns {JSX.Element} フィルターUI
 */
const SearchFilter = () => {
  const mapDispatch = useMapDispatch();
  const { hasDeleted } = useDeleteModal();

  // 訪問回数の初期範囲（0～最大値）
  const INITIAL_NUM_ARR = [0, Number.MAX_SAFE_INTEGER];

  // 選択肢の状態（年、月、日、都道府県、タイプ）
  const [options, setOptions] = useState({
    years: [],
    months: [],
    days: [],
    prefectures: [],
    types: [],
  });

  // フィルターの選択値
  const [filterValues, setFilterValues] = useState({
    year: 'すべて',
    month: 'すべて',
    day: 'すべて',
    prefecture: 'すべて',
    type: 'すべて',
    numArr: INITIAL_NUM_ARR,
  });

  // 訪問回数入力用テキストボックスの中身（文字列）
  const [numInputs, setNumInputs] = useState(['', '']);

  // 初期化処理・選択肢設定（hasDeleted変化時も再取得）
  useEffect(() => {
    // 月・日は固定で作成
    const months = ['すべて', ...Array.from({ length: 12 }, (_, i) => `${i + 1}`)];
    const days = ['すべて', ...Array.from({ length: 31 }, (_, i) => `${i + 1}`)];
    const types = ['すべて', 'ちょうど', '範囲を指定'];

    // 年の選択肢をAPIから取得し設定
    fetchUniqueYears().then((objs) => {
      const years = ['すべて', ...objs.map(obj => String(obj.year))];
      setOptions((prev) => ({ ...prev, years }));
    });

    // 都道府県の選択肢をAPIから取得し設定
    fetchUniquePrefectures().then((objs) => {
      const prefectures = ['すべて', ...objs.map(obj => obj.prefecture)];
      setOptions((prev) => ({ ...prev, prefectures }));
    });

    // 月、日、タイプの選択肢を設定
    setOptions((prev) => ({
      ...prev,
      months,
      days,
      types
    }));
  }, [hasDeleted]);

  // filterValuesの変更があったらMapContextにディスパッチする
  useEffect(() => {
    mapDispatch({
      type: 'filter',
      payload: { ...filterValues }
    });
  }, [filterValues, mapDispatch]);

  /**
   * 選択肢配列からReact Select用のオプション配列に変換
   * 'すべて'はそのまま表示し、それ以外は単位（年・月・日）を付加する
   */
  const getSelectOptions = (arr, key) =>
    arr.map((v) => {
      if (v === 'すべて') {
        return { value: v, label: v };
      }
      let label = v;
      if (key === 'year') label = `${v}年`;
      else if (key === 'month') label = `${v}月`;
      else if (key === 'day') label = `${v}日`;
      return { value: v, label };
    });

  /**
   * 現在のfilterValuesからReact Selectのvalue形式に変換
   */
  const getSelectValue = (key) => {
    const value = filterValues[key];
    let label = value;

    if (value !== 'すべて') {
      if (key === 'year') label = `${value}年`;
      else if (key === 'month') label = `${value}月`;
      else if (key === 'day') label = `${value}日`;
    }

    return { value, label };
  };

  /**
   * React SelectのonChangeイベントハンドラ
   * 指定されたキーの値をfilterValuesにセット
   */
  const onReactSelectChange = (key, selectedOption) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: selectedOption.value
    }));
  };

  // typeの変更時は訪問回数の入力欄とfilter値をリセット
  useEffect(() => {
    setNumInputs(['', '']);
    setFilterValues((prev) => ({ ...prev, numArr: INITIAL_NUM_ARR }));
  }, [filterValues.type]);

  /**
   * 訪問回数の入力欄変更ハンドラ
   * 数字か空文字のみ受け付け、filterValuesのnumArrを更新
   */
  const onNumInputChange = (index, val) => {
    if (val === '' || /^\d*$/.test(val)) {
      setNumInputs((prev) => {
        const newInputs = [...prev];
        newInputs[index] = val;
        return newInputs;
      });

      const numVal = parseInt(val, 10);
      if (!isNaN(numVal)) {
        setFilterValues((prev) => {
          let newNumArr = [...prev.numArr];
          if (prev.type === 'ちょうど') {
            // 「ちょうど」の場合は両端同じ値にする
            newNumArr = [numVal, numVal];
          } else if (prev.type === '範囲を指定') {
            // 範囲指定の場合は対応するインデックスにセット
            newNumArr[index] = numVal;
          }
          return { ...prev, numArr: newNumArr };
        });
      }
    }
  };

  /**
   * フィルターをすべてリセットするボタンの処理
   */
  const resetFilters = () => {
    const resetValues = {
      year: 'すべて',
      month: 'すべて',
      day: 'すべて',
      prefecture: 'すべて',
      type: 'すべて',
      numArr: INITIAL_NUM_ARR,
    };
    setFilterValues(resetValues);
    setNumInputs(['', '']);
  };

  // React Select用のカスタムスタイル
  const customStyles = {
    container: (provided) => ({
      ...provided,
    }),
    control: (provided, state) => ({
      ...provided,
      minHeight: '30px',
      height: '35px',
      width: '120px',
      fontSize: '1em',
      padding: '0px',
      borderRadius: '6px',
      border: '1px solid #F75A1A',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        borderColor: '#ff7a3d',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f0f0f0'
      },
      ...(state.isFocused && {
        backgroundColor: '#fffdfa',
        borderColor: '#F75A1A',
        boxShadow: 'none',
      }),
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '2px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 4px',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      opacity: 0,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '1em',
      padding: '8px',
      backgroundColor: state.isSelected
        ? '#fffdfa'
        : state.isFocused
          ? '#f0f0f0'
          : '#fffdfa',
      color: '#333',
      cursor: 'pointer',
    }),
  };

  // React Select用のカスタムテーマ
  const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#f0f0f0',
      primary25: '#f0f0f0',
      primary50: '#f0f0f0',
    },
  });

  return (
    <div className='search-filter'>
      <div className='search-filter-row'>
        <div className='search-filter-item'>
          <h2>ピンの表示条件を指定</h2>
        </div>
      </div>
      <div className='search-filter-row'>
        <div className='search-filter-item'>
          <h3>年：</h3>
          <AnimatedSelect
            name='year'
            options={getSelectOptions(options.years, 'year')}
            value={getSelectValue('year')}
            onChange={(selected) => onReactSelectChange('year', selected)}
            styles={customStyles}
            theme={customTheme}
          />
        </div>
        <div className='search-filter-item'>
          <h3>月：</h3>
          <AnimatedSelect
            name='month'
            options={getSelectOptions(options.months, 'month')}
            value={getSelectValue('month')}
            onChange={(selected) => onReactSelectChange('month', selected)}
            styles={customStyles}
            theme={customTheme}
          />
        </div>
        <div className='search-filter-item'>
          <h3>日：</h3>
          <AnimatedSelect
            name='day'
            options={getSelectOptions(options.days, 'day')}
            value={getSelectValue('day')}
            onChange={(selected) => onReactSelectChange('day', selected)}
            styles={customStyles}
            theme={customTheme}
          />
        </div>
        <div className='search-filter-item'>
          <h3>都道府県：</h3>
          <AnimatedSelect
            name='prefecture'
            options={getSelectOptions(options.prefectures)}
            value={getSelectValue('prefecture')}
            onChange={(selected) => onReactSelectChange('prefecture', selected)}
            styles={customStyles}
            theme={customTheme}
          />
        </div>
      </div>
      <div className='search-filter-row-reset'>
        <div className='search-filter-count'>
          <div className='search-filter-item'>
            <h3>訪れた回数：</h3>
            <AnimatedSelect
              name='type'
              options={getSelectOptions(options.types)}
              value={getSelectValue('type')}
              onChange={(selected) => onReactSelectChange('type', selected)}
              styles={customStyles}
              theme={customTheme}
            />
          </div>
          <div className='search-filter-item'>
            {filterValues.type === 'ちょうど' && (
              <div className='search-filter-item'>
                <input
                  className='search-filter-input'
                  type='number'
                  min={0}
                  value={numInputs[0]}
                  onChange={(e) => onNumInputChange(0, e.target.value)}
                />
                <h3 className='unit'>回</h3>
              </div>
            )}

            {filterValues.type === '範囲を指定' && (
              <>
                <div className='search-filter-item'>
                  <input
                    className='search-filter-input'
                    type='number'
                    min={0}
                    value={numInputs[0]}
                    onChange={(e) => onNumInputChange(0, e.target.value)}
                  />
                  <h3 className='unit'>回以上</h3>
                </div>
                <div className='search-filter-item'>
                  <input
                    className='search-filter-input'
                    type='number'
                    min={0}
                    value={numInputs[1]}
                    onChange={(e) => onNumInputChange(1, e.target.value)}
                  />
                  <h3 className='unit'>回以下</h3>
                </div>
              </>
            )}
          </div>
        </div>
        <div className='search-filter-item'>
          <button onClick={resetFilters}>
            リセット
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
