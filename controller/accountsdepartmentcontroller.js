const { connectionDb } = require('../connectionDb')
async function getPendingEventsApprovedByAssisstantDirector(req, res) {
    let pool;
    let q = '';
    try {
        q = "SELECT e.*,aa.status as [aastatus]  FROM event_requisitions e left join adeventreviews aa on aa.event_id=e.event_requisition_id WHERE e.status = 'Approved' AND not EXISTS ( SELECT a.status FROM adeventreviews a WHERE a.event_id = e.event_requisition_id  AND (a.status = 'Approved' or a.status='Rejected'));";
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

async function getApprovedEvent(req, res) {
    let pool;
    let q = '';
    try {
        q = `SELECT e.*,ad.status as [aastatus]  FROM event_requisitions e
                    LEFT JOIN adeventreviews ad ON e.event_requisition_id = ad.event_id
                    WHERE e.status = 'Approved' AND ad.status = 'Approved'`;
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

async function getRejectedEvent(req, res) {
    let pool;
    let q = '';
    try {
        q = "select ee.*,ad.status as [aastatus] , ad.rejection_date as [adrejectiondate],ad.reviews as [adreview] from event_requisitions ee  left join adeventreviews ad on ee.event_requisition_id = ad.event_id  where ee.status = 'Aproved' or ad.status = 'Rejected'";
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

module.exports = {
    getPendingEventsApprovedByAssisstantDirector,
    getApprovedEvent,
    getRejectedEvent
}
