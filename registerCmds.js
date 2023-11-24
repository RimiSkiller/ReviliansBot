require('dotenv/config');
const { mainserver } = require('./config.json');
const { ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes, PermissionsBitField } = require('discord.js');

const commandsData = [
	new ContextMenuCommandBuilder()
		.setName('Accept Suggestion')
		.setDMPermission(false)
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
	new ContextMenuCommandBuilder()
		.setName('Reject Suggestion')
		.setDMPermission(false)
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
	new ContextMenuCommandBuilder()
		.setName('Mute Member (proof)')
		.setDMPermission(false)
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
	new ContextMenuCommandBuilder()
		.setName('Mute Member')
		.setDMPermission(false)
		.setType(ApplicationCommandType.User)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
	new ContextMenuCommandBuilder()
		.setName('Unmute Member')
		.setDMPermission(false)
		.setType(ApplicationCommandType.User)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
];

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Registering Context Commands.');
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, mainserver),
			{ body: commandsData },
		);
	}
	catch (error) {
		console.error(error);
	}
})();