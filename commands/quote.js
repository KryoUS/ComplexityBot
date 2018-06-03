const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { firebaseKey } = require('../config.json');

module.exports = {
    name: 'quote',
    aliases: ['quotes', 'guildquotes', 'guildquote', 'memberquote', 'memberquotes', 'memquote', 'memquotes'],
    description: `Displays a random quote from the wonderful Complexity members.`,
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {

        const firebaseAPI = `https://complexitywebsite-bdcf7.firebaseio.com/guildquotes.json?auth=${firebaseKey}`
        
        snekfetch.get(firebaseAPI).then(response => {

            let quote = response.body
            let quoteIndex = Math.floor(Math.random()*(quote.length))
            let quoteName = quote[quoteIndex].name
            let quoteQuote = quote[quoteIndex].quote

            const charEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle(`__Random Quote__`)
                //.setURL(<url>)
                //.setAuthor(`Quote`, botAvatar)
                .setDescription(`_${quoteQuote} - ${quoteName}_ `)
                .addBlankField()
                //.setThumbnail()
                //.addField(`test`, `test`, false)
                //.setImage(<imageURL>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.channel.send({ embed: charEmbed });

        }).catch(error => {
            console.log(message.author.username, error);

            const charEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle(`__Error__`)
                //.setURL(<url>)
                //.setAuthor(`Quote`, botAvatar)
                .setDescription(`Unable to retrieve a random quote at this time, please try again later.`)
                .addBlankField()
                //.setThumbnail()
                //.addField(`test`, `test`, false)
                //.setImage(<imageURL>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.channel.send({ embed: charEmbed });
        })
    },
};