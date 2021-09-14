const { Client, Guild, Message } = require("discord.js");
const { execute } = require("./insert");
const emoji = require('node-emoji');


var roleMembers= []
var roleCount;
var roleName;

var CSCid = "496507412300300288";
var CPEid = "496507414636527619";
var EEEid = "496507417857753088";
var CEid = "496507416335351808";
var MEid = "496507417442648064";
var MISid = "406147718218776578";
var CMid = "614262956212879383";

var CSCmembers, CSCcount;
var CPEmembers, CPEcount;
var EEEmembers, EEEcount;
var CEmembers, CEcount;
var MEmembers, MEcount;
var MISmembers, MIScount;
var CMmembers, CMcount;

var serverCountEmbed;

var computerEmoji = emoji.get('computer')

console.log(computerEmoji)

module.exports = {
    name: "$server-count",
    description: "Will count every member in the server",

    async execute(interaction) {
        
        //update this once deployed to vespa
        let vespaGuild = interaction.guild.id
        let memberCount = interaction.guild.memberCount;
        console.log(`Amount of people in Server ${memberCount}`)

        interaction.guild.members.fetch().then(members => {
            CSCmembers = interaction.guild.roles.cache.get(CSCid).members.map(m=>m.user.tag)
            CSCcount = CSCmembers.length

            CPEmembers = interaction.guild.roles.cache.get(CPEid).members.map(m=>m.user.tag)
            CPEcount = CPEmembers.length

            EEEmembers = interaction.guild.roles.cache.get(EEEid).members.map(m=>m.user.tag)
            EEEcount = EEEmembers.length

            MEmembers = interaction.guild.roles.cache.get(MEid).members.map(m=>m.user.tag)
            MEcount = MEmembers.length

            CEmembers = interaction.guild.roles.cache.get(CEid).members.map(m=>m.user.tag)
            CEcount = CEmembers.length

            MISmembers = interaction.guild.roles.cache.get(MISid).members.map(m=>m.user.tag)
            MIScount = MISmembers.length

            CMmembers = interaction.guild.roles.cache.get(CMid).members.map(m=>m.user.tag)
            CMcount = CMmembers.length

            console.log(`Amount of CSC students: ${CSCcount}`)
            console.log(`Amount of CPE students: ${CPEcount}`)
            console.log(`Amount of EEE students: ${EEEcount}`)
            console.log(`Amount of ME students: ${MEcount}`)
            console.log(`Amount of CE students: ${CEcount}`)
            console.log(`Amount of MIS students: ${MIScount}`)
            console.log(`Amount of CM students: ${CMcount}`)


            //Sending Information on a Code block (embedded messages for some reason wont work)
            var msg = "```"
            +"TOTAL SERVER COUNT: " + memberCount + "\n\n"
            +"CSC Students: "+ CSCcount+  "\n" 
            +"CPE Students: "+ CPEcount + "\n"
            +"EEE Students: "+ EEEcount + "\n"
            +"ME Students: "+ MEcount + "\n"
            +"CE Students: "+ CEcount + "\n"
            +"CM Students: "+ CMcount + "\n"
            +"MIS Students: "+ MIScount + "\n"
            +"```\n" ;

            interaction.channel.send(msg)

        })
            
        
    }
}

