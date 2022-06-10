const utils = require('../../utils');

const subcommands = utils.generateSubcommands('set/proficiency');

module.exports = {
	name: 'proficiency',
	execute: async function(interaction, db) { utils.runSubcommand(subcommands, interaction, db); }
};

