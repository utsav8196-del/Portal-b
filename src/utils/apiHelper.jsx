// src/utils/apiHelper.js
export const getArray = (res, key) => {
  if (Array.isArray(res.data)) return res.data;
  if (key && Array.isArray(res.data[key])) return res.data[key];
  if (Array.isArray(res.data.data)) return res.data.data;
  return [];
};