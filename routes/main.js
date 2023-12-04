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
    app.get('/addbook', function (req,res) {
        res.render('addbook.ejs', shopData);
    });                                                                                                                                               
    app.get('/list', function(req, res) {
        // Query database to get all the books
        let sqlquery = "SELECT * FROM books";
                                                                                                                                                      
        // Execute sql query
        db.query(sqlquery, (err, result) => {                                                                                                         
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)                                                                                                                      
            res.render("list.ejs", newData)
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


    app.post('/registered', function (req,res) {
        // Saving data in database
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);
	const bcrypt = require('bcrypt');
	const saltRounds = 10;
	const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
    });

        let sqlquery = "INSERT INTO userdetails (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
           // execute sql query
           let newrecord = [req.body.username, req.body.first_name, req.body.last_name, req.body.email, req.body.hashedPassword];
           db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              return console.error(err.message);
            }
            else
            result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
            res.send(result);
        });
    })                                                                                                                                               
                                                                                                                                                      
    app.post('/bookadded', function (req,res) {
          // saving data in database
          let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
          // execute sql query
          let newrecord = [req.body.name, req.body.price];
          db.query(sqlquery, newrecord, (err, result) => {                                                                                            
            if (err) {
              return console.error(err.message);
            }
            else
            res.send(' This book is added to the database, name: '+ req.body.name
+ ' price '+ req.body.price);
            });                                                                                                                                       
       });                                                                                                                                            
}
