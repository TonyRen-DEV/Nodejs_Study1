var content       = require('../app/models/content');
var MongoClient = require('mongodb').MongoClient;
var configDB2 = require('../config/database.js');


module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, QueryContentData,function(req, res) {
        console.log('now resultList');
        //console.log(req.resultList);
        res.render('profile.ejs', {
            user : req.user,
            showList: req.resultList
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

   
   
   
   
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

   
   
   
   
// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

  // @tony saving data into data base
    app.post('/submitData', SavingContecnt);



};


function QueryContentData(req, res, next){
    console.log('enter QueryContentData');
        
    MongoClient.connect(configDB2.url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      //var query = { address: "Highway 37222" };
      
      dbo.collection("contents").find().toArray(function(err, result) {
        if (err){
            throw err;
            return next();
        }
        //console.log(result);
        console.log('*********************');
        for(var i=0;i<result.length; i++){
            console.log(result[i]);
            console.log(result[i]._id);
        }
        
        console.log('*********End************');
        req.resultList = result;
        db.close();
        return next();
      });
    });



    
    
}



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


function SavingContecnt(req, res, next) {
    console.log('enter SavingContecnt ');
    console.log(req.body.firstName);
    console.log(req.body.lastName);
    
    
    var myData = new content(); // req.body
    //changing data into new Object 
    myData.content.firstName=req.body.firstName;
    myData.content.lastName= req.body.lastName;
    
    
    myData.save().then(item => {
        console.log('successfully');
        console.log(item._id);
        
        //res.send("item saved to database");
        res.redirect('/');
    }).catch(err => {
        res.status(400).send("unable to save to database");
    });
 
 
    console.log('** Finished SavingContecnt ** ');
    
    
    
}