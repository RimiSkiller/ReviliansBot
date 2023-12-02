require('dotenv/config');
const { mainserver } = require('./configs/config.json');
const { ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes, PermissionsBitField } = require('discord.js');

const commandsDataMain = [
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
	new ContextMenuCommandBuilder()
		.setName('Reroll Giveaway')
		.setDMPermission(false)
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEvents),
	new ContextMenuCommandBuilder()
		.setName('End Giveaway')
		.setDMPermission(false)
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEvents),
];
const commandsDataStaff = [
	new ContextMenuCommandBuilder()
		.setName('Reroll Giveaway')
		.setDMPermission(false)
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEvents),
	new ContextMenuCommandBuilder()
		.setName('End Giveaway')
		.setDMPermission(false)
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEvents),
	new ContextMenuCommandBuilder()
		.setName('Attendance Time')
		.setDMPermission(false)
		.setType(ApplicationCommandType.User)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
];

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Registering Context Commands.');
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, mainserver),
			{ body: commandsDataMain },
		);
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, '1074476503431139438'),
			{ body: commandsDataStaff },
		);
	}
	catch (error) {
		console.error(error);
	}
})();