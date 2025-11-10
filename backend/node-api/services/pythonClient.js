// services/pythonClient.js
const axios = require('axios');
const { PY_SERVICE_URL, PY_SERVICE_MON_URL, SERVICE_API_KEY } = require('../config/env');

const screenClient = axios.create({
  baseURL: PY_SERVICE_URL,
  timeout: 10000,
  headers: { 'x-api-key': SERVICE_API_KEY }
});

const monClient = axios.create({
  baseURL: PY_SERVICE_MON_URL,
  timeout: 15000,
  headers: { 'x-api-key': SERVICE_API_KEY }
});

exports.callScreeningCF = async (jawaban) => {
  const { data } = await screenClient.post('/api/screening', { jawaban });
  return data; // {Depresi:{...}, Kecemasan:{...}, Stres:{...}}
};

exports.predictStress = async (heart_rate) => {
  const { data } = await monClient.post('/monitoring/predict', { heart_rate });
  return data; // { ok, pred_class, probs, ... }
};
