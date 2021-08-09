var mongo = require('mongodb').MongoClient
const { DBTOKEN } = require('../config.json');
const emoji = require('node-emoji');

var url = DBTOKEN
var currentCalendar;
var discordDB = "STScalendar"
var weekdays = []
var workers = []

var mondayWorkers = [];
var tuesdayWorkers = [];
var wednesdayWorkers = [];
var thursdayWorkers = [];
var fridayWorkers = [];

var monday = "Monday";
var tuesday = "Tuesday";
var wednesday = "Wednesday";
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
        if (currentCalendar != "sts") {
            interaction.reply("Woops, you didn't type the right calendar, check if any addition spaces")
            return
        }
        interaction.reply(`opening up calendar: ${currentCalendar}`);

        mongo.connect(DBTOKEN, async function(err,db){
            if (err) throw err
            var dbo = db.db(discordDB); //will create new database if this one doesnt exist

            dbo.collection(`${currentCalendar}`).find({},{projection: {_id:0, dayOfWeek:1}}).toArray( async function(err,res){
        
                //if successful res gives us an array of objects, ex: {dayOfWeek: 'Monday'}
                for(var i = 0; i <5; i++){
                    
                    weekdays[i] = res[i].dayOfWeek   
                              
                }
                
                    
                console.log("\n!!!Reading names in calendarDatabase!!!")
                await dbo.collection(`${currentCalendar}`).find({dayOfWeek:weekdays[0]}, {projection: {_id:0, name:1}}).toArray(async function(err,res){
                        
                    if (err) throw err
                    console.log(`Monday: ${res[0].name}`)
                    mondayWorkers = res[0].name

                    await dbo.collection(`${currentCalendar}`).find({dayOfWeek:weekdays[1]}, {projection: {_id:0, name:1}}).toArray(async function(err,res){
                        
                        if (err) throw err
                        console.log(`Tuesday: ${res[0].name}`)
                        tuesdayWorkers = res[0].name

                        await dbo.collection(`${currentCalendar}`).find({dayOfWeek:weekdays[2]}, {projection: {_id:0, name:1}}).toArray(async function(err,res){
                        
                            if (err) throw err
                            console.log(`Wednesday: ${res[0].name}`)
                            wednesdayWorkers = res[0].name

                            await dbo.collection(`${currentCalendar}`).find({dayOfWeek:weekdays[3]}, {projection: {_id:0, name:1}}).toArray(async function(err,res){
                        
                                if (err) throw err
                                console.log(`Thursday: ${res[0].name}`)
                                thursdayWorkers = res[0].name

                                await dbo.collection(`${currentCalendar}`).find({dayOfWeek:weekdays[4]}, {projection: {_id:0, name:1}}).toArray(async function(err,res){
                        
                                    if (err) throw err
                                    console.log(`Friday: ${res[0].name}`)
                                    fridayWorkers = res[0].name

                                        
                                        mondayWorkers = mondayWorkers.join("\n")
                                        tuesdayWorkers = tuesdayWorkers.join("\n")
                                        wednesdayWorkers = wenesdayWorkers.join("\n")
                                        thursdayWorkers = thursdayWorkers.join("\n")
                                        fridayWorkers = fridayWorkers.join("\n")
                                        

                                        if(!mondayWorkers.length){
                                            mondayWorkers = "None"
                                        } 
                                        if (!tuesdayWorkers.length) {
                                            tuesdayWorkers = "None"
                                        }
                                        if (!wednesdayWorkers.length) {
                                            wenesdayWorkers = "None"
                                        }
                                        if (!thursdayWorkers.length) {
                                            thursdayWorkers = "None"
                                        }
                                        if(!fridayWorkers.length) {
                                            fridayWorkers = "None"
                                        }
                         

                                        
                                        var calendarEmbed = {
                                            color: 0x0099ff,
                                            title: `${emoji.get('calendar')} ${currentCalendar.toUpperCase()} Calendar`,
                                            thumbnail: {
                                                url: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052016/untitled-1_11.png?itok=ccxA07m1"
                                            },
                                            description:'Our Calendar for the 5 day week!',
                                            fields:[
                                                {name: monday,  value: mondayWorkers, inline: true},
                                                {name: tuesday, value:  tuesdayWorkers, inline: true},
                                                {name: wednesday, value:  wenesdayWorkers, inline: true},
                                                {name: thursday, value: thursdayWorkers, inline: true},
                                                {name: friday, value: fridayWorkers, inline: true}
                                                ],
                                            timestamp: new Date(),
                                               
                                        }
                                        interaction.channel.send({embed: calendarEmbed});
                                    

                                    
                                    db.close();
            
                                }); 
        
                            }); 
    
                        }); 

                    }); 

        
                }); 
                
                
                

               
            })
            
            
            
           
        })
        //If these variables are empty after deleting user, embed field value must be set to "None" to avoid null error
       

       
    }
    
}