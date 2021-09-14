var mongo = require('mongodb').MongoClient
const { DBTOKEN } = require('../config.json');

var url = DBTOKEN;
var discordDB = 'STScalendar';
var currentCalendar = ""

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function removeWhiteSpaceFromArray(array){
    return array.filter((item) => item != '');
}

module.exports = {
    name: "$insert", //command takes an arguement
    description: "inserting",
    argument: '',
    async execute(interaction){
        if (!this.argument) {
			return interaction.reply("You didn't provide a name and calendar name");
        }
        var userInsert = `${this.argument}`.split(",")
        
        
        //failSafing for any non capatalized first letters and whitespaces
        userInsert = removeWhiteSpaceFromArray(userInsert)  
        
        userInsert[0] = capitalizeFirstLetter(userInsert[0]);
        userInsert[1] = capitalizeFirstLetter(userInsert[1]);

        currentCalendar = 'sts'
        var object =  {dayOfWeek: userInsert[1]}
        

        mongo.connect(url, async function(err,db){ 
            if(err) throw err;

            var dbo = db.db(discordDB);

            dbo.collection(currentCalendar).findOneAndUpdate(object,{$push:{name:userInsert[0]}}, function (err,res){
                if (err) throw err;

                console.log("A name was inserted")

                interaction.channel.send("Name inserted!")
                db.close()
                  
                

            })
            
        })
    }   
}