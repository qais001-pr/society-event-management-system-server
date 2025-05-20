const express = require('express')
const societyrouter = express.Router();
const { getSociety, createSociety, societyaccountdepartmentupdate, getEventsOnlyApprovedBySociety, getSocietyEvent } = require('../controller/socieyController')

societyrouter.route('/')
    .get(getSociety)
    .post(createSociety)

societyrouter.route('/eventsociety')
    .get(getSocietyEvent)

    societyrouter.route('/updatebudget')
    .post(societyaccountdepartmentupdate)

societyrouter.route('/:id')
    .get(getEventsOnlyApprovedBySociety)

module.exports = societyrouter;