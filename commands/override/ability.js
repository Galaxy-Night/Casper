const utils = require('../../utils');

const test = (toOverride) => async (interaction, db) => {await override(toOverride, interaction, db); };

const subcommands = new Map();
subcommands.set('strength', { execute: test('str') }).
	set('dexterity', { execute: test('dex') }).
	set('constitution', { execute: test('con') }).
	set('intelligence', { execute: test('int') }).
	set('wisdom', { execute: test('wis') }).
	set('charisma', { execute: test('cha') });

module.exports = {
	name: 'ability',
	execute: async function(interaction, db) {
		utils.runSubcommand(subcommands, interaction, db);
	}
};

async function override(toOverride, interaction, db) {
	const collection = db.collection(String(interaction.guildId));
	const name = interaction.options.getString('name');

	const shouldOverride = interaction.options.getBoolean('override');
	const overrideValue = interaction.options.getInteger('value');

	const character = await collection.findOne({ nameLower: name.toLowerCase() });

	if (character === null) {
		await interaction.reply({ content: `I couldn't find anyone named ${name}!`, ephemeral: true });
		return;
	}

	character.abilities[toOverride].overridemod = shouldOverride;
	if (overrideValue !== null) character.abilities[toOverride].overrideval = overrideValue;

	const result = await collection.updateOne({ nameLower: name.toLowerCase() },
		{ $set: { abilities: character.abilities } });

	if (result.updatedCount === 0)
		await interaction.reply(`Something went wrong and I couldn't update ${name}'s ability scores!`);
	else
		await interaction.reply(`${name}'s ability scores have been updated!`);
}
