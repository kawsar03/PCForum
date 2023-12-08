module.exports = function(app, shopData) {
                                                                                                                                                      
    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });                                                                                                                                               
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });                                                                                                                                               
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });                                                                                                                                               
    app.get('/search-result', function (req, res) {
        // Searching in the database
        res.send("You searched for: " + req.query.keyword);
    });
        app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);
    });                                                                                                                                               
    app.get('/addsoftwareissue', function (req,res) {
        res.render('addsoftwareissue.ejs', shopData);
    });                                                                                                                                               
    app.get('/listSI', function(req, res) {
        // Query database to get all the software issues
        let sqlquery = "SELECT * FROM software";
                                                                                                                                                      
        // Execute sql query
        db.query(sqlquery, (err, result) => {                                                                                                         
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {PostedSI:result});
            console.log(newData)                                                                                                                      
            res.render("listSI.ejs", newData)
         });                                                                                                                                          
    });

app.get("/search-result", function (req, res) {
//search database
let sqlquery =
"SELECT * from books WHERE name like '%" + req.query.keyword + "%'";
db.query(sqlquery, (err, result) => {
if (err) {
res.send("Error");
//Send Error Message
}
res.send(result);
});
});

app.get('/bargainbooks', function(req,res) {
let sqlquery = "SELECT * FROM books WHERE price<20";
db.query(sqlquery, (err, result) => {
if (err) {
res.redirect('./');
}
let newData = Object.assign({}, shopData, {availableBooks:result});
console.log(newData)
res.render("bargainbooks.ejs", newData)
});
});


app.post('/registered', function (req, res) {
    // Checks if the username already exists
    let existingUserQuery = "SELECT * FROM userdetails WHERE username = ?";
    db.query(existingUserQuery, [req.body.username], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        if (result.length > 0) {
            return res.send('This username is already in use. Please choose something different');
        }

        // If the username is unique, continue with the insertion
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            // Store hashed password in your database.
            let sqlquery = "INSERT INTO userdetails (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
            // execute sql query
            let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered!  We will send an email to you at ' + req.body.email;
                    //result += 'Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword;
                    res.send(result);
                }
            });
        });
    });
});                                                                                                                                              
                                                                                                                                                      
    app.post('/softwareIssueadded', function (req,res) {
          // saving data in database
          let sqlquery = "INSERT INTO software (title, issue) VALUES (?,?)";
          // execute sql query
          let newrecord = [req.body.title, req.body.issue];
          db.query(sqlquery, newrecord, (err, result) => {                                                                                            
            if (err) {
              return console.error(err.message);
            }
            else
            res.send(' This issue is added to the database, title: '+ req.body.title
+ ' Issue '+ req.body.issue);
            });                                                                                                                                       
       });                                                                                                                                            
}
