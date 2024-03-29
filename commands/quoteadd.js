const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');

module.exports = {
    name: 'quoteadd',
    aliases: ['quotesadd', 'guildquotesadd', 'guildquoteadd', 'memberquoteadd', 'memberquotesadd', 'memquoteadd', 'memquotesadd'],
    description: `Adds a quote to the Bot from the wonderful Complexity members.`,
    category: `Guild`,
    args: true,
    usage: '<name> <quote sentence with punctuation(can contain spaces)>',
    guildOnly: true,
    cooldown: 60,
    async execute(message, args, botAvatar, db) {
        
        const quoteThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fquotes.png?alt=media&token=357efdeb-b65d-4544-8e9d-14d66c5fc5b6`;
        const errorThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1570496619/discord/error.png`;

        const allowedRoles = "Guild Member";

        let quoteName = args[0];
        let argJoin = args.shift();
        argJoin = args.join(' ');
        let quote = argJoin.replace(/"/g, '');
        let now = new Date().getTime();

        if (quote == '') {
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`Quote`, botAvatar)
                .setTitle(`Quote Add: Quote Missing`)
                //.setURL(<url>)
                .setDescription(`You did not supply a quote to add!`)
                .setThumbnail(errorThumb)
                .addField(`Working Example`, `^quoteadd CharacterName Funny quote goes here.`, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.reply({ embed: charEmbed });
            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Quoteadd Command missing a quote.`, message);
            return
        }

        if (message.member.roles.find(x => x.name === allowedRoles)) {

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Quoteadd Command used.`);

            db.quotes.insert({
                date_time: now,
                quote: quote,
                said_by: quoteName,
                entered_by: message.author.id
            }).then(response => {

                const charEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setTitle(`Quote Added`)
                    //.setURL(<url>)
                    .setAuthor(`Quote`, botAvatar)
                    .setDescription(`_${quote} - ${quoteName}_ `)
                    .addBlankField()
                    .setThumbnail(quoteThumb)
                    //.addField(`test`, `test`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Quote inserted.`, response);
                message.channel.send({ embed: charEmbed });
            }).catch(error => {
                console.log(message.authoer.username, error);

                const charEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setTitle(`Error`)
                    //.setURL(<url>)
                    .setAuthor(`Quote`, botAvatar)
                    .setDescription(`Unable to add a quote at this time, please try again later.`)
                    .addBlankField()
                    .setThumbnail(errorThumb)
                    //.addField(`test`, `test`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                message.channel.send({ embed: charEmbed });
            })

        } else {
            
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`Quote`, botAvatar)
                .setTitle(`Quote Add: Permission Error`)
                //.setURL(<url>)
                .setDescription(`You do not have the required role to add a quote!`)
                .setThumbnail(errorThumb)
                .addField(`Allowed Roles`, allowedRoles, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `User does not have sufficient privileges to use the Quoteadd command.`, message);

            message.reply({ embed: charEmbed });
        }
    },
};