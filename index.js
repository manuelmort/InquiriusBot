/*Calendar file created by Manuel Morteo 
contains commands:
    - create default calendar template, 
    - show calendars,   
    - opens a certain calendar, 
    - delete a calendar

*/
var mongo = require('mongodb').MongoClient
const { BOTTOKEN, DBTOKEN } = require('./config.json');
const Discord = require('discord.js');
const emoji = require('node-emoji');

var url = DBTOKEN
var currentCalendar = ''
var discordDB = 'STScalendar'
var weekdays = []
var insertWorker = ''
var workers = []
var insertWeekday = ''
var mondayWorkers = ["None"]
var tuesdayWorkers = ["None"]
var wenesdayWorkers = ["None"]
var thursdayWorkers = ["None"]
var fridayWorkers = ["None"]

// create a new Discord client
const client = new Discord.Client()

let prefix = '$'

client.once('ready', () => {
	console.log('Ready!')
});
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//This will create a default empty calendar
var newCalendar = [
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



//Fold code if needed 
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	// Using the new `command` variable, this makes it easier to manage!
	// You can switch your other commands to this format as well
	if (command === 'ping') {
		message.channel.send('Pong.');

	} 

// MARK CREATE NEW CALENDAR TEMPLATE
    else if (command === 'create-calendar') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any name, ${message.author}!`);
		}
    
        
		message.channel.send(`Checking if calendar " ${args} " doesn't already exist....`);

        mongo.connect(url, async function(err,db){
            if(err) throw err;

            var dbo = db.db(discordDB); //will create new database if this one doesnt exist
            dbo.createCollection(`${args}`, function(err,res){
                if(err){
                    
                    message.channel.send("Sorry there is already a calendar that exists!")
                    console.log("calendar already created...")
                    return;
                }
                

                message.channel.send("Calendar created in database!");
                message.channel.send("To access calendar, just say ```$open-up-calender <calendar name>```")

                currentCalendar = `${args}`

                dbo.collection(`${args}`).insertMany(newCalendar, async function(err,res) {
                    if (err) throw err;
                    console.log("new default template inserted!");
                    
                    dbo.collection(`${args}`).find({},{projection: {"_id":0, "dayOfWeek": 1}}).toArray(async function(err, result){
                        if(err) throw err;
        
                        for(var i = 0; i < 5; i++){
                            weekdays[i] = result[i].dayOfWeek
                        } 
                        db.close();
                        
                    })
                })
            })
        })
    }

//MARK SHOWING CALENDARS IN DATABASE USING AN EMBEDDED MESSAGE
    
    else if(command === 'show-me-calendars'){

        mongo.connect(url, async function(err,db){
            if(err) throw err;

            var dbo = db.db(discordDB);

            dbo.listCollections().toArray(function(err,names){
                if(!err){
                    var coll = names;  
                    var collArray = []
                    for(var i = 0; i < coll.length; i++){

                        console.log(coll[i].name);

                        collArray[i] = coll[i].name
                        console.log(collArray[i])
                        

                    }
                    var listCollectionsEmbed = new Discord.MessageEmbed()
                        .setTitle("CALENDARS")
                        .setDescription("list of calendars in database")
                        .setColor('#0099ff')
                        .addFields({name: "name:", value: collArray})
                        .setTimestamp()

                    message.channel.send(listCollectionsEmbed)


                } else{
                    throw err
                }
                db.close();
            });
        });
    }


//OPENS A CERTAIN CALENDAR AND READS AND DISPLAYS UPDATED INFORMATION
     else if(command === 'open-up-calendar'){

        if (!args.length) {
			return message.channel.send(`You didn't provide any name, ${message.author}!`);
		}
        currentCalendar = args
        message.channel.send(`opening up calendar: ${currentCalendar}`);

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
            title: `${emoji.get('calendar')} ${args} Calendar`,
            thumbnail: {
                url: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052016/untitled-1_11.png?itok=ccxA07m1"
            },
            description:'Our Calendar for the 5 day week!',
            fields:[
                {name: weekdays[0],  value: mondayWorkers, inline: true},
                {name: weekdays[1], value:  tuesdayWorkers, inline: true},
                {name: weekdays[2], value:  wenesdayWorkers, inline: true},
                {name: weekdays[3], value: thursdayWorkers, inline: true},
                {name: weekdays[4], value: fridayWorkers, inline: true}
                ],
            timestamp: new Date(),
        }
        message.channel.send({embed: calendarEmbed});
        message.channel.send('To insert a name on a specific day, say: ```$insert <Your First Name> <Day of the Week>``` ')      
        message.channel.send('To delete your name on a specific day, say: ```$delete <Your First Name> <Day of the Week>``` ')  

    }


//DELETES A CERTAIN CALENDAR
    else if(command === 'delete-calendar'){
        if (!args.length) {
			return message.channel.send(`You didn't provide any calendar name to delete, ${message.author}!`);
		}
        mongo.connect(url, async function(err,db){
            if (err) throw err

            var dbo = db.db(discordDB);

            dbo.dropCollection(`${args}`, async function(err, delOK){
                if (err) throw err
                if (delOK) console.log("Calendar Deleted!");
                
                message.channel.send(`${args} calendar deleted!`)

                db.close();
            })

        })
    }

//INSERTING USER NAME FROM DAY OF WORK (Still needs a way to display in embedded msg)
    else if (command === 'insert'){

        if (!args.length) {
			return message.channel.send(`You didn't provide your name, ${message.author}!`);
		}
        let userInsert = `${args}`.split(",");
        userInsert[1] = capitalizeFirstLetter(userInsert[1]);

        var object =  {dayOfWeek: userInsert[1]}

        mongo.connect(url, async function(err,db){ 
            if(err) throw err;

            var dbo = db.db(discordDB);

            dbo.collection(`${currentCalendar}`).findOneAndUpdate(object,{$push:{name:userInsert[0]}}, function (err,res){
                if (err) throw err;

                dbo.collection(`${currentCalendar}`).find({dayOfWeek:userInsert[1]},{ projection: {_id:0, name:1}}).toArray(async function(err, result){
                    if(err) throw err;

                    workers = result[0].name.join()
                    
                    insertWeekday = userInsert[1]

                    if (userInsert[1] === "Monday" || userInsert[1] === "monday"){
                        mondayWorkers = workers
                    } else if(userInsert[1] === "Tuesday" || userInsert[1] === "tuesday") {
                        tuesdayWorkers = workers
                    } else if (userInsert[1] === "Wenesday"|| userInsert[1] === "wenesday"){
                        wenesdayWorkers = workers
                    } else if (userInsert[1] === "Thursday"|| userInsert[1] === "thursday") {
                        thursdayWorkers = workers
                    } else if (userInsert[1] === "Friday"|| userInsert[1] === "friday") {
                        fridayWorkers = workers
                    }

                    message.channel.send("Name inserted!")
                    db.close()

                    
                })

            })
            
        }
    )}


//DELETING USER NAME FROM DAY OF WORK (Still needs a way to display in embedded msg)
    else if(command === 'delete'){

        if (!args.length) {
			return message.channel.send(`You didn't provide your name, ${message.author}!`);
		}
        let userInsert = `${args}`.split(",");

        var object =  {dayOfWeek: userInsert[1]}

        
        mongo.connect(url, async function(err,db){ 
            if(err) throw err;

            var dbo = db.db(discordDB);

            dbo.collection(`${currentCalendar}`).findOneAndUpdate(object,{$pull:{name:userInsert[0]}}, function (err,result){
                if (err) throw err;

                console.log(result.value.name)
                
                if(userInsert[1] === "Monday" || userInsert[1] === "monday"){
                    
                    const index = result.value.name.indexOf(userInsert[0])

                    if (index > -1) {
                        //Test the splice, make sure it removes all strings with the same name
                        result.value.name.splice(index,1)
                    }
                    workers = result.value.name.join()
                    mondayWorkers = workers


                } else if(userInsert[1] === "Tuesday" || userInsert[1] === "tuesday"){
                    const index = result.value.name.indexOf(userInsert[0])

                    if (index > -1) {
                        //Test the splice, make sure it removes all strings with the same name
                        result.value.name.splice(index,1)
                    }
                    workers = result.value.name.join()
                    tuesdayWorkers = workers


                } else if(userInsert[1] === "Wenesday"|| userInsert[1] === "wenesday"){
                    const index = result.value.name.indexOf(userInsert[0])

                    if (index > -1) {
                        //Test the splice, make sure it removes all strings with the same name
                        result.value.name.splice(index,1)
                    }

                    workers = result.value.name.join()
                    wenesdayWorkers = workers


                } else if(userInsert[1] === "Thursday"|| userInsert[1] === "thursday"){
                    const index = result.value.name.indexOf(userInsert[0])

                    if (index > -1) {
                        //Test the splice, make sure it removes all strings with the same name
                        result.value.name.splice(index,1)
                    }

                    workers = result.value.name.join()
                    thursdayWorkers = workers


                } else if(userInsert[1] === "Friday"|| userInsert[1] === "friday"){
                    const index = result.value.name.indexOf(userInsert[0])

                    if (index > -1) {
                        //Test the splice, make sure it removes all strings with the same name
                        result.value.name.splice(index,1)
                    }
                    workers = result.value.name.join()
                    fridayWorkers = workers


                }
                console.log(mondayWorkers)

                message.channel.send(`Name deleted from ${userInsert[1]}!`)
                db.close()
            })
            
        }
    )}
   
})




// login to Discord with your app's token

client.login(BOTTOKEN);