const express = require('express');
const app = express();
const { connectionDb } = require('./connectionDb');


const userRouter = require('./routes/userrouter');
const societyRouter = require('./routes/societyroutes');
const eventRouter = require('./routes/eventroutes');
const logisticsrouter = require('./routes/logisticsroutes');
const itheadRouter = require('./routes/itheadroutes');
const societychairpersonRouter = require('./routes/societychairpersonroutes');
const accountdepartmentroutes = require('./routes/accountsdepartmentroutes')
const staffhead = require('./routes/staffheadroutes')
connectionDb();


app.use(express.json());


app.use('/api/users', userRouter);
app.use('/api/societies', societyRouter);
app.use('/api/events', eventRouter);
app.use('/api/logistics', logisticsrouter)
app.use('/api/ithead', itheadRouter)
app.use('/api/societychairperson', societychairpersonRouter);
app.use('/api/accountsdepartment', accountdepartmentroutes);
app.use('/api/staffhead/events', staffhead);


app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});


app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});


const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

