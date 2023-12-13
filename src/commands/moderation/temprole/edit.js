const TRoles = require('../../../models/temproles');
const ms = require('ms');

module.exports = async (interaction, user, role, time) => {
	const data = await TRoles.findOne({ role: role.id, member: user.id });
	if (!data) return { msg: '**🤔 - This member doesn\'t have this temprole.**' };
	data.time = Number(data.time) + time;
	const msg = `**➕ - Changed time by __${ms(time, { long: true })}__, Time remaining: \`${ms(data.time - Date.now(), { long: true })}\`**`;
	await data.save();
	const log = (`**● Action By ${interaction.user}:**\`\`\`diff\n+ Added ${ms(time, { long: true })} to:\n+ [user: ${user.user.username} (${user.id}), temprole: ${role.name} (${role.id})]\`\`\``);
	return { msg, log };
};