var mongo = require('mongodb').MongoClient
const { DBTOKEN } = require('../config.json');

var url = DBTOKEN;
var discordDB = 'STScalendar';
var currentCalendar = ""

/*function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
*/

module.exports = {
    name: "$insert", //command takes an arguement
    description: "inserting",
    argument: '',
    async execute(interaction){
        if (!this.argument) {
			return interaction.reply("You didn't provide a name and calendar name");
        }
        let userInsert = `${this.argument}`.split(",");

        currentCalendar = 'sts'
        var object =  {dayOfWeek: userInsert[1]}
        

        mongo.connect(url, async function(err,db){ 
            if(err) throw err;

            var dbo = db.db(discordDB);

            dbo.collection(currentCalendar).findOneAndUpdate(object,{$push:{name:userInsert[0]}}, function (err,res){
                if (err) throw err;

                interaction.channel.send("Name inserted!")
                db.close()
                  
                

            })
            
        })
    }   
}