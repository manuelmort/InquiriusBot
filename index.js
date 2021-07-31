/*Calendar file created by Manuel Morteo 
contains commands:
    - create default calendar template, 
    - show calendars,   
    - opens a certain calendar, 
    - delete a calendar

*/
var mongo = require('mongodb').MongoClient
var url = "mongodb+srv://bluerare:manuel09!@cluster0.4zhfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');

var currentCalendar = ''
var discordDB = 'STScalendar'
var weekdays = []
var insertWorker = ''
var workers = []

// create a new Discord client
const client = new Discord.Client()

let prefix = '$'

client.once('ready', () => {
	console.log('Ready!')
});


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
                    console.log("collection already created...")
                    return;
                }
                

                message.channel.send("Calendar created in database!");
                currentCalendar = `${args}`

                dbo.collection(`${args}`).insertMany(newCalendar, async function(err,res) {
                    if (err) throw err;
                    console.log("new document inserted!");
                    
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


//OPENS A CERTAIN CALENDAR AND DISPLAYS UPDATED INFORMATION
     else if(command === 'open-up-calendar'){

        if (!args.length) {
			return message.channel.send(`You didn't provide any name, ${message.author}!`);
		}
        currentCalendar = args
        message.channel.send(`opening up calendar: ${currentCalendar}`);
        
        var calendarEmbed = {
            color: 0x0099ff,
            title: `${args} Calendar`,
            description:'Some random description',
            fields:[
                {name: weekdays[0],  value: "Manny", inline: true},
                {name: weekdays[1], value: "James", inline: true},
                {name: weekdays[2], value: "Soemthing", inline: true},
                {name: weekdays[3], value: "Random", inline: true},
                {name: weekdays[4], value: "anther Random", inline: true}
                ],
            timestamp: new Date(),
        }
        message.channel.send({embed: calendarEmbed});      

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
//INSERTING USER NAME AND DAY OF WORK
    else if (command === 'insert'){

        if (!args.length) {
			return message.channel.send(`You didn't provide your name, ${message.author}!`);
		}
        let userInsert = `${args}`.split(",");

        var object =  {dayOfWeek: userInsert[1], name: userInsert[0]}
        

        mongo.connect(url, async function(err,db){
            if(err) throw err;

            var dbo = db.db(discordDB);

            

            dbo.collection(`${currentCalendar}`).insertOne(object, function (err,res){
                if (err) throw err;

                message.channel.send("Name inserted!")
                db.close()
            })
            
        }
    )}
   
})




// login to Discord with your app's token

client.login('ODY3NTM0ODkxNTE0ODU1NDU1.YPig1A.m5VMcKVyjofwg20ZPBi9qVx83xk');