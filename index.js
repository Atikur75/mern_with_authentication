require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dbConnection = require('./confiq/db');
const router = require('./routes');
const app = express();

dbConnection();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);


app.listen(8000);