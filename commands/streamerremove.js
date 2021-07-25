const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');
const axios = require('axios');
const config = require('../config.json');

module.exports = {
    name: 'streamerremove',
    aliases: ['removestreamer', 'streamremove', 'removestream'],
    description: `Removes a Twitch Streamer from Complexity Streamers so that the bot will no longer post when they go live on Twitch.`,
    category: `Twitch`,
    args: true,
    usage: '<streamerremove GUID>',
    guildOnly: true,
    cooldown: 10,
    async execute(message, args, botAvatar, db) {

        const discordThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1627093582/discord/twitch.png`;
        const errorThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1570496619/discord/error.png`;

        const allowedRoles = "Guild Officers";

        let twitchGUID = args[0];

        if (twitchGUID == '') {
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`ComplexityBot`, botAvatar)
                .setTitle(`Streamer Remove: Twitch ID Missing!`)
                //.setURL(<url>)
                .setDescription(`You did not supply a Twitch ID! Please add one and try again.`)
                .setThumbnail(errorThumb)
                .addField(`Working Example`, `!streamerremove 36a382db-8050-4002-950a-6e6eb6be4858`, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.reply({ embed: charEmbed });
            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer Remove missing Twitch ID.`, message);
            return;
        }

        if (message.member.roles.find(x => x.name === allowedRoles)) {

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer Remove Command used.`);

            axios.delete(`https://complexityguild.net/api/twitch/streamer/removeid/${twitchGUID}`, {
                headers: {
                    "Discord-Bot-Id": config.discordBotID,
                    "Content-Type": "application/json"
                }
            }).then(res => {

                const charEmbed = new Discord.RichEmbed()
                    .setColor('#6441A4')
                    .setTitle(`Complexity Streamer Removed!`)
                    .setAuthor(`ComplexityBot`, botAvatar)
                    .setDescription(`ID ${twitchGUID} successfully removed, the ComplexityBot will no longer post in the [#streamer-go-live](https://discord.com/channels/127631752159035392/860360720100622376) channel for the linked channel.`)
                    .addBlankField()
                    .setThumbnail(discordThumb)
                    // .addField('Field 1 Title', 'Field 1 Text', true)
                    // .setImage('Image URL Goes Here', true)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Complexity Streamer Removed. GUID: ${twitchGUID}`, res.data);

                message.channel.send({ embed: charEmbed });

            }).catch(err => {
                console.log(err)
                const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`ComplexityBot`, botAvatar)
                .setTitle(`Streamer Remove Error`)
                .setDescription(`Something went wrong. Ensure that the ID is correct from the "!streamerlist" command. It is also possible that the Twitch API encountered an error and you should try again in a few minutes.`)
                .setThumbnail(errorThumb)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer Remove API Error`, err);
                message.channel.send({ embed: charEmbed });
            })

        } else {
            
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`ComplexityBot`, botAvatar)
                .setTitle(`Complexity Streamer: Permission Error`)
                //.setURL(<url>)
                .setDescription(`You do not have the required role to use the streamerremove command!`)
                .setThumbnail(errorThumb)
                .addField(`Allowed Roles`, allowedRoles, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `User does not have sufficient privileges to use the streamerremove command.`, message);

            message.reply({ embed: charEmbed });
        }
    },
};