var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://tonyrenhk-nodejs-crm-6004823:27017";



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tests"); // test 
  //var query = { address: "Highway 37222" };
  
  dbo.collection("contents1").find().toArray(function(err, result) { // contents
    if (err) throw err;
    console.log(result);
    console.log('*********************');
    for(var i=0;i<result.length; i++){
        console.log(result[i]);
        console.log(result[i]._id);
    }
    db.close();
  });
});