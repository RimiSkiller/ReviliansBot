const TRoles = require('../../../models/temproles');
const ms = require('ms');

module.exports = async (interaction, user, role, time) => {
	const data = await TRoles.findOne({ role: role.id, member: user.id });
	if (data) return { msg: '**🤔 - This member already have this temprole.**' };
	user.roles.add(role.id);
	await new TRoles({
		member: user.id,
		role: role.id,
		time: Date.now() + time,
	}).save();
	const msg = `**⌛ - Added role \`${role.name}\` to user ${user} for __${ms(time, { long: true })}__.**`;
	const log = `**● Action By ${interaction.user}:**\`\`\`diff\n+ Added temprole: ${role.name} (${role.id}) to:\n+ user: ${user.user.username} (${user.id}) for ${ms(time, { long: true })}\`\`\``;
	return { msg, log };
};