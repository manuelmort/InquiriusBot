var mongo = require('mongodb').MongoClient
var url = "mongodb+srv://bluerare:manuel09!@cluster0.4zhfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');

var currentCalendar = '';

var discordDB = 'STScalendar';
var weekdays = [];
var workers = [];

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

                
                dbo.collection(`${args}`).insertMany(newCalendar, function(err,res) {
                    if (err) throw err;
                    console.log("new document inserted!");
                    db.close();
                })

            })

        })
    
        //SHOWING CALENDARS IN DATABASE USING AN EMBEDDED MESSAGE
	} else if(command === 'show-me-calendars'){

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
            })
        })
    }
    //OPENS CALENDAR AND DISPLAYS UPDATED INFORMATION
     else if(command === 'open-up-calendar'){

        if (!args.length) {
			return message.channel.send(`You didn't provide any name, ${message.author}!`);
		}
        console.log(`${args}`);
        mongo.connect(url,function(err,db){
            if(err) throw err
            
            var dbo = db.db(discordDB)

            //Find all documents in the requested calendar
            dbo.collection(`${args}`).find({},{projection: {"_id":0, "dayOfWeek": 1}}).toArray(async function(err, result){
                if(err) throw err;
                

                for(var i = 0; i < 5; i++){
                    weekdays[i] = result[i].dayOfWeek 
                }
                console.log(result);

                var calendarEmbed = {
                    color: 0x0099ff,
                    title: `${args} Calendar`,
                    description:'Some random description',
                    fields:[
                        {name: weekdays[0],  value: "manny  nicj", inline: true},
                        {name: weekdays[1], value: "", inline: true},
                        {name: weekdays[2], value: "", inline: true},
                        {name: weekdays[3], value: "", inline: true},
                        {name: weekdays[4], value: "", inline: true}
                    ],
                    timestamp: new Date(),
                }
                //Have user update documents using commands to store into database.
                message.channel.send({embed: calendarEmbed});
                db.close();
            })
        })

    }
   
});




// login to Discord with your app's token

client.login('ODY3NTM0ODkxNTE0ODU1NDU1.YPig1A.-DjJA3ceeArcBeou3U9HuXlLncE')