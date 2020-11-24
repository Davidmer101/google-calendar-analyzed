import express from 'express';
export const weeksRouter = express.Router();
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

weeksRouter.param('weekId', (req, res, next, weekId) => { // check if Id exits (simplifying)
    const sql = 'SELECT * FROM Weeks WHERE Weeks.id = $weekId AND Weeks.username = $username';
    const values = {$weekId: weekId, $username:req.session.user};
    db.get(sql, values, (error, week) => {
        if(error) {
            next(error);
        } else if (week) {
            req.week = week;
            next();
        } else {
            res.sendStatus(404);
        }
    })
})

weeksRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Weeks WHERE Weeks.username = $username';
    const values = {$username:req.session.user};
    db.all(sql, values, (error, week) => {
        if(error) {
            next(error);
        } else if (week) {
            res.status(200).json({week: week})
            next();
        } else {
            res.sendStatus(404);
        }
    })
    // db.all(`SELECT * FROM Weeks WHERE username = efc`,
    //     (err, weeks) => {
    //         if(err) {
    //             next(err);
    //         } else {
    //             if(req.session != undefined) {
    //                 res.status(200).json({weeks: weeks, user: req.session.user})
    //             } else {
    //                 res.status(200).json({weeks: weeks})
    //             }
    //         }
    //     });
}) 

weeksRouter.get('/:weekId', (req, res, next) => {
    res.status(200).json({week: req.week})
})

weeksRouter.post('/', (req, res, next) => {
    const id = req.body.week.id;
    const cal1 = req.body.week.cal1;
    const cal2 = req.body.week.cal2;
    const cal3 = req.body.week.cal3;
    const cal4 = req.body.week.cal4;
    const cal5 = req.body.week.cal5;
    const username = req.session.user;
    // if(!id || !cal1 || !cal2 || !cal3 || !cal4 || !cal5) {
    //     return res.sendStatus(400);
    // } //I will accpet zeroes
   const sql = 'INSERT INTO Weeks (id, cal1, cal2, cal3, cal4, cal5, username) ' + 
                ` VALUES ($id,$cal1, $cal2, $cal3, $cal4, $cal5, $username)`;
   const values = {
       $id: id,
       $cal1: cal1,
       $cal2: cal2,
       $cal3: cal3,
       $cal4: cal4,
       $cal5: cal5,
       $username: username
   }

   db.run(sql, values, function(error) {
       if(error) {
        //    next(error);
        res.redirect('/:weekId');
       } else {
           db.get(`SELECT * FROM Weeks WHERE Weeks.id = ${this.lastID}`,
           (error, week) => {
                res.status(201).json({week: week});
           } )
       }
   })

})

weeksRouter.put('/:weekId', (req, res, next) => {
    const id = req.body.week.id;
    const cal1 = req.body.week.cal1;
    const cal2 = req.body.week.cal2;
    const cal3 = req.body.week.cal3;
    const cal4 = req.body.week.cal4;
    const cal5 = req.body.week.cal5;
    const username = req.session.user;
    // if(!id || !cal1 || !cal2 || !cal3 || !cal4 || !cal5) {
    //     return res.sendStatus(400);
    // } //I will accept zeroes

  
    const sql = 'UPDATE Weeks SET cal1 = $cal1, cal2 = $cal2, ' +
    'cal3 = $cal3, cal4 = $cal4, cal5 = $cal5, username = $username ' +
    'WHERE Weeks.id = $weekId';

    const values = {
        $cal1: cal1,
        $cal2: cal2,
        $cal3: cal3,
        $cal4: cal4,
        $cal5: cal5,
        $username: username,
        $weekId: req.params.weekId
    };

    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Weeks WHERE Weeks.id = ${req.params.weekId}`, (error, week) => {
               res.status(200).json({ week: week})
            })
        }
    })
})

weeksRouter.delete('/', (req, res, next) => {
    const sql = `DELETE FROM Weekss`;
    db.run(sql, (error) => {
        if(error) {
            next(error);
        } else {
            res.json({deleted: 'yes'})
        }
    })
})


// direct /weeks
// module.exports = weeksRouter;
// function getNextId() {
//     db.get('SELECT COUNT(*) AS id FROM Weeks', (error, count) => {
//         console.log(count.id)
//         return count.id
//     })
// }