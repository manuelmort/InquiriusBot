var mongo = require('mongodb').MongoClient
const { DBTOKEN } = require('../config.json');
const { Client, Collection, Intents } = require('discord.js');
const emoji = require('node-emoji');

var url = DBTOKEN
var currentCalendar;
var discordDB = "STScalendar"
var weekdays = []
var workers = []

var mondayWorkers = "None";
var tuesdayWorkers = "None";
var wenesdayWorkers = "None";
var thursdayWorkers = "None";
var fridayWorkers = "None";

var monday = "Monday";
var tuesday = "Tuesday";
var wenesday = "Wenesday";
var thursday = "Thursday";
var friday = "Friday";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    name: "$open-calendar", //takes in an argument
    description: "opens up a calendar if it exists",
    argument: '',
    async execute(interaction) {
		if (!this.argument) {
			return interaction.reply("You didn't provide any calendar name");
        }

        currentCalendar = this.argument;
        interaction.reply(`opening up calendar: ${currentCalendar}`);

        mongo.connect(DBTOKEN, async function(err,db){
            if (err) throw err
            var dbo = db.db(discordDB); //will create new database if this one doesnt exist

            dbo.collection(`${currentCalendar}`).find({},{projection: {_id:0, dayOfWeek:1}}).toArray( async function(err,res){
        
                //if successful res gives us an array of objects, ex: {dayOfWeek: 'Monday'}
                for(var i = 0; i <5; i++){
                    
                    weekdays[i] = res[i].dayOfWeek               
                }
               
                

            })
            var object = {dayOfWeek:weekdays[0]}
            await dbo.collection(`${currentCalendar}`).find(object, {projection: {_id:0, name:1}}).toArray(async function(err,res){
                console.log(res)
            })
        })
        //If these variables are empty after deleting user, embed field value must be set to "None" to avoid null error
        if(mondayWorkers === "" || mondayWorkers === " "){
            mondayWorkers = "None"
        } else if (tuesdayWorkers === "" || tuesdayWorkers === " ") {
            tuesdayWorkers = "None"
        } else if (wenesdayWorkers === ""|| wenesdayWorkers === " ") {
            wenesdayWorkers = "None"
        }else if (thursdayWorkers === "" || thursdayWorkers === " ") {
            thursdayWorkers = "None"
        }else if(fridayWorkers === "" || fridayWorkers === " ") {
            fridayWorkers = "None"
        }


        var calendarEmbed = {
            color: 0x0099ff,
            title: `${emoji.get('calendar')} ${this.argument} Calendar`,
            thumbnail: {
                url: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052016/untitled-1_11.png?itok=ccxA07m1"
            },
            description:'Our Calendar for the 5 day week!',
            fields:[
                {name: monday,  value: mondayWorkers, inline: true},
                {name: tuesday, value:  tuesdayWorkers, inline: true},
                {name: wenesday, value:  wenesdayWorkers, inline: true},
                {name: thursday, value: thursdayWorkers, inline: true},
                {name: friday, value: fridayWorkers, inline: true}
                ],
            timestamp: new Date(),
               
        }
        interaction.channel.send({embed: calendarEmbed});

    }
}