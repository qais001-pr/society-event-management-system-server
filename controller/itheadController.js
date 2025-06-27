const { connectionDb } = require('../connectionDb');

async function getPendingEventsApprovedByStaffhead(req, res) {
    let pool;
    try {
        pool = await connectionDb();
        const result = await pool.request().query`use pdc
SELECT e.* ,
ad.status as [adstatus],
ad.approved_date as [adapprovaldate],
ad.rejection_date as [adrejectiondate],
ad.reviews as [adreviews],
sf.status as [sfstatus],
sf.approveds_date as [sfapprovaldate],
sf.rejections_date as [sfrejectiondate],
sf.logistics_details as [sflogistics],
it.STATUS as [itstatus],
it.COMPLETEDDATE as [itcompletiondate],
it.REJECTEDDATE as [itrejectiondate],
it.TECHNICALREQUIREMENTS as [ittechnicalrequirement]
FROM event_requisitions e
LEFT JOIN adeventreviews ad ON e.event_requisition_id = ad.event_id
LEFT JOIN staffhead sf ON sf.eventid= e.event_requisition_id
LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
WHERE e.status = 'Approved'
  AND ad.status = 'Approved'
  and sf.status = 'Approved'
  ANd not EXISTS (
    SELECT 1 
    FROM ITHEAD sfh 
    WHERE sfh.eventid = e.event_requisition_id 
)`
        res.status(200).json({
            success: true,
            data: result.recordset
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        })
    }
}

async function getCompletedEvents(req, res) {
    let pool;
    try {
        pool = await connectionDb();
        const result = await pool.request().query`SELECT e.* ,
ad.status as [adstatus],
ad.approved_date as [adapprovaldate],
ad.rejection_date as [adrejectiondate],
ad.reviews as [adreviews],
sf.status as [sfstatus],
sf.approveds_date as [sfapprovaldate],
sf.rejections_date as [sfrejectiondate],
sf.logistics_details as [sflogistics],
it.STATUS as [itstatus],
it.COMPLETEDDATE as [itcompletiondate],
it.REJECTEDDATE as [itrejectiondate],
it.TECHNICALREQUIREMENTS as [ittechnicalrequirement]
FROM event_requisitions e
LEFT JOIN adeventreviews ad ON e.event_requisition_id = ad.event_id
LEFT JOIN staffhead sf ON sf.eventid= e.event_requisition_id
LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
WHERE e.status = 'Approved'
  AND ad.status = 'Approved'
  and sf.status = 'Approved'
  and it.STATUS = 'Completed'
  ANd EXISTS (
    SELECT 1 
    FROM staffhead sfh 
    WHERE sfh.eventid = e.event_requisition_id 
)`
        res.status(200).json({
            success: true,
            data: result.recordset
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        })
    }
}
async function getRejectedEvents(req, res) {
    let pool;
    try {
        pool = await connectionDb();
        const result = await pool.request().query`use pdc
SELECT e.* ,
ad.status as [adstatus],
ad.approved_date as [adapprovaldate],
ad.rejection_date as [adrejectiondate],
ad.reviews as [adreviews],
sf.status as [sfstatus],
sf.approveds_date as [sfapprovaldate],
sf.rejections_date as [sfrejectiondate],
sf.logistics_details as [sflogistics],
it.STATUS as [itstatus],
it.COMPLETEDDATE as [itcompletiondate],
it.REJECTEDDATE as [itrejectiondate],
it.TECHNICALREQUIREMENTS as [ittechnicalrequirement]
FROM event_requisitions e
LEFT JOIN adeventreviews ad ON e.event_requisition_id = ad.event_id
LEFT JOIN staffhead sf ON sf.eventid= e.event_requisition_id
LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
WHERE e.status = 'Approved'
  AND ad.status = 'Approved'
  and sf.status = 'Approved'
  and it.STATUS = 'Rejected'
  ANd EXISTS (
    SELECT 1 
    FROM staffhead sfh 
    WHERE sfh.eventid = e.event_requisition_id 
)`
        res.status(200).json({
            success: true,
            data: result.recordset
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        })
    }
}


async function approvalrejection(req, res) {
    let pool;
    let q = '';
    try {
        const { eventid, review, status, society_id, date } = req.body;
        console.log(eventid);
        console.log(review);
        console.log(status);
        console.log(society_id);
        console.log(date);
        if (status === 'Completed') {
            q = `insert into ithead (TECHNICALREQUIREMENTS,STATUS,EVENTID,SOCIETYID,COMPLETEDDATE)
            values
             (
              '${review}', '${status}' , ${parseInt(eventid)},${parseInt(society_id)}, '${date}' 
             )`
        }
        if (status === 'Rejected') {
            q = `insert into ithead (TECHNICALREQUIREMENTS,STATUS,EVENTID,SOCIETYID,REJECTEDDATE)
            values
             (
                '${review}', '${status}' , ${parseInt(eventid)},${parseInt(society_id)}, '${date}' 
             )`
        }
        pool = await connectionDb();
        const result = await pool.request().query(q)
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getPendingEventsApprovedByStaffhead,
    getCompletedEvents,
    getRejectedEvents,
    approvalrejection
}