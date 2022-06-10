module.exports = {
	name: 'bonus',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');

		const bonus = interaction.options.getInteger('bonus');

		const character = await collection.findOne({ nameLower: name.toLowerCase() });

		if (character === null) {
			await interaction.reply({ content: `I couldn't find anyone named ${name}!`, ephemeral: true });
			return;
		}

		const result = await collection.updateOne({ nameLower: name.toLowerCase() },
			{ $set: { profBonus: bonus } });

		if (result.updatedCount === 0)
			await interaction.reply(`Something went wrong and I couldn't update ${name}'s proficiency bonus!`);
		else
			await interaction.reply(`${name}'s saving throw proficiencies have been updated!`);
	}
};
