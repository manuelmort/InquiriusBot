var mongo = require('mongodb').MongoClient
const { BOTTOKEN, DBTOKEN } = require('../config.json');
const { Client, Collection, Intents } = require('discord.js');
const emoji = require('node-emoji');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var discordDB = 'STScalendar'
var weekDays=[]

var STScalendarTemplate = [
    {
        id:1,
        dayOfWeek: "Monday",
        name: []
        
    },
    {
        id:2,
        dayOfWeek: "Tuesday",
        name: []
    },
    {
        id:3,
        dayOfWeek: "Wenesday",
        name: []
    },
    {
        id:4,
        dayOfWeek: "Thursday",
        name: []
    },
    {
        id:5,
        dayOfWeek: "Friday",
        name: []
    }
];



module.exports = {
	
	name: "$create-calendar",
	description: 'creating in database',
	argument: '',
    createdCalendar:"",
    weekdays: [''],
	async execute(interaction) {
		if (!this.argument) {
			return message.channel.send(`You didn't provide any name, ${message.author}!`);
		} else{
            newCalendar = this.argument
            console.log(newCalendar)
        }

  
		interaction.reply(`Checking if calendar " ${newCalendar} " doesn't already exist....`);

        mongo.connect(DBTOKEN, async function(err,db){
            if(err) throw err;

            var dbo = db.db(discordDB); //will create new database if this one doesnt exist
            dbo.createCollection(`${newCalendar}`, function(err,res){
                if(err){
                    
                    interaction.reply("Sorry there is already a calendar that exists!")
                    console.log("calendar already created...")
                    return;
                }
                

                interaction.reply("Calendar created in database!");
                interaction.reply("To access calendar, just say ```$open-up-calender <calendar name>```")

                this.createdCalendar = `${newCalendar}`

                dbo.collection(`${newCalendar}`).insertMany(STScalendarTemplate, async function(err,res) {
                    if (err) throw err;
                    console.log("new default template inserted!");
                    
                    dbo.collection(`${newCalendar}`).find({},{projection: {"_id":0, "dayOfWeek": 1}}).toArray(async function(err, result){
                        if(err) throw err
        
                        for(var i = 0; i < 5; i++){
                            module.exports.weekdays = result[i].dayOfWeek //getting error here                           
                        } 
                        
                        db.close();
                        
                    })
                })
            })
        })
    }

		
}