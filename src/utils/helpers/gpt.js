const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPEN_AI });
/**
 * @param {String} promote
 * @param {String} system
 */
module.exports = async (promote, system) => {
	const messages = system ? [
		{
			role: 'system',
			content: system,
		},
		{
			role: 'user',
			content: promote,
		},
	] : [
		{
			role: 'user',
			content: promote,
		},
	];
	const res = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo-16k-0613',
		messages: messages,
	});
	return res.choices[0].message.content;
};