const TRoles = require('../../../models/temproles');

module.exports = async (interaction, user) => {
	const datas = await TRoles.find({ member: user.id });
	if (datas.length == 0) return { msg: '**🤔 - This member doesn\'t have any temproles.**' };
	const dataShow = datas.map(data => `**● <@&${data.role}> » <t:${Math.floor(data.time / 1000)}:R>**`);
	return { msg: dataShow.join(',\n') };
};