const { stripIndents } = require('common-tags');
const { Client, Collection, Message } = require('discord.js');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const Command = require('./Command');
const { colors } = require('../../config');
const Log = require('../util/Log');

Message.prototype.editEmbed = function(text) { // eslint-disable-line func-names
	this.edit({
		embed: {
			color: colors.EMBEDS,
			description: text,
		},
	});
};
module.exports = class SilvanoClient extends Client {
	constructor(options) {
		super(options);

		if (!('prefix' in options)) throw new Error('Field `prefix` can not be missing from Client constructor.');
		if (!('commandsDir' in options)) throw new Error('Field `commandsDir` can not be missing from Client constructor.');

		this.prefix = options.prefix;
		this.commandsDir = options.commandsDir;

		this.commands = new Collection();

		this
			.on('ready', () => {
				Log.success(`Michiko is now serving ${this.user.username}#${this.user.discriminator} (ID: ${this.user.id})`);
			})
			.on('message', this.handleMessage)
			.on('messageUpdate', (oldMessage, newMessage) => {
				if (oldMessage.content !== newMessage.content) this.handleMessage(newMessage);
			})
			.on('disconnect', event => {
				Log.warn(stripIndents`
					Michiko has lost connection to the Discord gateway.
					Exit code: ${event.code}
				`);
			})
			.on('reconnecting', () => {
				Log.info('Michiko is attempting to reconnect to the Discord gateway...');
			})
			.on('warn', info => {
				Log.warn(info);
			})
			.on('error', error => {
				Log.error(stripIndents`
					Michiko has encountered an error:
					${error.message}
					${error.stack}
				`);
			});

		this.registerCommandsIn(this.commandsDir);
	}

	handleMessage(message) {
		if (message.author.id !== this.user.id) return;
		if (!message.content.startsWith(this.prefix)) return;

		const [commandName, ...args] = message.content.substr(this.prefix.length).split(' ');

		const command = this.commands.get(commandName);

		if (command) {
			command.run(message, args).catch(error => {
				message.editCode('', error);
			});
		}
	}

	registerCommandsIn(dir) {
		fs.readdirAsync(dir).then(files => {
			for (const file of files) {
				const pathToFile = path.join(dir, file);

				if (fs.statSync(pathToFile).isDirectory()) {
					this.registerCommandsIn(pathToFile);
					continue;
				}
				if (!pathToFile.endsWith('.js')) continue;

				const CommandClass = require(pathToFile);

				if (typeof CommandClass !== 'function') {
					Log.warn(`${pathToFile} is not a command class. Skipping`);
					continue;
				}

				const command = new CommandClass(this);

				if (!(command instanceof Command)) {
					Log.warn(`${pathToFile} is not a command class. Skipping`);
					continue;
				}

				if (this.commands.has(command.name)) {
					Log.warn(`A command with the name ${command.name} already exists. Skipping ${pathToFile}`);
					continue;
				}

				this.commands.set(command.name, command);

				if (command.name.includes('-')) {
					this.commands.set(command.name.replace(/-/g, ''), command);
				}

				if ('aliases' in command) {
					for (const alias of command.aliases) {
						if (this.commands.has(alias)) {
							Log.warn(`A command with the name ${command.name} already exists. Skipping ${pathToFile}`);
							continue;
						}

						this.commands.set(alias, command);

						if (alias.includes('-')) {
							this.commands.set(alias.replace(/-/g, ''), command);
						}
					}
				}
			}
		}).catch(error => {
			Log.error(stripIndents`
				Error when loading commands: ${error.message}
				${error.stack}
			`);
		});
}
};
