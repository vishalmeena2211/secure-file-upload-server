const express = require('express');
const router = require('./routes/route');
const connectDB = require('./config/db');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', router);

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});