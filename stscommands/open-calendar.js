var mongo = require('mongodb').MongoClient
const { BOTTOKEN, DBTOKEN, WEATHERTOKEN } = require('../config.json');
const fetch = require('node-fetch')
const emoji = require('node-emoji');

var url = DBTOKEN
var currentCalendar;
var discordDB = "STScalendar"
var weekdays = []
var workers = []
var zipcode = 95608

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
var currentDay = ""

var stslocation = ""
var forecast = ""
var currentTemp = ""
var weatherDesc = ""
var highTemp = ""
var lowTemp = ""

var weatherapi = WEATHERTOKEN
var weatherEmoji = ""

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCurrentDate() {
    const week = ["Sunday", "Monday", "Tuesday","Wednesday","Thursday", "Friday","Saturday"]

    var dayElement = new Date()

    currentDay = week[dayElement.getDay()]
    
    return currentDay

}

getCurrentDate();

//Weather feature for embedded message
fetch(weatherapi)
    .then(response => {
        return response.json()
    })
    .then(parsedWeather => {
        if(parsedWeather.cod === '404'){
            console.log("Something went wrong")
        } else {

            stslocation = ` ${parsedWeather.name}`
            forecast = ` ${parsedWeather.weather[0].main}`
            currentTemp = ` ${(Math.round(((parsedWeather.main.temp - 273.15) * 9/5 +32 )))} °F`
            highTemp = ` ${(Math.round(((parsedWeather.main.temp_max - 273.15) * 9/5 +32 )))} °F`
            lowTemp = ` ${(Math.round(((parsedWeather.main.temp_min - 273.15) * 9/5 +32 )))} °F`


            
        }
    })


//getting weather emoji
function getWeatherEmoji(emoj){
    
    if("Clouds"){
        weatherDesc = "Cloudy!"
        return emoji.get('sun_behind_cloud')

    }else if ("Rain"){
        weatherDesc = "Gonna Rain"
        return emoji.get("rain_cloud")
        
    }else if ("Thunderstorm"){

        weatherDesc = "It's Thor Day!"
        return emoji.get("lightning")
    }
    else if ("Snow"){

        weatherDesc = "Snowy"
        return emoji.get("snow_cloud")
    }
    else if ("Fog") {

        weatherDesc = "Foggy!"
        return emoji.get("fog")
    }
    else {
        weatherDesc = "Sunny"
        return emoji.get('mostly_sunny')
            
    }
}

weatherEmoji = getWeatherEmoji(forecast)


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
                                        wednesdayWorkers = wednesdayWorkers.join("\n")
                                        thursdayWorkers = thursdayWorkers.join("\n")
                                        fridayWorkers = fridayWorkers.join("\n")
                                        

                                        if(!mondayWorkers.length){
                                            mondayWorkers = "None"
                                        } 
                                        if (!tuesdayWorkers.length) {
                                            tuesdayWorkers = "None"
                                        }
                                        if (!wednesdayWorkers.length) {
                                            wednesdayWorkers = "None"
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
                                                {name: "Location", value: "Carmichael", inline: true},
                                                {name: "Today", value: currentDay, inline: true},
                                                {name: "Weather Today!", value: `${weatherEmoji}` + weatherDesc + "  "+ `  CurrentTemp: ${emoji.get('thermometer')} `
                                                + currentTemp
                                                +"  "+ `${emoji.get('arrow_up')}` + highTemp + `${emoji.get('arrow_down')}`+ lowTemp},
                                                {name: monday,  value: mondayWorkers, inline: true},
                                                {name: tuesday, value:  tuesdayWorkers, inline: true},
                                                {name: wednesday, value:  wednesdayWorkers, inline: true},
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