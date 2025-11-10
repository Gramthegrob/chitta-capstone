// node-api/services/hcgatewayClient.js
const { createHttp } = require("../utils/httpClient");

/** contoh client sederhana bila perlu tarik data dari HCGateway */
function createHcClient(baseURL, token) {
  const http = createHttp(baseURL);
  http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  http.defaults.headers.common["Content-Type"] = "application/json";

  return {
    fetchHeartRate: async (query = {}) => {
      const { data } = await http.post("/api/v2/fetch/heartRate", { queries: [query] });
      return data;
    },
    // tambah method lain bila perlu
  };
}

module.exports = { createHcClient };
