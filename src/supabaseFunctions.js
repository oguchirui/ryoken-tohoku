import { supabase } from "./supabase.js";

export const fetchFilteredRecords = async (year, month, day, prefecture, type, numArr) => {
  let query = supabase
    .from('activity_logs_count')
    .select('*');

  if (year !== 'すべて') {
    query = query
      .eq('year', year);
  }
  if (month !== 'すべて') {
    query = query
      .eq('month', month);
  }
  if (day !== 'すべて') {
    query = query
      .eq('day', day);
  }
  if (prefecture !== 'すべて') {
    query = query
      .eq('prefecture', prefecture);
  }
  switch (type) {
    case 'すべて':
      break;
    case 'ちょうど':
      query = query
        .eq('name_count', numArr[0]);
      break;
    case '範囲を指定':
      query = query
        .gte('name_count', numArr[0])
        .lte('name_count', numArr[1]);
      break;
    default:
      console.error('Invalid type:', type);
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching filtered records: ${error.message}`);
  }
  return data;
};

export const fetchClickedRecords = async (name) => {
  const { data, error } = await supabase
    .from('activity_logs_count')
    .select('*')
    .eq('name', name)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .order('day', { ascending: false });

  if (error) {
    throw new Error(`Error fetching clicked records: ${error.message}`);
  }
  return data;
};

export const fetchUniqueYears = async () => {
  const { data, error } = await supabase
    .from('unique_years')
    .select('year');

  if (error) {
    throw new Error(`Error fetching unique years: ${error.message}`);
  }
  return data;
};

export const fetchUniquePrefectures = async () => {
  const { data, error } = await supabase
    .from('unique_prefectures')
    .select('prefecture');

  if (error) {
    throw new Error(`Error fetching unique prefectures: ${error.message}`);
  }
  return data;
};

export const fetchPassword = async () => {
  const { data, error } = await supabase
    .from("password_table")
    .select("*")
    .single();

  if (error) {
    throw new Error(`Error fetching password: ${error.message}`);
  }
  return data.password;
};

export const updatePassword = async (newPassword) => {
  const { error } = await supabase
    .from("password_table")
    .update({ password: newPassword })
    .eq('id', 1);

  if (error) {
    throw new Error(`Error updating password: ${error.message}`);
  }
};

export const insertRecord = async (record) => {
  const { error } = await supabase
    .from('activity_logs')
    .insert(record);

  if (error) {
    throw new Error(`Error inserting record: ${error.message}`);
  }
};

export const updateRecord = async (newRecord, oldRecordId) => {
  const { error } = await supabase
    .from('activity_logs')
    .update(newRecord)
    .eq('id', oldRecordId);

  if (error) {
    throw new Error(`Error updating record: ${error.message}`);
  }
};

export const deleteRecord = async (oldRecordId) => {
  const { error } = await supabase
    .from('activity_logs')
    .delete()
    .eq('id', oldRecordId);

  if (error) {
    throw new Error(`Error deleting record: ${error.message}`);
  }
};
