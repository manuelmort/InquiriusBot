var mongo = require('mongodb').MongoClient
const { DBTOKEN } = require('../config.json');


var url = DBTOKEN;
var discordDB = 'STScalendar';
var currentCalendar = ""

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function removeWhiteSpaceFromArray(array){
    return array.filter((item) => item != '');
}

module.exports = {
    name: "$delete",
    description: "",
    argument: '',
    async execute(interaction){
        if (!this.argument) {
			return interaction.reply("You didn't provide a name and calendar name");
        }
        let userInsert = `${this.argument}`.split(",");

        //failSafing for any non capatalized first letters and whitespaces
        userInsert = removeWhiteSpaceFromArray(userInsert)  
        
        userInsert[0] = capitalizeFirstLetter(userInsert[0]);
        userInsert[1] = capitalizeFirstLetter(userInsert[1]);

        currentCalendar = 'sts'
        
        var object =  {dayOfWeek: userInsert[1]}

        mongo.connect(url, async function(err,db){ 
            if(err) throw err;

            var dbo = db.db(discordDB);

            dbo.collection(currentCalendar).findOneAndUpdate(object,{$pull:{name:userInsert[0]}}, function (err,res){
                if (err) throw err;

                const index = res.value.name.indexOf(userInsert[0])

                if (index > -1) {
                    //Test the splice, make sure it removes all strings with the same name
                    res.value.name.splice(index,1)
                }

                console.log("A name was deleted")
                interaction.channel.send("Name deleted!")
                db.close()
                  
                

            })
            
        })
    } 

}