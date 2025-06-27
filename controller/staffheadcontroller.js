const { connectionDb } = require('../connectionDb')
async function getPendingEventsApprovedByAccountsDepartment(req, res) {
    let pool;
    let q = '';
    try {
        q = "SELECT e.*,ad.status as [adstatus], ad.reviews as [adreviews], ad.approved_date as [adapprovaldate], ad.rejection_date as [adrejectiondate], st.status as [ststatus], st.approveds_date as [stapprovaldate], st.logistics_details as [logisticsdetails],st.rejections_date as [strejectiondate] FROM event_requisitions e LEFT JOIN adeventreviews ad ON e.event_requisition_id = ad.event_id  LEFT JOIN staffhead st ON e.event_requisition_id = st.eventid WHERE e.status = 'Approved' AND ad.status = 'Approved' ANd not EXISTS ( SELECT 1  FROM staffhead sfh  WHERE sfh.eventid = e.event_requisition_id)";
        pool = await connectionDb();
        const response = await pool.request()
            .query(q);
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

async function getApprovedEvents(req, res) {
    let pool;
    let q = '';
    try {
        q = "SELECT e.*,ad.status as [adstatus], ad.reviews as [adreviews], ad.approved_date as [adapprovaldate], ad.rejection_date as [adrejectiondate], st.status as [ststatus], st.approveds_date as [stapprovaldate], st.logistics_details as [logisticsdetails], st.rejections_date as [strejectiondate] FROM event_requisitions e LEFT JOIN adeventreviews ad ON e.event_requisition_id = ad.event_id LEFT JOIN staffhead st ON e.event_requisition_id = st.eventid WHERE e.status = 'Approved' AND ad.status = 'Approved' ANd EXISTS ( SELECT 1  FROM staffhead sfh  WHERE sfh.eventid = e.event_requisition_id and sfh.status!='Rejected' )";
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

async function getRejectedEvents(req, res) {
    let pool;
    let q = '';
    try {
        q = "SELECT e.*, ad.status as [adstatus], ad.reviews as [adreviews], ad.approved_date as [adapprovaldate], ad.rejection_date as [adrejectiondate], st.status as [ststatus], st.approveds_date as [stapprovaldate],st.logistics_details as [logisticsdetails], st.rejections_date as [strejectiondate] FROM event_requisitions e LEFT JOIN adeventreviews ad ON e.event_requisition_id = ad.event_id LEFT JOIN staffhead st ON e.event_requisition_id = st.eventid WHERE e.status = 'Approved' AND ad.status = 'Approved' ANd EXISTS ( SELECT 1  FROM staffhead sfh  WHERE sfh.eventid = e.event_requisition_id and sfh.status='Rejected' )";
        pool = await connectionDb();
        const response = await pool.request()
            .query(q);
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


async function addtechnicalRequirements(req, res) {
    let pool;
    const { details } = req.body;
    console.log(details)
    let q = '';
    try {
        q = `insert into technical_details values ('${details}')`;
        pool = await connectionDb();
        const response = await pool.request()
            .query(q);
        res.status(200).json({
            success: true,
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




async function gettechnicalRequirements(req, res) {
    let pool;
    let q = '';
    try {
        q = `Select * from technical_details `;
        pool = await connectionDb();
        const response = await pool.request()
            .query(q);
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

module.exports = {
    getPendingEventsApprovedByAccountsDepartment,
    getApprovedEvents,
    getRejectedEvents,
    addtechnicalRequirements,
    gettechnicalRequirements
}
