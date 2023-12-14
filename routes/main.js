module.exports = function(app, shopData) {

    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('./login')
        } else { next (); }
    }

    const { check, validationResult } = require('express-validator');

                                                                                                                                                      
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
    app.get('/search-result', function (req, res) {
        const keyword = `%${req.query.keyword}%`;
    
        // Perform the search in both "software" and "hardware" tables
        const query = `
            SELECT 'Software' AS category, title, issue FROM software 
            WHERE title LIKE ? OR issue LIKE ?
            UNION
            SELECT 'Hardware' AS category, title, issue FROM hardware 
            WHERE title LIKE ? OR issue LIKE ?`;
    
        db.query(query, [keyword, keyword, keyword, keyword], (err, results) => {
            if (err) {
                console.error('Error executing the search query:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            let newData = Object.assign({}, shopData, { results: results });
            // Process the search results
            res.render('result.ejs', newData);
        });
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
app.get('/removeuser', redirectLogin, function (req,res) {
    res.render('removeuser.ejs', shopData);
});
app.post('/userremoved', redirectLogin, function (req, res) {
    const usernameToRemove = req.sanitize(req.body.username);

    // delete from database
    const deleteQuery = "DELETE FROM userdetails WHERE username = ?";
    db.query(deleteQuery, [usernameToRemove], (err, result) => {
        if (err) {
            console.log('Error removinguser:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Result:', result);

            if (result.affectedRows > 0) {
                console.log('User removed successfully');
                res.send('The user has successfully been removed. <a href='+'./'+'>Home</a>');
            } else {
                console.log('User not found');
                res.send('We were not able to locate this user. Please try again later <a href='+'./'+'>Home</a>');
            }
        }
    });
});

const http = require('https');

app.get('/GamesAPI', function (req, res) {
    const requestOptions = {
        method: 'GET',
        hostname: 'free-to-play-games-database.p.rapidapi.com',
        port: null,
        path: '/api/filter?tag=3d.mmorpg.fantasy.pvp&platform=pc',
        headers: {
            'X-RapidAPI-Key': '5b3d4c744dmsh71f2384b8fd09f8p1763d4jsnd48eb0dfdb8a',
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };

    const gameHttpRequest = http.request(requestOptions, function (response) {
        console.log('Response status code:', response.statusCode);

        const chunks = [];

        response.on('data', function (chunk) {
            chunks.push(chunk);
        });

        response.on('end', function () {
            const body = Buffer.concat(chunks);
            const games = JSON.parse(body.toString());

            // Pass the games data to the EJS template
            res.render('GamesAPI', { shopName: 'PC Forum', games });
        });
    });

    gameHttpRequest.end();
});


app.post('/softwareIssueadded', function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO software (title,issue) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.sanitize(req.body.title), req.sanitize(req.body.issue)];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
            res.send(' This post was added to the forum, Title:   ' + req.sanitize(req.body.title)+ '  Issue:   ' + req.sanitize(req.body.issue));
    });
});

app.post('/hardwareIssueadded', function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO hardware (title,issue) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.sanitize(req.body.title), req.sanitize(req.body.issue)];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
            res.send(' This post was added to the forum, Title:   ' + req.body.title+ '  Issue:   ' + req.body.issue);
    });
});

const bcrypt = require('bcrypt');

app.post('/registered',
    [
        check('email').isEmail(),
        check('password')
            .isLength({ min: 8 }).withMessage('Please lengthen this text to 8 characters or more. (You are currently using characters)')
            .matches(/\d/).withMessage('Password must contain at least one number')
    ],
    function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Handle validation errors, you might want to send back an error response or redirect
            return res.redirect('./register');
        } else {
            // Check if username already exists
            let existingUserQuery = "SELECT * FROM userdetails WHERE username = ?";
            db.query(existingUserQuery, [req.body.username], (err, result) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }

                if (result.length > 0) {
                    return res.send('This username is already in use. Please choose something different');
                }

                const saltRounds = 10;
                const plainPassword = req.body.password;

                bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
                    if (err) {
                        return res.status(500).send('Internal Server Error');
                    }

                    // Store hashed password in the database
                    let sqlquery = "INSERT INTO userdetails (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
                    let newrecord = [req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword];

                    db.query(sqlquery, newrecord, (err, result) => {
                        if (err) {
                            return res.status(500).send('Internal Server Error');
                        } else {
                            result = 'Hello ' + req.sanitize(req.body.first) + ' ' + req.sanitize(req.body.last) + ' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email);
                            res.send(result);
                        }
                    });
                });
            });
        }
    }
);                                                                                                                                            
                                                                                                                                                      
app.post('/loggedin', function(req, res) {
    // Compare the form data with the data stored in the database
    let sqlquery = "SELECT hashedPassword FROM userdetails WHERE username = ?"; // query database to get the hashed password for the user
    // execute sql query
    let username = (req.sanitize(req.body.username));
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
        bcrypt.compare((req.sanitize(req.body.password)), hashedPassword, function(err, result) {
          if (err) {
            // Handle error
            return console.error(err.message);
          }
          else if (result == true) {
            // Save user session here, when login is successful
            req.session.userId = req.sanitize(req.body.username)
            // The passwords match, login successful
            res.send('Welcome, ' + (req.sanitize(req.body.username)) + '!' + '<a href='+'./'+'> Home</a>');


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
