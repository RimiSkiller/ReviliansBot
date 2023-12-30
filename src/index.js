require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { connect } = require('mongoose');

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.GuildModeration,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates,
	],
});

client.wait = require('node:timers/promises').setTimeout;

(async () => {
	try {
		await connect(process.env.MONGO).then(() => console.log('☑️  - Logged in to database.'));
		require('./handlers/eventHandler')(client);
		require('./handlers/logHandler')(client);
		client.login(process.env.TOKEN);
	}
	catch (error) {
		console.log(error);
	}
})();

process.on('uncaughtException', e => {
	console.error(e);
});