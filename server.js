const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: './config/config.env' });

const app = express();
app.use(express.json());

// DB config
const db = process.env.mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log(`MongoDB connected...`))
    .catch(err => console.log(err))  

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/auth/auth'));
app.use('/api/articles', require('./routes/api/articles'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));