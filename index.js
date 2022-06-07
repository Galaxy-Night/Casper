const { Client, Intents } = require('discord.js');
const { token, dbUri } = require('./config.json');
const { MongoClient } = require('mongodb');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const dbClient = new MongoClient(dbUri);
let db;

// fires when the client has connected to Discord
client.once('ready', async () => {
	try {
		await dbClient.connect();
		db = dbClient.db('casper');
		await db.command({ ping: 1 });
		console.log('Connected to database');
	}
	catch (err) {
		console.error(err);
	}
	console.log('Connected to Discord');
});

client.login(token);
