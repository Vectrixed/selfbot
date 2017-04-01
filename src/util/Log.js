const lamu = require('lamu')();

const { colors } = require('../../config');

module.exports = class Log {
	static get colors() {
		return colors;
	}

	static info(...args) {
		lamu.log({
			label: 'info',
			color: Log.colors.NEUTRAL,
			text: args.join(' '),
		});
	}

	static success(...args) {
		lamu.log({
			label: 'success',
			color: Log.colors.SUCCESS,
			text: args.join(' '),
		});
	}

	static warn(...args) {
		lamu.log({
			label: 'warning',
			color: Log.colors.WARNING,
			text: args.join(' '),
		});
	}

	static error(...args) {
		if (args.length === 1 && args[0] instanceof Error) {
			const error = args[0];

			lamu.log({
				label: 'error',
				color: Log.colors.ERROR,
				text: `${error.message}\n${error.stack}`,
			});
			return;
		}

		lamu.log({
			label: 'error',
			color: Log.colors.ERROR,
			text: args.join(' '),
		});
	}

	static log({ label, color, text }) {
		lamu.log({
			label,
			color,
			text,
		});
	}
};
