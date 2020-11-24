import express from 'express'
import cors from 'cors'
import errorhandler from 'errorhandler'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import path from 'path'
import engine from 'consolidate'
import expressSession from 'express-session';
import {apiRouter} from './api/api.js';

export const app = express();

app.use(expressSession({
    name: "comp426SessionCookie",
    secret: "express session secret",
    resave: false,
    saveUninitialized: false
}));


const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter); //try to change that api thingi 

app.use(errorhandler());
app.use(morgan('dev'));

//app.set('view engine', 'html')
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});

// module.exports = app;

