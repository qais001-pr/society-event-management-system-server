const { connectionDb } = require('../connectionDb')

async function getPendingEvents(req, res) {
    let pool;
    try {
        pool = await connectionDb()
        const response = await pool.request().query`select 
                            e.event_requisition_id,e.event_name,
                            e.event_start_date,
                            e.venue,
                            e.society_id,
                            e.event_start_time,e.status from event_requisitions e
                            LEFT JOIN adeventreviews ar ON ar.event_id = e.event_requisition_id
                            LEFT JOIN staffhead sh ON sh.eventid = e.event_requisition_id
                            LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
                            WHERE
                            e.status != 'Rejected'
                            AND (ar.status IS NULL OR ar.status != 'Rejected')
                            AND (sh.status IS NULL OR sh.status != 'Rejected')
                            AND (it.STATUS IS NULL OR it.STATUS NOT IN ('Completed', 'Rejected')) order by STATUS desc`
        res.status(200).json({
            success: true,
            result: response.recordset
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            result: error.message
        })
    }
}
async function getRejectedEvents(req, res) {
    let pool;
    try {
        pool = await connectionDb()
        const response = await pool.request().query`select 
                            e.event_requisition_id,e.event_name,
                            e.event_start_date,
                            e.venue,
                            e.society_id,
                            e.event_start_time,
                            e.status as [eventstatus],
                            ar.status as [arstatus],
                            sh.status as [staffheadstatus],
                            it.status as [itheadstatus]
                            from event_requisitions e
                            LEFT JOIN adeventreviews ar ON ar.event_id = e.event_requisition_id
                            LEFT JOIN staffhead sh ON sh.eventid = e.event_requisition_id
                            LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
                            WHERE e.status = 'Rejected'  or ar.status != 'Approved' or sh.status !='Approved' or it.status != 'Completed';`
        res.status(200).json({
            success: true,
            result: response.recordset
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            result: error.message
        })
    }
}
async function getCompletedEvents(req, res) {
    let pool;
    try {
        pool = await connectionDb()
        const response = await pool.request().query`Select 
                            e.event_requisition_id,
                            e.event_name,
                            e.event_start_date,
                            e.venue,
                            e.society_id,
                            e.event_start_time,
                            it.status
                            from event_requisitions e
                            LEFT JOIN adeventreviews ar ON ar.event_id = e.event_requisition_id
                            LEFT JOIN staffhead sh ON sh.eventid = e.event_requisition_id
                            LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
                           where it.status='Completed'`
        res.status(200).json({
            success: true,
            result: response.recordset
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            result: error.message
        })
    }
}

async function DeleteEvents(req, res) {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionDb()
        await pool.request().query`Delete  event_requisitions  where event_requisition_id=${id} `
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            result: error.message
        })
    }
}

async function getEventByid(req, res) {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionDb()
        const result = await pool.request().query`SELECT e.event_requisition_id,e.event_name,e.venue,e.event_description,e.budget,e.resources,e.notes,e.event_start_date,e.event_end_date,e.event_start_time,e.event_end_time,s.S_name FROM event_requisitions e LEFT JOIN Society s ON e.society_id = s.society_id WHERE e.event_requisition_id =	${id};`
        res.status(200).json({
            success: true,
            data: result.recordset,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            result: error.message
        })
    }
}

async function getEventDetailsByid(req, res) {
    const { id } = req.params;
    let pool;
    try {
        pool = await connectionDb()
        const result = await pool.request().query`select Top (1) e.event_requisition_id as [eventid],e.event_name,e.venue ,e.event_description ,e.event_start_date ,e.[event_end_date],e.[event_start_time],e.[event_end_time],e.[budget],e.[resources],e.[status],e.[submission_date],e.[approved_date],e.[rejection_date],e.[notes],e.[society_id],e.[users_id],er.reviews as [event_review]
,a.approved_date as [accountdepartment_approvaldate],a.rejection_date as[accountdepartment_rejectiondate],a.reviews as[accountdepartmentreviews],a.status as [accountdepartmentstatus]
,s.logistics_details as [staffheadlogistics], s.approveds_date as [staffheadsapprovaldate],s.rejections_date as [staffheadrejectiondate],s.status as [staffheadstatus]
,i.TECHNICALREQUIREMENTS as [itheadtechnicalrequirements],i.COMPLETEDDATE as [itheadcompletiondate], i.REJECTEDDATE as [itheadrejectiondate],i.STATUS as [itheadstatus]
,ss.S_name as [SocietyName] ,
ss.S_title as [SocietyTitle],
ss.budget as [SocietyBudget]
,ss.S_description as [SocietyDescription]
 from event_requisitions e
left join Society ss on e.society_id=e.society_id
left join event_reviews er on e.event_requisition_id=er.event_id
left join  adeventreviews a on e.event_requisition_id = a.event_id 
left join staffhead s on e.event_requisition_id = s.eventid
left join ITHEAD i on e.event_requisition_id = i.EVENTID
where e.event_requisition_id=${id};`
        res.status(200).json({
            success: true,
            data: result.recordset,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            result: error.message
        })
    }
}

async function updateEvents(req, res) {
    let pool;
    try {
        const { eventName, venue, description, budget, resources, notes, startTime, endTime, startDate, endDate, user_id, society_id } = req.body;
        const { id } = req.params;
        console.log("ID", id);
        console.log("name", eventName);
        console.log("Venue", venue)
        console.log("description", description);
        console.log("Budget", budget);
        console.log("resources", resources);
        console.log("notes", notes)
        console.log("Start Date", startDate)
        console.log("End Date", endDate)
        console.log("Start Time", startTime)
        console.log("End Time", endTime)
        console.log("User ID", user_id)
        console.log("Society Id", society_id)
        pool = await connectionDb();
        await pool.request().query(`
            UPDATE event_requisitions SET
                event_name = '${eventName}',
                venue = '${venue}',
                event_description = '${description}',
                event_start_date = '${startDate}',
                event_end_date = '${endDate}',
                event_start_time = '${startTime}',
                event_end_time = '${endTime}',
                budget = ${budget},
                resources = '${resources}',
                notes = '${notes}',
                society_id = ${society_id},
                users_id = ${user_id}
            WHERE event_requisition_id = ${id};
        `);

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            result: error.message
        })
    }
}

module.exports = {
    getPendingEvents,
    getRejectedEvents,
    getCompletedEvents,
    DeleteEvents,
    getEventByid,
    getEventDetailsByid,
    updateEvents
}