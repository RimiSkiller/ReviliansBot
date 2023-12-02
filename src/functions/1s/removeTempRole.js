const TRoles = require('../../models/temproles');
const { mainlog } = require('../../../configs/config.json');
/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const roles = await TRoles.where('time').lte(Date.now());
	roles.forEach(async role => {
		const member = await client.mainServer.members.fetch(role.member);
		if (!member) return await role.deleteOne();
		const roleName = (await client.mainServer.roles.fetch(role.role))?.name;
		if (!roleName) return await role.deleteOne();
		await member.roles.remove(role.role).then(u => client.channels.cache.get(mainlog).send(`**● Automatic:**\`\`\`diff\n- Removed temp-role [${roleName}] from member "${u.user.username}" (${u.id})\`\`\``)).catch(() => null);
		await role.deleteOne();
	});
};