const TRoles = require('../../models/temproles');
const { mainlog, mainserver } = require('../../../config.json');
/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const roles = await TRoles.where('time').lte(Date.now());
	roles.forEach(async role => {
		const member = await client.guilds.cache.get(mainserver).members.fetch(role.member);
		const roleName = (await client.guilds.cache.get(mainserver).roles.fetch(role.role)).name;
		await member.roles.remove(role.role).then(u => client.channels.cache.get(mainlog).send(`**● Automatic:**\`\`\`diff\n- Removed temp-role [${roleName}] from member "${u.user.username}" (${u.id})\`\`\``));
		role.deleteOne();
	});
};