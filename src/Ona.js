global.Promise = require('bluebird');

const path = require('path');

const config = require('../config');
const SilvanoClient = require('./structures/SilvanoClient.js');

const client = new SilvanoClient({
	prefix: config.prefix,
	commandsDir: path.isAbsolute(config.commands) ? config.commands : path.join(__dirname, config.commands),
});

client.login(config.token);
