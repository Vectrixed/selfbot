const Command = require('../structures/Command');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eval',
			aliases: ['e'],
		});

		this.lastResult = null;
	}

	async run(message, args) { // eslint-disable-line require-await
		const input = args.join(' ');

		const doReply = value => { // eslint-disable-line no-unused-vars
			if (value instanceof Error) {
				message.channel.send([
					'**Error**```js',
					value,
					'```',
				].join('\n'));
			} else {
				message.channel.send([
					'**Output**```js',
					value,
					'```',
				].join('\n'));
			}
		};

		const lastResult = this.lastResult; // eslint-disable-line no-unused-vars

		try {
			this.lastResult = require('util').inspect(eval(input), { depth: 1 })
				.replace(this.client.token, '--snip--')
				.replace(this.client.user.email, '--snip--');

			message.edit([
				'**Input**```js',
				input,
				'```',
				'**Output**```js',
				this.lastResult,
				'```',
			].join('\n'));
		} catch (error) {
			message.edit([
				'**Input**```js',
				input,
				'```**Error**```js',
				error,
				'```',
			].join('\n'));
		}
	}
};
