const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');

module.exports = {
    name: 'quote',
    aliases: ['quotes', 'guildquotes', 'guildquote', 'memberquote', 'memberquotes', 'memquote', 'memquotes'],
    description: `Displays a random quote from the wonderful Complexity members.`,
    category: `Guild`,
    args: false,
    guildOnly: false,
    cooldown: 5,
    async execute(message, args, botAvatar, db) {
        const quoteThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fquotes.png?alt=media&token=357efdeb-b65d-4544-8e9d-14d66c5fc5b6`
        const errorThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1570496619/discord/error.png`
        
        DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Random Quote command used.`);

        db.quotes.find().then(response => {

            let quoteIndex = Math.floor(Math.random()*(response.length));
            let quoteName = response[quoteIndex].said_by;
            let quote = response[quoteIndex].quote;

            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setTitle(`Random Quote`)
                //.setURL(<url>)
                .setAuthor(`Quote`, botAvatar)
                .setDescription(`_${quote} - ${quoteName}_ `)
                .addBlankField()
                .setThumbnail(quoteThumb)
                //.addField(`test`, `test`, false)
                //.setImage(<imageURL>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Random Quote given.`, {quote: quote, response: response});

            message.channel.send({ embed: charEmbed });

        }).catch(error => {
            console.log(message.author.username, error);

            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setTitle(`Error`)
                //.setURL(<url>)
                .setAuthor(`Quote`, botAvatar)
                .setDescription(`Unable to retrieve a random quote at this time, please try again later.`)
                .addBlankField()
                .setThumbnail(errorThumb)
                //.addField(`test`, `test`, false)
                //.setImage(<imageURL>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.channel.send({ embed: charEmbed });
        })
    },
};