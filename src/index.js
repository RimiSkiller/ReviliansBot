require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const { connect } = require('mongoose');

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
	],
});

(async () => {
	try {
		await connect(process.env.MONGO).then(() => console.log('☑️  - Logged in to database.'));
		eventHandler(client);
		client.login(process.env.TOKEN);
	}
	catch (error) {
		console.log(error);
	}
})();

process.on('uncaughtException', e => {
	console.error(e);
});