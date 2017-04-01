global.Promise = require('bluebird');

const config = require('../config');
const SilvanoClient = require('./structures/SilvanoClient.js');

const client = new SilvanoClient({
	prefix: config.prefix,
	commandsDir: config.commands,
});

client.login(config.token);
