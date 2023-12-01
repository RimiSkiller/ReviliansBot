const TRoles = require('../../models/temproles');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (client, member) => {
	if (member.guild.id != client.mainServer.id) return;
	const data = await TRoles.find({ member: member.id });
	data.forEach(async role => {
		if (!await client.mainServer.roles.fetch(role.role)) return await role.deleteOne();
		await member.roles.add(role.role).then(u => client.log(`**● Automatic:**\`\`\`diff\n+ Restored the roles to member "${u.user.username}" (${u.id})\`\`\``)).catch(() => null);
		await role.deleteOne();
	});
};