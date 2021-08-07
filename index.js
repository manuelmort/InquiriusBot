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


//MAKE SURE stscommands only makes sts calendar and nothing else
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




// login to Discord with your app's token

client.login(BOTTOKEN);