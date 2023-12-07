const Attend = require('../../models/attendances');
const Bests = require('../../models/sotw');
const Mutes = require('../../models/mutes');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const date = new Date();
	if (date.getUTCDay() + date.getUTCHours() + date.getUTCMinutes() != 0) return;
	const attendData = await Attend.find();
	const TotalWeek = await Bests.findOne({ staff: 'Totals' }) || new Bests({ staff: 'Totals', time: 604800 });
	const TotalMutes = (await Mutes.find({ refused: false })).length;
	const showData = [];
	for (const data of attendData) {
		const arr = [];
		const bestdata = await Bests.findOne({ staff: data.staff }) || new Bests({ staff: data.staff });
		const MutesNum = (await Mutes.find({ staff: data.staff, refused: false }))?.length || 0;
		arr.push((TotalMutes - TotalWeek.mutes) ? (MutesNum - bestdata.mutes) / (TotalMutes - TotalWeek.mutes) * 100 : 100);
		arr.push((data.time - bestdata.time) / 604800 * 100);
		console.log(arr);
		const avg = arr.reduce((acc, a) => acc + a) / arr.length;
		showData.push({ staff: data.staff, avg: Math.round(avg * 10) / 10 });
		bestdata.time = data.time;
		bestdata.mutes = MutesNum;
		await bestdata.save();
	}
	TotalWeek.mutes = (await Mutes.find({ refused: false })).length;
	await TotalWeek.save();
	const factor = 100 / showData.sort((a, b) => b.avg - a.avg)[0].avg;
	(await client.staffServer.channels.fetch('1181446613009453056')).send(showData.sort((a, b) => b.avg - a.avg).map(a => `- <@${a.staff}>: **${Math.round(a.avg * factor * 10) / 10}%**`).join(',\n'));
};