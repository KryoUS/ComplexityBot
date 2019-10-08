const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');
const axios = require('axios');

module.exports = {
    name: 'raidbotsadd',
    aliases: ['rbadd', 'raidbotsreportadd', 'raidbotsreport', 'rbreports', 'rbreportsadd'],
    description: `Adds a Raidbots report that was ran outside of Discord to the website.`,
    category: `Raidbots`,
    args: true,
    usage: '<raidbots report URL or Report ID>',
    guildOnly: true,
    cooldown: 60,
    async execute(message, args, botAvatar, db) {

        const errorThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1570496619/discord/error.png`;
        const raidbotsLogo = `https://res.cloudinary.com/complexityguild/image/upload/v1570496421/discord/raidbotslogo.png`;

        const allowedRoles = "Guild Member";

        if (args[0].length < 30) {
            args[0] = `https://www.raidbots.com/simbot/report/${args[0]}`;
        };

        if (args[0] == '' || !args[0].includes('https://www.raidbots.com/simbot/report/')) {
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`Raidbots`, botAvatar)
                .setTitle(`Raidbots Report Add: URL or Report ID is Missing or Invalid`)
                //.setURL(<url>)
                .setDescription(`You did not supply a valid URL or Report ID!`)
                .setThumbnail(errorThumb)
                .addField(`Working Example`, `^raidbotsadd https://www.raidbots.com/simbot/report/68NtgmT4zb9iqXyqp8gumD`, false)
                .addField(`Working Example`, `^raidbotsadd 68NtgmT4zb9iqXyqp8gumD`, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.reply({ embed: charEmbed });
            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Raidbotsadd Command missing a valid URL or Report ID.`, message);
            return
        }

        if (message.member.roles.find(x => x.name === allowedRoles)) {

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Raidbotsadd Command used.`);
            //Get JSON data from Raidbots
            axios.get(args[0] + '/data.json').then(res => {

                //Insert the Raidbots JSON into database
                db.raidbots.saveDoc(res.data).then(result => {

                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#ffffff')
                        .setTitle(`Raidbots Report Added`)
                        .setURL(args[0])
                        .setAuthor(`Raidbots`, botAvatar)
                        .setDescription(`_${result.simbot.title}_ `)
                        .addBlankField()
                        .setThumbnail(raidbotsLogo)
                        //.addField(`test`, `test`, false)
                        //.setImage(<imageURL>)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);


                    message.channel.send({ embed: charEmbed });

                    DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Raidbot Sim Inserted Manually: ${result.simbot.title}`);
                }).catch(error => {

                    console.log(message.author.username, error);

                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#ffffff')
                        .setTitle(`Error`)
                        //.setURL(<url>)
                        .setAuthor(`Raidbotsadd`, botAvatar)
                        .setDescription(`Unable to add a Raidbots Sim at this time, please try again later.`)
                        .addBlankField()
                        .setThumbnail(errorThumb)
                        //.addField(`test`, `test`, false)
                        //.setImage(<imageURL>)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                    message.channel.send({ embed: charEmbed });

                    DiscordBotLogging(db, 1, 'system', botAvatar, `Raidbot Sim Manual Insertion Error`, error);
                })

            }).catch(error => {

                const charEmbed = new Discord.RichEmbed()
                        .setColor('#ffffff')
                        .setTitle(`Error`)
                        //.setURL(<url>)
                        .setAuthor(`Raidbotsadd`, botAvatar)
                        .setDescription(`Unable to add a Raidbots Sim at this time, please try again later.`)
                        .addBlankField()
                        .setThumbnail(errorThumb)
                        //.addField(`test`, `test`, false)
                        //.setImage(<imageURL>)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                    message.channel.send({ embed: charEmbed });

                DiscordBotLogging(db, 1, 'system', botAvatar, `Raidbot Sim Fetch Error`, error);
            });

        } else {

            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`Raidbotsadd`, botAvatar)
                .setTitle(`Raidbots Report Add: Permission Error`)
                //.setURL(<url>)
                .setDescription(`You do not have the required role to add a Raidbots Simulation!`)
                .setThumbnail(errorThumb)
                .addField(`Allowed Roles`, allowedRoles, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `User does not have sufficient privileges to use the Raidbotsadd command.`, message);

            message.reply({ embed: charEmbed });
        }
    },
};