// services/monitoringService.js
const monitoringModel = require('../models/monitoringModel');
const { predictStress } = require('./pythonClient');

exports.analyze = async (userId, body) => {
  const hr = Array.isArray(body?.heart_rate) ? body.heart_rate : [];
  if (hr.length < 128) {
    const e = new Error('heart_rate minimal 128 samples'); e.status=400; throw e;
  }
  const result = await predictStress(hr);

  // simpan snapshot sederhana
  await monitoringModel.insertMonitoring({
    userId,
    heart_rate: hr[hr.length-1],
    risk_level_hr: result?.pred_class === 1 ? 'high' : 'low',
    sleep_duration: null,
    sleep_quality: null
  });

  return result;
};

exports.list = async (userId, limit=50) => monitoringModel.listByUser(userId, limit);
