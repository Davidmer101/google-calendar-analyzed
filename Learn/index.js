import axios from 'axios';
async function demo (object) {
    try {
        let keys = ["Course Work", "Life", "Language", "MED", "Entertainment", "weekid"]
        keys.sort();
        keys = keys.filter((key) => {return key != "weekid"})
        console.log(keys)
        let result = await axios ({
            method: 'post',
            url: 'http://localhost:4000/api/weeks/',
            data: {
                "week": {
                    "id": 3,
                    "cal1": object[keys[0]],
                    "cal2": object[keys[1]],
                    "cal3": object[keys[2]],
                    "cal4": object[keys[3]],
                    "cal5": object[keys[4]]
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
    
    console.log('there')
}

let obj = {"weekid":"week1","Course Work":49.08333333333333,"Entertainment":12.75,"Language":0,"Life":75.74975527777778,"MED":0}
demo(obj);

// var sqlite3 = require('sqlite3').verbose();
// import sqlite3 from 'sqlite3';
// sqlite3.verbose();

// let data = [{   date: 'Nov 1, 2021',
//             CourseWork: {
//                 total: 9, 
//                 COMP: 2, 
//                 BIOL: 5, 
//                 HIST: 3
//             },
//             Entertainment: {
//                 total: 7, 
//                 game: 3, 
//                 Surfing: 3,
//                 Soccer: 1
//             }
//         }, {
//           date: 'Nov 2, 2021',
//           CourseWork: {
//               total: 7, 
//               COMP: 2, 
//               BIOL: 4, 
//               HIST: 1
//           },
//           Entertainment: {
//               total: 4, 
//               game: 1, 
//               Surfing: 2,
//               Soccer: 1
//           }
           
//         }];

//         const result = data.filter(word => word.date == "Nov 2, 2021");
//         console.log(Object.keys(result[0]));


//         var db = new sqlite3.Database(':memory:');
 
//         db.serialize(function() {
//           db.run("CREATE TABLE lorem (date TEXT, info TEXT)");
         
//           var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//           for (var i = 0; i < 10; i++) {
//               stmt.run("Ipsum " + i);
//           }
//           stmt.finalize();
         
//           db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//               console.log(row.id + ": " + row.info);
//           });
//         });
         
//         db.close();