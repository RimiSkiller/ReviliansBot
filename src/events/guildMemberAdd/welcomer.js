const { createCanvas, registerFont, loadImage } = require('canvas');
const { welcome } = require('../../../configs/config.json');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (client, member) => {
	if (member.guild.id != client.mainServer.id) return;
	const canvas = createCanvas(1920, 1080);
	const ctx = canvas.getContext('2d');

	await loadImage('files/images/welcome.png').then(image => {
		ctx.drawImage(image, 0, 0);
	});
	registerFont('files/fonts/Gropled_font.otf', { family: 'Gropled' });
	ctx.font = '108px "Gropled"';
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.fillText(member.displayName, 1350, 540, 1000);

	await loadImage(member.user.displayAvatarURL()).then(image => {
		ctx.beginPath();
		ctx.arc(430, 555, 315, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(image, 115, 240, 630, 630);
	});
	const messages = await client.staffServer.channels.cache.get(welcome.messages).messages.fetch();
	const message = messages.map(msg => msg.content.replace('{member}', `<@${member.id}>`))[Math.floor(Math.random() * messages.size)];
	client.mainServer.channels.cache.get(welcome.channel).send({ content: message, files: [canvas.toBuffer()] });
};