const express = require('express')
const staffheadRouter = express.Router();
const { getPendingEventsApprovedByAccountsDepartment, getApprovedEvents, getRejectedEvents, addtechnicalRequirements, gettechnicalRequirements } = require('../controller/staffheadcontroller');

staffheadRouter.route('/pending')
    .get(getPendingEventsApprovedByAccountsDepartment)

staffheadRouter.route('/approved')
    .get(getApprovedEvents)

staffheadRouter.route('/rejected')
    .get(getRejectedEvents)


staffheadRouter.route('/details')
    .post(addtechnicalRequirements)


staffheadRouter.route('/details')
    .get(gettechnicalRequirements)

module.exports = staffheadRouter;