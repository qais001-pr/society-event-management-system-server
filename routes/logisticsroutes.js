const express = require('express')
const { handleeventlogistics } = require('../controller/logisticscontroller')
const logisticsroute = express.Router();
logisticsroute.route('/')
    .post(handleeventlogistics)
module.exports = logisticsroute