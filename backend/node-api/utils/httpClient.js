// node-api/utils/httpClient.js
const axios = require("axios");

function createHttp(baseURL, timeout = 15000) {
  const instance = axios.create({ baseURL, timeout });
  return instance;
}

module.exports = { createHttp };
