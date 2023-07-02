var https = require('http');
var qs = require('querystring');
const url = require("url");
//const mysql = require('mysql2');
const mysql = require('mysql2/promise');
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "mmuenglish_mmu",
//   password: "mmuenglish_mmu",
//   database : 'mmuenglish_mmu'
// });
async function getConnection(){
  return  await  mysql.createConnection({host: "localhost",user: "mmuenglish_mmu",password: "mmuenglish_mmu",database : 'mmuenglish_mmu'});
}
async function quizeHandeler(id,res){
  var responseArray = [];
           var query1 = "SELECT apply_course.customer_id, courses.* FROM apply_course LEFT JOIN courses ON apply_course.course_id = courses.courses_id WHERE  apply_course.status = 'Accepted' AND apply_course.customer_id ='"+id+"'";
            
           var con =await getConnection();
           const [rows, fields] = await con.execute(query1);
           

           for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            var courses_id = element["courses_id"];
            var query2 = "SELECT id as quiz_id,title, num_retakes,exam_time,exam_start,exam_end, total_point FROM quizzes WHERE status='Yes' AND is_practice != 'on' AND course_id ="+courses_id;
            const [rows2, fields2] = await con.execute(query2);
          
            for (let index2 = 0; index2 < rows2.length; index2++) {
              const element2 = rows2[index2];

              responseArray.push(element2);
              /*
              var quiz_id = element2['quiz_id'];
             // responseArray.push(element2);
            
              var examCount = 0;
              var query3 = "SELECT count(ans_id) as total FROM answere_history WHERE quiz_id='"+quiz_id+"' AND customer_id='"+id+"'";
              //responseArray.push(query3);
            
              const [rows3, fields3] = await con.execute(query3);

              var query4 ="SELECT * FROM sections WHERE quiz_id = "+quiz_id ;
              const [rows4, fields4] = await con.execute(query4);

              var singleSection = rows4[0]["section_id"] ;

              var query5 ="SELECT count(*) as existing_lecture_count FROM lectures WHERE section_id ="+singleSection ;
              const [rows5, fields5] = await con.execute(query5);

              var query6 ="SELECT count(*) as viewed_lecture_count FROM customer_lecture_complete WHERE section_id ="+singleSection ;
              const [rows6, fields6] = await con.execute(query6);
             

              responseArray.push({"quiz_id":element2["quiz_id"],"title":element2["title"],"exam_time":element2["exam_time"],"num_retakes":element2["num_retakes"],"exam_start":element2["exam_start"],
              "exam_end":element2["exam_end"], "totalExamAppeadred":rows3});
               */

            //  var examCount = rows3["total"];
            //  responseArray.push({"count":examCount,"quiz_name":results2[index]["title"]});
              
             


            
            
            }

          }
           res.end(JSON.stringify(responseArray));
          }
async function allStudentHandeler(res){
  var responseArray = [];
          // var query1 = "SELECT apply_course.customer_id, courses.* FROM apply_course LEFT JOIN courses ON apply_course.course_id = courses.courses_id WHERE  apply_course.status = 'Accepted' AND apply_course.customer_id ='"+id+"'";
            var con =await getConnection();
        //  const rows = await con.query(query1);
           const [rows, fields]  = await con.execute('SELECT * FROM customers');
            res.end(JSON.stringify(rows));
         
          // res.end("total "+query1);

}
var server = https.createServer(function(req, res) {
    // con.connect(function(err) {
   // con.connect();
    const parsed = url.parse(req.url, true);
    const reqUrl = parsed.pathname;
    res.writeHead(200, {'Content-Type': 'text/plain'});
   
    if (req.method == "GET"  && reqUrl == "/api-node/students") {
        // con.query(
        //   'SELECT * FROM customers',
        //   function(err, results, fields) {
        //       res.end(JSON.stringify(results));
        //     console.log(results); // results contains rows returned by server
        //     console.log(fields); // fields contains extra meta data about results, if available
        //   }
        // );
        
  
       allStudentHandeler(res);
        // con.query('SELECT * FROM customers', function (error, results, fields) {
        //           if (error){ res.end("Error");}
        //           res.end(JSON.stringify(results));
        //           });
                 
       
    }else if (req.method == "POST" && reqUrl == "/api-node/student") {
        
        var body = '';
        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
           var bo =  JSON.parse(body);
           var id = bo["id"] ;
            con.query('SELECT * FROM customers where cusid = "'+id+'"', function (error, results, fields) {
                  if (error){ res.end("Error");
                    }
                      res.end(JSON.stringify(results));
                
                  });
          
            
        });
        
        }
        else if (req.method == "POST" && reqUrl == "/api-node/quiz") {
        
             var body = '';
        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

          req.on('end',  function () {
           var bo =  JSON.parse(body);
           var id = bo["id"] ;
           quizeHandeler(id,res);
        //   var responseArray = [];
           
           
           
        
        //   var query1 = "SELECT apply_course.customer_id, courses.* FROM apply_course LEFT JOIN courses ON apply_course.course_id = courses.courses_id WHERE  apply_course.status = 'Accepted' AND apply_course.customer_id ='"+id+"'";
           
           
           
        //   const rows = await con.query(query1);
        //   res.end(JSON.stringify(rows));
           if(false)  con.query(query1, function (error, results, fields) {
                  if (error){ res.end("Error");
                    }

                    for (let index = 0; index < results.length; index++) {
                        const element = results[index];
                        var courses_id = element["courses_id"];
                        var query2 = "SELECT id as quiz_id,title, num_retakes,exam_time,exam_start,exam_end, total_point FROM quizzes WHERE status='Yes' AND is_practice != 'on' AND course_id ="+courses_id;
                   
                      con.query(query2, function (error, results2, fields) {
                            if (error){ res.end("Error");
                              }
          
                              for (let index = 0; index < results2.length; index++) {
                                  const element2 = results2[index];
                                  var quiz_id = element2['quiz_id'];
                                  var examCount = 0;
                                  var query3 = "SELECT count(ans_id) as total FROM answere_history WHERE quiz_id='$id' AND customer_id='"+quiz_id+"'";
                                  con.query(query3, function (err, result) {
                                    if (err) throw err;
                                    console.log("Result: " + result);
                                    examCount = result["total"];
                                    responseArray.push({"count":examCount,"quiz_name":results2[index]["title"]});
                                  });
                                  
                              }
                              
                              
                              // res.end(JSON.stringify({"a":query1}));
                          
                            });
                        
                    }
                    
                    
                      res.end(JSON.stringify(responseArray));
                
                  });
          
            
        });
        
        }else{
             res.end(JSON.stringify(parsed));
        }
         
         
         
  //   });
 
   
     
});

   



server.listen();
