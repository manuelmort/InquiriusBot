/*Calendar file created by Manuel Morteo 
contains commands:
    - create default calendar template, 
    - show calendars,   
    - opens a certain calendar, 
    - delete a calendar

*/
var mongo = require('mongodb').MongoClient
const { BOTTOKEN, DBTOKEN } = require('./config.json');
const { Client, Collection, Intents } = require('discord.js');
const emoji = require('node-emoji');
const fs = require('fs');

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
let prefix = '$';
var incomingCommand;

// create a new Discord client
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.GUILDS_MESSAGES] });
client.commands = new Collection();


client.once('ready', () => {
	console.log('Ready!')
});

client.on('message', async message => {
	
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.trim().split(' ');
	const userCommand = args.shift().toLowerCase(); 

    

    const commandFiles = fs.readdirSync('./stscommands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./stscommands/${file}`);
        // set a new item in the Collection
        // with the key as the command name and the value as the exported module
        if(command.name === userCommand){
            client.commands.set(command.name, command);

            if(args){
                command.argument = args.join()
            }            
        }

     }   
    if (!client.commands.has(userCommand)) return;

	try {
		await client.commands.get(userCommand).execute(message);
	} catch (error) {
		console.error(error);
		await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
    

});




function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



//Fold code if needed 
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	// Using the new `command` variable, this makes it easier to manage!
	// You can switch your other commands to this format as well
    const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

// MARK CREATE NEW CALENDAR TEMPLATE
    

//MARK SHOWING CALENDARS IN DATABASE USING AN EMBEDDED MESSAGE
    
    if(command === 'show-me-calendars'){

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
   /* else if (command === 'insert'){

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
    */


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