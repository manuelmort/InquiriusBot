var testing = ""
module.exports = {
	
	name: "$ping",
	description: 'Replies with Pong!',
	argument: '',
	async execute(interaction) {
		await interaction.reply('Pong!');
		
	},
};