const { response } = require('express');
const { connectionDb } = require('../connectionDb');

async function getSociety(req, res) {
    try {
        const pool = await connectionDb();
        const response = await pool.request().query`SELECT * FROM Society`;
        const result = response.recordset
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching societies:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching societies.',
            error: error.message
        });
    }
}

async function createSociety(req, res) {
    try {
        const { title, name, budget, description, user_id } = req.body;
        const pool = await connectionDb();
        const result = await pool.request().query`Insert into Society (  S_title,S_name,budget,S_description,S_roles_id) 
        Values (${title},${name},${budget},${description},${user_id})`;
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching societies:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching societies.'
        });
    }
}

async function societyaccountdepartmentupdate(req, res) {
    try {
        const { status, newbudget, society_id, event_id, review } = req.body;
        const budget = newbudget
        console.log("Status:", status);
        console.log("Budget:", budget);
        console.log("Reviews:", review);
        const pool = await connectionDb();
        const checkQuery = `SELECT COUNT(*) as count FROM adeventreviews WHERE event_id = ${event_id}`;
        const checkResponse = await pool.request().query(checkQuery);

        if (checkResponse.recordset[0].count > 0) {
            return res.status(200).send({
                success: false,
                message: 'Event Already Updated'
            });
        }

        let q = '';

        const currentDate = new Date().toISOString().split('T')[0];
        if (status === 'Approved') {
            console.log(currentDate)
            q = `
        UPDATE society SET budget = ${budget} WHERE society_id = ${society_id};
        INSERT INTO adeventreviews (event_id, society_id, reviews, status, approved_date)
        VALUES (${event_id}, ${society_id}, '', 'Approved', '${currentDate}');
    `;
        }
        else if (status === 'Rejected') {
            console.log(currentDate)
            q = `
                INSERT INTO adeventreviews (event_id, society_id, reviews, status,rejection_date) 
                VALUES (${event_id}, ${society_id}, '${review}', '${status}','${currentDate}');
            `;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "Approved" or "Rejected".'
            });
        }

        const response = await pool.request().query(q);

        res.status(200).json({
            success: true,
            data: response.recordset || [],
            message: 'Update successful.'
        });

    } catch (error) {
        console.error('Error updating society account department:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating society information.',
            error: error.message
        });
    }
}
async function getEventsOnlyApprovedBySociety(req, res) {
    let pool;
    try {
        const { id } = req.params;
        console.log(id);

        pool = await connectionDb();

        const response = await pool.request().query`
            SELECT e.* 
            FROM event_requisitions e
            WHERE e.status = 'Approved' AND e.society_id = ${id}
            AND NOT EXISTS (
                SELECT 1
                FROM adeventreviews a
                WHERE a.event_id = e.event_requisition_id
                AND (a.status = 'Approved' OR a.status = 'Rejected')
            );
        `;

        console.log(`Fetched ${response.recordset.length} event(s).`);

        if (response.recordset.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Events shown successfully.',
                count: response.recordset.length,
                data: response.recordset
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No events found',
                data: []
            });
        }
    } catch (err) {
        console.error('Error fetching approved events without approved/rejected reviews:', err);
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
async function getSocietyEvent(req, res) {
    let pool;
    try {
        pool = await connectionDb();
        const result = await pool.request().query`Select e.* from event_requisitions e join adeventreviews a on
            e.event_requisition_id = a.event_id join staffhead s on s.eventid=e.event_requisition_id where a.status ='Approved' and s.status!='Approved''`
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching society events',
            error: error.message
        });
    }
}

module.exports = {
    getSociety,
    getSocietyEvent,
    getEventsOnlyApprovedBySociety,
    createSociety,
    societyaccountdepartmentupdate,
};
