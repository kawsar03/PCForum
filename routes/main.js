module.exports = function(app, shopData) {

    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('./login')
        } else { next (); }
    }

                                                                                                                                                      
    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });                                                                                                                                               
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });                                                                                                                                               
    app.get('/search', redirectLogin, function(req,res){
        res.render("search.ejs", shopData);
    });                                                                                                                                               
    app.get('/search-result', redirectLogin, function (req, res) {
        // Searching in the database
        res.send("You searched for: " + req.query.keyword);
    });
        app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);
    });                                                                                                                                               
    app.get('/addsoftwareissue', redirectLogin, function (req,res) {
        res.render('addsoftwareissue.ejs', shopData);
    });
    app.get('/addhardwareissue', redirectLogin, function (req,res) {
        res.render('addhardwareissue.ejs', shopData);
    });
    app.get('/listusers', function(req, res) {
        // Query database to get all the users
        let sqlquery = "SELECT * FROM userdetails";
                                                                                                                                                      
        // Execute sql query
        db.query(sqlquery, (err, result) => {                                                                                                         
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {Postedlist:result});
            console.log(newData)                                                                                                                      
            res.render("listusers.ejs", newData)
         });                                                                                                                                          
    });                                                                                                                                                
    app.get('/listSI', redirectLogin, function(req, res) {
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
    app.get('/listHI', redirectLogin, function(req, res) {
        // Query database to get all the Hardware issues
        let sqlquery = "SELECT * FROM hardware";
                                                                                                                                                      
        // Execute sql query
        db.query(sqlquery, (err, result) => {                                                                                                         
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {PostedHI:result});
            console.log(newData)                                                                                                                      
            res.render("listHI.ejs", newData)
         });                                                                                                                                          
    });

app.get('/login', function (req,res) {
res.render('login.ejs', shopData);
}); 

app.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})

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

app.get('/bargainbooks', redirectLogin, function(req,res) {
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

app.post('/softwareIssueadded', function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO software (title,issue) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.title, req.body.issue];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
            res.send(' This post was added to the forum, Title:   ' + req.body.title+ '  Issue:   ' + req.body.issue);
    });
});

app.post('/hardwareIssueadded', function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO hardware (title,issue) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.title, req.body.issue];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
            res.send(' This post was added to the forum, Title:   ' + req.body.title+ '  Issue:   ' + req.body.issue);
    });
});

app.post('/registered', function (req, res) {
    // Check if username already exists
    let existingUserQuery = "SELECT * FROM userdetails WHERE username = ?";
    db.query(existingUserQuery, [req.body.username], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        if (result.length > 0) {
            return res.send('This username is already in use. Please choose something different');
        }
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            // Store hashed password in database.
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
                                                                                                                                                      
app.post('/loggedin', function(req, res) {
    // Compare the form data with the data stored in the database
    let sqlquery = "SELECT hashedPassword FROM userdetails WHERE username = ?"; // query database to get the hashed password for the user
    // execute sql query
    let username = (req.body.username);
    db.query(sqlquery, username, (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      else if (result.length == 0) {
        // No user found with that username
        res.send('Invalid username or password');
      }
      else {
        // User found, compare the passwords
        let hashedPassword = result[0].hashedPassword;
        const bcrypt = require('bcrypt');
        bcrypt.compare((req.body.password), hashedPassword, function(err, result) {
          if (err) {
            // Handle error
            return console.error(err.message);
          }
          else if (result == true) {
            // Save user session here, when login is successful
            req.session.userId = req.body.username;
            // The passwords match, login successful
            res.send('Welcome, ' + (req.body.username) + '!' + '<a href='+'./'+'>Home</a>');


          }
          else {
            //  login failed
            res.send('Invalid username or password');
          }
        });
      }
    });
  });


    
}
