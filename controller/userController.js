const { connectionDb } = require('../connectionDb')
async function getUser(req, res) {
    const { userid } = req.params; // Use req.params to get the id from the URL
    console.log(userid); // Log the id to see if it's being captured correctly 
    try {
        const pool = await connectionDb();
        console.log('Connected to the database');
        const result = await pool.request().query`Select * from users where userid = ${parseInt(userid)}`; // Adjust the query as needed
        res.status(201).json(result.recordset);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
}
async function getAllUsers(req, res) {
    try {
        const pool = await connectionDb();
        console.log('Connected to the database');
        const result = await pool.request().query("select * from users");
        res.status(200).json({
            success: true,
            result: result.recordset
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function createUser(req, res) {
    const { name, username, gender, contact, email, role, password } = req.body;
    console.log(name);
    console.log(username);
    console.log(gender);
    console.log(contact);
    console.log(email);
    console.log(role);
    console.log(password);
    // Check if the required fields are provided
    try {
        const pool = await connectionDb();
        await pool.request().query`
            INSERT INTO users
            VALUES (${name}, ${username}, ${gender}, ${contact}, ${role}, ${email},
            ${password})
        `;
        res.status(201).send('User created'); // Send a success response
        console.log('User created successfully');
    } catch (err) {
        console.error('❌ Error while creating employee:', err);
        res.status(500).send('Server error');
    }
}

async function updateUser(req, res) {
    const { userid } = req.params;
    const { password } = req.body;
    console.log(userid)
    console.log(password)
    try {
        const pool = await connectionDb();
        const result = await pool.request().query`Update users set password = ${password} where user_id =  ${parseInt(userid)}`
        res.status(200).json(result.rowsAffected[0]);
    } catch (err) {
        res.status(500).send('Server error');
        console.error(' Error while updating employee:', err);
    }
}
async function deleteUser(req, res) {
    try {
        const { userid } = req.params;
        console.log(userid)
        const pool = await connectionDb();
        const result = await pool.request().query`delete from users where userid = ${parseInt(userid)}`;
        res.status(200).json(result.rowsAffected[0]);
        console.log('Deleted successfully');
        console.log('affected Rows', result.rowsAffected[0]);
    } catch (error) {
        console.error(' Error while deleting user:', error);
        res.status(500).send('Server error');
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const pool = await connectionDb();
        const result = await pool.request().query`select * from users where email = ${email} and password = ${password}`;
        res.status(201).json({
            success: true,
            result: result.recordset
        });
    } catch {
        res.status(500).send('Server error');
    }
}

async function forgotpassword(req, res) {
    try {
        const { email } = req.body;
        console.log(email);
        const pool = await connectionDb();
        const result = await pool.request().query`select user_id from users where email = ${email}`;
        console.log(result.recordset);
        res.status(201).json({
            success: true,
            result: result.recordset
        });
    } catch (error) {
        console.error('Error while deleting user:', error);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    forgotpassword
}
// Compare this snippet from app.js: