const Command = require('../structures/Command');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['p'],
		});
	}

	async run(message) { // eslint-disable-line require-await
		return message.editEmbed('Pong!');
	}
};
