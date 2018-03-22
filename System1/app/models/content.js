// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var contentSchema = new mongoose.Schema({

    content            : {
        firstName: String,
        lastName: String
    }

});


// create the model for users and expose it to our app
module.exports = mongoose.model('content', contentSchema);
