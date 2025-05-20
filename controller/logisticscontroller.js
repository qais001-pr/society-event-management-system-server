const { connectionDb } = require('../connectionDb')
async function handleeventlogistics(req, res) {
    let currentDate = new Date().toISOString().split('T')[0];
    let pool;
    let q = '';

    const { logistics, status, eventid, societyid } = req.body;

    console.log(logistics);
    console.log(status);
    console.log(societyid);
    console.log(eventid);

    try {
        if (status === 'Approved') {
            q = `INSERT INTO Staffhead (logistics_details, status, eventid, societyid, approveds_date) 
                 VALUES ('${logistics}', '${status}', ${eventid}, ${societyid}, '${currentDate}')`;
        } else if (status === 'Rejected') {
            q = `INSERT INTO Staffhead (logistics_details, status, eventid, societyid, rejections_date) 
                 VALUES ('${logistics}', '${status}', ${eventid}, ${societyid}, '${currentDate}')`;
        } else {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        pool = await connectionDb();
        const result = await pool.request().query(q);
        console.log(result);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Error executing query:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    handleeventlogistics,
}