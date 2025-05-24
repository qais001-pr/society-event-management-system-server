const { connectionDb } = require('../connectionDb');

async function getEvents(req, res) {
    let pool;
    try {
        pool = await connectionDb();
        const result = await pool.request().query`SELECT e.*  FROM event_requisitions e 
        JOIN staffhead a  ON e.event_requisition_id = a.eventid WHERE a.status = 'Approved' 
        AND NOT EXISTS ( SELECT 1  FROM ITHEAD i  WHERE i.eventid = e.event_requisition_id);`
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

async function getEventsBySociety(req, res) {
    let pool;
    try {
        const { id } = req.params;
        console.log(id);
        pool = await connectionDb();
        const result = await pool.request().query`SELECT e.*  FROM event_requisitions e 
        JOIN staffhead a  ON e.event_requisition_id = a.eventid WHERE a.status = 'Approved' and e.society_id =${id} AND NOT EXISTS ( SELECT 1  FROM ITHEAD i  WHERE i.eventid = e.event_requisition_id);`
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
    getEvents,
    getEventsBySociety,
    approvalrejection
}