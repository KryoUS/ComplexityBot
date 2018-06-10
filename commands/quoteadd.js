const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { firebaseKey } = require('../config.json');

module.exports = {
    name: 'quoteadd',
    aliases: ['quotesadd', 'guildquotesadd', 'guildquoteadd', 'memberquoteadd', 'memberquotesadd', 'memquoteadd', 'memquotesadd'],
    description: `Adds a quote to the Bot from the wonderful Complexity members.`,
    category: `Guild`,
    args: true,
    usage: '<name> <quote sentence with punctuation(can contain spaces)>',
    guildOnly: true,
    cooldown: 60,
    async execute(message, args) {
        
        const quoteThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fquotes.png?alt=media&token=357efdeb-b65d-4544-8e9d-14d66c5fc5b6`
        const errorThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Ferror.png?alt=media&token=19beee91-6acd-4949-87da-dc2949e68fa1`

        const allowedRoles = "RoleTest"

        if (message.member.roles.find("name", allowedRoles)) {

            const quoteName = args[0]
            const firebaseAPI = `https://complexitywebsite-bdcf7.firebaseio.com/guildquotes.json?auth=${firebaseKey}`
            
            let argJoin = args.shift()
            argJoin = args.join(' ')
            let quoteQuote = argJoin

            snekfetch.get(firebaseAPI).then(response => {

                let quote = response.body
                let length = quote.length

                const firebaseAPIIndex = `https://complexitywebsite-bdcf7.firebaseio.com/guildquotes/${length}.json?auth=${firebaseKey}`

                snekfetch.put(firebaseAPIIndex).send( { name: quoteName, quote: quoteQuote } ).then(response => {

                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#ffffff')
                        .setTitle(`Quote Added`)
                        //.setURL(<url>)
                        //.setAuthor(`Quote`, botAvatar)
                        .setDescription(`_${quoteQuote} - ${quoteName}_ `)
                        .addBlankField()
                        .setThumbnail(quoteThumb)
                        //.addField(`test`, `test`, false)
                        //.setImage(<imageURL>)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                    message.channel.send({ embed: charEmbed });
                }).catch(error => {
                    console.log(message.authoer.username, error);

                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#ffffff')
                        .setTitle(`Error`)
                        //.setURL(<url>)
                        //.setAuthor(`Quote`, botAvatar)
                        .setDescription(`Unable to add a quote at this time, please try again later.`)
                        .addBlankField()
                        .setThumbnail(errorThumb)
                        //.addField(`test`, `test`, false)
                        //.setImage(<imageURL>)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                    message.channel.send({ embed: charEmbed });
                })

            }).catch(error => {
                console.log(message.author.username, error);
                
                const charEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setTitle(`Error`)
                    //.setURL(<url>)
                    //.setAuthor(`Quote`, botAvatar)
                    .setDescription(`Unable to add a quote at this time, please try again later.`)
                    .addBlankField()
                    //.setThumbnail()
                    //.addField(`test`, `test`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                message.channel.send({ embed: charEmbed });
            })
        } else {
            
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                //.setAuthor(`Quote Add`, weatherIcon)
                .setTitle(`Quote Add: Permission Error`)
                //.setURL(<url>)
                .setDescription(`You do not have the required role to add a quote!`)
                .setThumbnail(errorThumb)
                .addField(`Allowed Roles`, allowedRoles, false)
                //.addField(`Latitude and Longitude`, `Remember, North/South come first, followed by East/West. Both South and West are negative numbers. And finally, Latitude comes before Longitude.`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.reply({ embed: charEmbed });
        }
    },
};