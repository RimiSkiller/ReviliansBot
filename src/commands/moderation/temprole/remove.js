const TRoles = require('../../../models/temproles');

module.exports = async (interaction, user, role) => {
	const data = await TRoles.findOne({ role: role.id, member: user.id });
	if (!data) return { msg: '**🤔 - This member doesn\'t have this temprole.**' };
	await data.deleteOne();
	user.roles.remove(role.id);
	const msg = `**🗑️ - Removed temprole \`${role.name}\` from member.**`;
	const log = (`**● Action By ${interaction.user}:**\`\`\`diff\n- Removed temprole: ${role.name} (${role.id}) from user: ${user.user.username} (${user.id})\`\`\``);
	return { msg, log };
};