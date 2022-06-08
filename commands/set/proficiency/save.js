module.exports = {
	name: 'save',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');

		const strength = interaction.options.getInteger('strength');
		const dexterity = interaction.options.getInteger('dexterity');
		const constitution = interaction.options.getInteger('constitution');
		const intelligence = interaction.options.getInteger('intelligence');
		const wisdom = interaction.options.getInteger('wisdom');
		const charisma = interaction.options.getInteger('charisma');

		if (strength === null && dexterity === null && constitution === null &&
			intelligence === null && wisdom === null && charisma === null) {
			await interaction.reply({ content: 'Please specify a save proficiency to change!', ephemeral: true });
			return;
		}

		const character = await collection.findOne({ nameLower: name.toLowerCase() });

		if (character === null) {
			await interaction.reply({ content: `I couldn't find anyone named ${name}!`, ephemeral: true });
			return;
		}

		if (strength !== null) character.abilities.str.saveprof = strength;
		if (dexterity !== null) character.abilities.dex.saveprof = dexterity;
		if (constitution !== null) character.abilities.con.saveprof = constitution;
		if (intelligence !== null) character.abilities.int.saveprof = intelligence;
		if (wisdom !== null) character.abilities.wis.saveprof = wisdom;
		if (charisma !== null) character.abilities.cha.saveprof = charisma;

		const result = await collection.updateOne({ nameLower: name.toLowerCase() },
			{ $set: { abilities: character.abilities } });

		if (result.updatedCount === 0)
			await interaction.reply(`Something went wrong and I couldn't update ${name}'s saving throw proficiencies!`);
		else
			await interaction.reply(`${name}'s saving throw proficiencies have been updated!`);
	}
};
