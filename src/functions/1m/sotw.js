const Attend = require('../../models/attendances');
const Bests = require('../../models/sotw');
const Mutes = require('../../models/mutes');
const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const date = new Date();
	if (date.getUTCDay() + date.getUTCHours() + date.getUTCMinutes() != 0) return;
	const attendData = await Attend.find();
	const TotalWeek = await Bests.findOne({ staff: 'Totals' }) || new Bests({ staff: 'Totals', time: 604800 });
	const TotalMutes = (await Mutes.find({ refused: false })).length;
	const collectedData = [];
	for (const data of attendData) {
		const arr = [];
		const bestdata = await Bests.findOne({ staff: data.staff }) || new Bests({ staff: data.staff });
		const MutesNum = (await Mutes.find({ staff: data.staff, refused: false }))?.length || 0;
		arr.push((TotalMutes - TotalWeek.mutes) ? (MutesNum - bestdata.mutes) / (TotalMutes - TotalWeek.mutes) * 100 : 100);
		arr.push((data.time - bestdata.time) / 604800 * 100);
		const avg = arr.reduce((acc, a) => acc + a) / arr.length;
		collectedData.push({ staff: data.staff, avg: Math.round(avg * 10) / 10 });
		bestdata.time = data.time;
		bestdata.mutes = MutesNum;
		await bestdata.save();
	}
	TotalWeek.mutes = (await Mutes.find({ refused: false })).length;
	await TotalWeek.save();
	const sortedData = collectedData.sort((a, b) => b.avg - a.avg);
	const factor = 100 / sortedData[0].avg;

	const canvas = createCanvas(512, 34 + 64 * sortedData.length);
	const ctx = canvas.getContext('2d');
	const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
	gradient.addColorStop(0, 'rgba(121, 181, 229, 1)');
	gradient.addColorStop(1, 'rgba(196, 223, 244, 1)');

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let num = 0;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'left';
	ctx.font = '32px sans-serif';
	ctx.fillStyle = 'white';
	for (const show of sortedData) {
		const staff = await client.users.fetch(show.staff, { cache: false });
		await loadImage(staff.displayAvatarURL({ extension: 'png' })).then(image => {
			ctx.save();
			ctx.beginPath();
			ctx.arc(32, 62 + num * 64, 28, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(image, 4, 34 + num * 64, 56, 56);
			ctx.restore();
		});

		ctx.fillText(`- ${staff.displayName}: ${Math.round(show.avg * factor * 10) / 10}%`, 75, 62 + num * 64);
		ctx.strokeText(`- ${staff.displayName}: ${Math.round(show.avg * factor * 10) / 10}%`, 75, 62 + num * 64);
		num++;
	}
	await loadImage('files/images/crown.png').then(image => {
		ctx.drawImage(image, 8, 0, 48, 48);
	});
	const file = new AttachmentBuilder(canvas.toBuffer(), { name: 'Top.png' });
	(await client.staffServer.channels.fetch('1181446613009453056')).send({ content: '@everyone', embeds: [new EmbedBuilder().setTitle('Staff of The Week').setImage('attachment://Top.png').setColor(0x79b5e7)], files: [file] });
};
// date.getutcshowData.sort((a, b) => b.avg - a.avg).map(a => `- <@${a.staff}>: **${Math.round(a.avg * factor * 10) / 10}%**`).join(',\n') + '\n\n@everyone'