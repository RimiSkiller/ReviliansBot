const { createCanvas, loadImage } = require('canvas');

module.exports = {
	name: 'family',
	description: 'Let the bot send you a editted photo of your profile with the server logo in it',

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		await interaction.deferReply();
		const canvas = createCanvas(1024, 1024);
		const ctx = canvas.getContext('2d');

		await loadImage(interaction.user.displayAvatarURL({ extension: 'png', size: 1024 })).then(img => ctx.drawImage(img, 0, 0, 1024, 1024));
		await loadImage('files/images/riviliansFamily.png').then(img => ctx.drawImage(img, 0, 0, 1024, 1024));

		interaction.editReply({ files: [canvas.toBuffer()] });
	},
};