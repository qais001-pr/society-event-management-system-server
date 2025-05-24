const express = require('express')
const staffRouter = express.Router();

const { getEvents,getEventsBySociety, approvalrejection } = require('../controller/itheadController')

staffRouter.route('/')
    .get(getEvents)

staffRouter.route('/:id')
    .get(getEventsBySociety)

staffRouter.route('/approvedrejected')
    .post(approvalrejection)


module.exports = staffRouter;