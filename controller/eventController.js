const { connectionDb } = require('../connectionDb')
async function getEvents(req, res) {
    let pool;
    try {
        pool = await connectionDb();
        const response = await pool.request().query`SELECT * FROM event_requisitions  order by approved_date asc `;
        res.status(200).json({
            success: true,
            data: response.recordset
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve events',
            data: []
        });
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function createEvents(req, res) {
    let pool;
    try {
        const {
            eventName,
            venue,
            description,
            startDate,
            endDate,
            startTime,
            endTime,
            budget,
            resources,
            submissiondate,
            notes,
            society_id,
            user_id
        } = req.body;
        const status = 'Pending'
        const approved_date = null;
        const rejection_date = null;
        pool = await connectionDb();

        const checkEventName = await pool.request().query(`
            SELECT COUNT(*) FROM event_requisitions WHERE event_name = '${eventName}'
        `);
        if (checkEventName.recordset[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Event already exists'
            });
        }

        await pool.request().query(`
            INSERT INTO event_requisitions VALUES (
                '${eventName}',
                '${venue}',
                '${description}',
                '${startDate}',
                '${endDate}',
                '${startTime}',
                '${endTime}',
                ${budget},
                '${resources}',
                '${status}',
                '${submissiondate}',
                ${approved_date},
                ${rejection_date},
                '${notes}',
                ${society_id},
                ${user_id}
            )
        `);

        return res.status(201).json({
            success: true,
            message: "Event created successfully"
        });

    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create event",
            error: error.message
        });
    }
}

async function getEvent(req, res) {
    const { id } = req.params
    let pool;
    try {
        pool = await connectionDb();
        const response = await pool.request().query`SELECT * FROM event_requisitions where event_requisition_id=${parseInt(id)}`;
        res.status(200).json({
            success: true,
            data: response.recordset
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve event',
            data: []
        });
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getEventsByname(req, res) {
    let pool;
    try {
        const { query } = req.params;

        const sanitizedQuery = query.replace(/'/g, "''");

        pool = await connectionDb();
        const sqlQuery = `SELECT * FROM event_requisitions WHERE event_name LIKE '${sanitizedQuery}%'`;

        const response = await pool.request()
            .query(sqlQuery);

        res.status(200).json({
            success: true,
            data: response.recordset
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (pool) await pool.close();
    }
}

async function getEventsBySociety(req, res) {
    let pool;
    try {
        const { society_id } = req.params
        pool = await connectionDb();
        const response = await pool.request().query`SELECT * FROM event_requisitions where society_id = ${parseInt(society_id)}`;
        res.status(200).json({
            success: true,
            data: response.recordset
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Failed to show events',
            data: []
        });
    } finally {
        if (pool) {
            await pool.close();
        }
    }

}

async function getEventsByStatus(req, res) {
    let pool;
    let q = '';
    try {
        const { status } = req.params;
        q = `SELECT * FROM event_requisitions WHERE status = '${status}' order by approved_date asc`
        if (status === 'Rejected') {
            q = `select 
e.*,
ar.status as [adstatus],
sh.status as [staffheadstatus],
it.STATUS as [itheadstatus]
from event_requisitions e 
LEFT JOIN adeventreviews ar ON ar.event_id = e.event_requisition_id
LEFT JOIN staffhead sh ON sh.eventid = e.event_requisition_id
LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
WHERE e.status = 'Rejected' 
or ar.status != 'Approved' 
or sh.status !='Approved' 
or it.status != 'Completed' ;`
        }

        pool = await connectionDb();
        const response = await pool.request()
            .query(q);
        res.status(200).json({
            success: true,
            data: response.recordset
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve events',
            data: []
        });
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getRejectedEventsBySocietyID(req, res) {
    let pool;
    let q = '';
    try {
        const { id } = req.params;
        console.log(id)
        q = `select 
                        e.*,
                        ar.status as [adstatus],
                        sh.status as [staffheadstatus],
                        it.STATUS as [itheadstatus]
                        from event_requisitions e 
                        LEFT JOIN adeventreviews ar ON ar.event_id = e.event_requisition_id
                        LEFT JOIN staffhead sh ON sh.eventid = e.event_requisition_id
                        LEFT JOIN ITHEAD it ON it.EVENTID = e.event_requisition_id
                        WHERE e.status = 'Rejected' 
                        or ar.status != 'Approved' 
                        or sh.status !='Approved' 
                        or it.status != 'Completed' and e.society_id = ${id} ;`
        pool = await connectionDb();
        const response = await pool.request().query(q);
        res.status(200).json({
            success: true,
            data: response.recordset
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        });
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}


async function updateEventsByStatus(req, res) {
    let pool;
    try {
        const { status, event_requisition_id, review, date } = req.body;
        console.log(status)
        console.log(event_requisition_id)
        console.log(date)
        console.log(review)
        if (!status || !event_requisition_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: status or event_requisition_id',
            });
        }

        pool = await connectionDb();

        let updateQuery = '';
        const parsedEventId = parseInt(event_requisition_id);
        const formattedDate = date ? `'${date}'` : 'NULL';
        if (status === 'Pending' && !review) {
            updateQuery = `
                UPDATE event_requisitions
                SET status = 'Approved', approved_date = ${formattedDate}
                WHERE event_requisition_id = ${parsedEventId};
            `;
        } else if (status === 'Rejected' && review) {
            updateQuery = `
                UPDATE event_requisitions
                SET status = 'Rejected', rejection_date = ${formattedDate} 
                WHERE event_requisition_id = ${parsedEventId};
            `;
        }

        await pool.request().query(updateQuery);

        if (status !== 'Approved' && review) {
            const insertQuery = `
                INSERT INTO event_reviews 
                VALUES ('${review}', ${parsedEventId});
            `;
            await pool.request().query(insertQuery);
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `${error.message}`,
        });
    } finally {
        if (pool) await pool.close();
    }
}

async function getEventsOnlyApproved(req, res) {
    let pool;
    try {
        pool = await connectionDb();

        const response = await pool.request().query`
           SELECT e.*,aa.status as [aastatus] 
            FROM event_requisitions e left join adeventreviews aa on aa.event_id=e.event_requisition_id
            WHERE e.status = 'Approved'
            AND not EXISTS (
                SELECT a.status
                FROM adeventreviews a
                WHERE a.event_id = e.event_requisition_id
                AND (a.status = 'Approved' or a.status='Rejected')
            );
        `;

        res.status(200).json({
            success: true,
            message: 'Events shown successfully.',
            count: response.recordset.length,
            data: response.recordset
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve events.',
            data: []
        });

    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

module.exports = {
    getEvents,
    createEvents,
    getEvent,
    getEventsByname,
    getEventsBySociety,
    getEventsByStatus,
    updateEventsByStatus,
    getEventsOnlyApproved,
    getRejectedEventsBySocietyID
}