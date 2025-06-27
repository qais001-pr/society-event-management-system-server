const express = require('express');
const eventRouter = express.Router();
const { getEvents, createEvents, getEvent, getEventsByname, getEventsBySociety, getEventsByStatus, updateEventsByStatus, getEventsOnlyApproved, getRejectedEventsBySocietyID } = require('../controller/eventController');

eventRouter.route('/')
    .get(getEvents)
    .post(createEvents)

eventRouter.route('/:id')
    .get(getEvent)

eventRouter.route('/eventname/:query')
    .get(getEventsByname)

eventRouter.route('/geteventbysociety/:society_id')
    .get(getEventsBySociety)

eventRouter.route('/eventstatus/:status')
    .get(getEventsByStatus)

eventRouter.route('/rejected/:id')
    .get(getRejectedEventsBySocietyID)

eventRouter.route('/updatestatus')
    .post(updateEventsByStatus)

eventRouter.route('/department/approve')
    .get(getEventsOnlyApproved)

module.exports = eventRouter;
