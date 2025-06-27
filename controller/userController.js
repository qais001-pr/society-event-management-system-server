const { connectionDb } = require('../connectionDb')
const sql = require('mssql');

async function getUser(req, res) {
    const { userid } = req.params;
    console.log(userid);
    try {
        const pool = await connectionDb();
        console.log('Connected to the database');
        const result = await pool.request().query`Select * from users where userid = ${parseInt(userid)}`;
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
    const { name, username, gender, contact, email, role, password, societyid } = req.body;

    console.log('Received:', { name, username, gender, contact, email, role, password, societyid });

    try {
        const pool = await connectionDb();

        // ✅ 1) Check if username already exists
        const usernameResult = await pool.request()
            .input('username', sql.VarChar(100), username)
            .query(`SELECT COUNT(*) as count FROM users WHERE username = @username`);

        if (usernameResult.recordset[0].count > 0) {
            return res.status(400).json({
                status: 400,
                message: 'Username already exists. Please choose a different username.'
            });
        }

        // ✅ 2) Check if email already exists
        const emailResult = await pool.request()
            .input('email', sql.VarChar(255), email)
            .query(`SELECT COUNT(*) as count FROM users WHERE email = @email`);

        if (emailResult.recordset[0].count > 0) {
            return res.status(400).json({
                status: 400,
                message: 'Email already exists. Please use a different email.'
            });
        }
        await pool.request()
            .input('name', sql.VarChar(200), name)
            .input('username', sql.VarChar(100), username)
            .input('gender', sql.VarChar(50), gender)
            .input('contact', sql.VarChar(150), contact)
            .input('roles', sql.VarChar(50), role)  
            .input('email', sql.VarChar(255), email)
            .input('password', sql.VarChar(255), password)  
            .input('societyid', sql.Int, societyid)
            .execute('insert_users');

        console.log('User created successfully.');
        res.status(201).json(
            {
                status: 201,
                message: 'User created successfully.'
            });

    } catch (err) {
        res.status(500).send('Server error. Please try again later.');
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
        const result = await pool.request().query`select  u.*,s.society_id from users u
        left join societychairpersons s on u.user_id = s.user_id
        where email=${email} and password =${password}`;
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
