import express from 'express';
export const apiRouter = express.Router();
import {weeksRouter} from './weeks.js'
import {usersRouter} from './users.js'

apiRouter.use('/weeks', weeksRouter);
apiRouter.use('/users', usersRouter);

// module.exports = apiRouter;
