const utils = require('../utils');

const subcommands = utils.generateSubcommands('set');

module.exports = {
	name: 'set',
	async execute(interaction, db) {
		// If subcommand is part of a group, get the group name. Otherwise, get the command name
		const key = interaction.options.getSubcommandGroup(false) === null ? interaction.options.getSubcommand() :
			interaction.options.getSubcommandGroup();
		const subcommand = subcommands.get(key);
		if (!subcommand) return;

		try {
			await subcommand.execute(interaction, db);
		}
		catch (e) {
			console.error(e);
			await interaction.reply({ content: 'Something went wrong and I couldn\'t execute that command!',
				ephemeral: true });
		}
	}
};
