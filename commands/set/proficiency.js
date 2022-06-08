const fs = require('node:fs');

const subcommands = new Map();
const subcommandFiles = fs.readdirSync('./commands/set/proficiency');

for (const file of subcommandFiles) {
	const subcommand = require(`./proficiency/${file}`);
	subcommands.set(subcommand.name, subcommand);
}

module.exports = {
	name: 'proficiency',
	async execute(interaction, db) {
		// If subcommand is part of a group, get the group name. Otherwise, get the command name
		const key = interaction.options.getSubcommand();
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
