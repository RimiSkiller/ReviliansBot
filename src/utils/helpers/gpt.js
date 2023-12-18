const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPEN_AI });
/**
 * @param {String} promote
 */
module.exports = async (promote) => {
	const res = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo-16k-0613',
		messages: [
			{
				role: 'user',
				content: promote,
			},
		],
	});
	return res.choices[0].message.content;
};