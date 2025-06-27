const express = require('express')

const societychairpersonRouter = express.Router()

const { getPendingEvents, getRejectedEvents, getCompletedEvents, DeleteEvents, getEventByid, getEventDetailsByid,updateEvents } = require('../controller/societychairpersonController')

societychairpersonRouter.route('/')
    .get(getPendingEvents)

societychairpersonRouter.route('/rejected')
    .get(getRejectedEvents)
    
societychairpersonRouter.route('/completed')
    .get(getCompletedEvents)
    
societychairpersonRouter.route('/:id')
    .delete(DeleteEvents)

societychairpersonRouter.route('/event/:id')
    .get(getEventByid)
societychairpersonRouter.route('/event/details/:id') 
    .get(getEventDetailsByid)

societychairpersonRouter.route('/update/:id')
    .put(updateEvents);
module.exports = societychairpersonRouter;
