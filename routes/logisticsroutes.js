const express = require('express')
const { handleeventlogistics, addlogisticsRequirements,getlogisticsRequirements } = require('../controller/logisticscontroller')
const logisticsroute = express.Router();
logisticsroute.route('/')
    .post(handleeventlogistics)

logisticsroute.route('/req')
    .get(getlogisticsRequirements)


logisticsroute.route('/details')
    .post(addlogisticsRequirements)


module.exports = logisticsroute