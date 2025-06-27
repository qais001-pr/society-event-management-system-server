const express = require('express');
const accountdepartmentroutes = express.Router();
const { getPendingEventsApprovedByAssisstantDirector, getApprovedEvent, getRejectedEvent } = require('../controller/accountsdepartmentcontroller');

accountdepartmentroutes.route('/pending')
    .get(getPendingEventsApprovedByAssisstantDirector)

accountdepartmentroutes.route('/approved')
    .get(getApprovedEvent)

accountdepartmentroutes.route('/rejected')
    .get(getRejectedEvent)

module.exports = accountdepartmentroutes;