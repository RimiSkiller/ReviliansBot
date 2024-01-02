const { createCanvas, registerFont, loadImage } = require('canvas');
const { welcome } = require('../../../configs/config.json');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (client, member) => {
	if (member.guild.id != client.mainServer.id) return;
	registerFont('files/fonts/Hayah_font.otf', { family: 'Hayah' });
	const canvas = createCanvas(1920, 1080);
	const ctx = canvas.getContext('2d');

	await loadImage('files/images/welcome.png').then(image => {
		ctx.drawImage(image, 0, 0);
	});
	ctx.font = '128px "Hayah"';
	ctx.fillStyle = 'rgba(73, 33, 110, 1)';
	ctx.textAlign = 'center';
	ctx.fillText(member.displayName, 1350, 400, 800);

	await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 512 })).then(image => {
		ctx.save();
		ctx.beginPath();
		ctx.arc(540.4, 540.4, 401, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(image, 139.4, 139.4, 802, 802);
		ctx.restore();
	});

	const answer = await require('../../utils/helpers/gpt')(`a user named "${member.displayName}" joined the server, welcome him with a message related to his name`, `I want you to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${member.guild.name}", you will send me the best message in Arabic to reply to this scenario, users names must be in English.`);
	client.mainServer.channels.cache.get(welcome).send({ content: '**● ' + answer.replace(member.displayName, `<@${member.id}>`) + '**', files: [canvas.toBuffer()] });


	// const messages = await client.staffServer.channels.cache.get(welcome.messages).messages.fetch();
	// const message = messages.map(msg => msg.content.replace('{member}', `<@${member.id}>`))[Math.floor(Math.random() * messages.size)];
	// client.mainServer.channels.cache.get(welcome.channel).send({ content: message, files: [canvas.toBuffer()] });
};