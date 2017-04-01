module.exports = class Command {
	constructor(client, info) {
		this.client = client;

		if (!('name' in info)) throw new Error('Field `name` can not be missing from a command.');
		if (typeof info.name !== 'string') throw new TypeError('Field `name` must be a string.');

		if ('aliases' in info && !Array.isArray(info.aliases)) throw new TypeError('Field `aliases` has to be an array.');
		if ('guildOnly' in info && typeof info.guildOnly !== 'boolean') {
			throw new TypeError('Field `guildOnly` has to be a boolean.');
		}

		this.name = info.name;
		this.aliases = info.aliases || [];
		this.guildOnly = info.guildOnly || false;
	}

	async run(message, args) { // eslint-disable-line

	}
};
