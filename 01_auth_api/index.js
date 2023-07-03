const express = require('express');
const dotenv = require('dotenv');
const app = express();
const authRouter = require('./authRouter')
dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/', authRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})