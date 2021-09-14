var mongo = require('mongodb').MongoClient
const { DBTOKEN } = require('../config.json');

var url = DBTOKEN;
var discordDB = 'STScalendar';
var deleteCalendar = ""

module.exports = {
    name: "$delete-calendar",
    description: "deletes sts calendar to start fresh again",
    arguments: '',
    async execute(interaction) {
        if (!this.argument) {
			return interaction.channel.send(`You didn't provide any name, ${interaction.author}!`);
		} else{
            deleteCalendar = this.argument
            console.log(deleteCalendar)
        }

        mongo.connect(url, async function(err,db){
            if (err) throw err
            var dbo = db.db(discordDB);
            dbo.dropCollection(`${deleteCalendar}`, async function(err, delOK){
                if (err) {
                    return interaction.reply("Either calendar is not sts or there isn't a created a sts calendar, what the hell are you doing")
                    
                }
                if (delOK) console.log("Calendar Deleted!");
                
                interaction.channel.send(`${deleteCalendar} calendar deleted!`)
                db.close();
            })

        })
    }

}