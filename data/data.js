
const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'localhost',
  database: 'Stock',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

module.exports = config ;


