const express = require('express')
const itheadRouter = express.Router();

const { getPendingEventsApprovedByStaffhead, getCompletedEvents, getRejectedEvents, approvalrejection, } = require('../controller/itheadController')

itheadRouter.route('/pending')
    .get(getPendingEventsApprovedByStaffhead)

itheadRouter.route('/completed')
    .get(getCompletedEvents)

itheadRouter.route('/rejected')
    .get(getRejectedEvents)


itheadRouter.route('/approvedrejected')
    .post(approvalrejection)


module.exports = itheadRouter;