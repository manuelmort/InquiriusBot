var mongo = require('mongodb').MongoClient
const { DBTOKEN } = require('../config.json');

var discordDB = 'STScalendar'
var newCalendar = ""

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
        dayOfWeek: "Wednesday",
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
			return interaction.channel.send(`You didn't provide any name, ${interaction.author.id}!`);
		}
        //ONLY USE THIS CODE IF YOU HAVE TO
        /*if(!interaction.author.id === 224051554582396929) {
            
            interaction.channel.send("Sorry you do not have permission to use this command")
        }
        */
        
        else{
            newCalendar = this.argument
        }

        if (newCalendar != "sts"){
            interaction.reply("you didn't create a calendar under the name 'sts' \n check if there are any addition spaces")
            return
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