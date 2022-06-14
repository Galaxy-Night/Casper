const utils = require('../utils');

const subcommands = utils.generateSubcommands('override');

module.exports = {
	name: 'override',
	execute: async function(interaction, db) { utils.runSubcommandOrGroup(subcommands, interaction, db); }
};
