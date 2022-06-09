module.exports = {
	name: 'skill',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');

		const character = await collection.findOne({ nameLower: name.toLowerCase() });

		if (character === null) {
			await interaction.reply({ content: `I couldn't find anyone named ${name}!`, ephemeral: true });
			return;
		}

		const skillObject = {
			acrobatics: interaction.options.getInteger('acrobatics'),
			animal_handling: interaction.options.getInteger('animal_handling'),
			arcana: interaction.options.getInteger('arcana'),
			athletics: interaction.options.getInteger('athletics'),
			deception: interaction.options.getInteger('deception'),
			history: interaction.options.getInteger('history'),
			insight: interaction.options.getInteger('insight'),
			intimidation: interaction.options.getInteger('intimidation'),
			investigation: interaction.options.getInteger('investigation'),
			medicine: interaction.options.getInteger('medicine'),
			nature: interaction.options.getInteger('nature'),
			perception: interaction.options.getInteger('perception'),
			performance: interaction.options.getInteger('performance'),
			persuasion: interaction.options.getInteger('persuasion'),
			religion: interaction.options.getInteger('religion'),
			sleight_of_hand: interaction.options.getInteger('sleight_of_hand'),
			stealth: interaction.options.getInteger('stealth'),
			survival: interaction.options.getInteger('survival')
		};

		// remove empty keys from skillObject
		Object.keys(skillObject).forEach(key => skillObject[key] == null && delete skillObject[key]);

		if (Object.keys(skillObject).length === 0) {
			await interaction.reply({ content: 'I need a skill to set!', ephemeral: true });
			return;
		}

		for (let i = 0; i < Object.keys(skillObject).length; i++)
			character.skills[Object.keys(skillObject)[i]]['prof'] = skillObject[Object.keys(skillObject)[i]];

		const result = await collection.updateOne({ nameLower: name.toLowerCase() },
			{ $set: { skills: character.skills } });

		if (result.updatedCount === 0)
			await interaction.reply(`Something went wrong and I couldn't update ${name}'s skill proficiencies!`);
		else
			await interaction.reply(`${name}'s skill proficiencies have been updated!`);
	}
};
