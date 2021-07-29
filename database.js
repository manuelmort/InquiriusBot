var mongo = require('mongodb').MongoClient
var url = "mongodb+srv://bluerare:manuel09!@cluster0.4zhfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongo.connect(url,function(err,db){

    if(err) throw err;
    var dbo = db.db('STSdb'); //creates a database or connects to if it already exists

    dbo.collection("Week Schedule").insertOne(dayOfWeek, function(err,res){
        
        if(err) throw err
        console.log("1 document inserted")

        db.close();
    });
});


var dayOfWeek = {
    name: "Sunday",
    people: ["Manny", "James A", "James U"]
}