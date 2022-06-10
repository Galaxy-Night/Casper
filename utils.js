const fs = require('node:fs');

module.exports = { generateSubcommands, runSubcommand };

/**
 * Generates a map of subcommand names and modules to be passed to runSubcommand
 *
 * @param {String} path the path to the directory containing the subcommand files
 * @returns {Map} A map of subcommand names and their modules
 */
function generateSubcommands(path) {
	const subcommands = new Map();
	const subcommandFiles = fs.readdirSync(`./commands/${path}`);

	for (const file of subcommandFiles) {
		const subcommand = require(`./commands/${path}/${file}`);
		subcommands.set(subcommand.name, subcommand);
	}
	return subcommands;
}

/**
 * Runs a subcommand from a command
 *
 * @param {*} subcommands the Map containing the subcommands as produced by generateSubcommands
 * @param {*} interaction the interaction that triggered the command
 * @param {*} db          the database object needed for the subcommand
 */
async function runSubcommand(subcommands, interaction, db) {
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
