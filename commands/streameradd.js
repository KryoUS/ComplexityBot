const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');
const axios = require('axios');
const config = require('../config.json');

module.exports = {
    name: 'streameradd',
    aliases: ['addstreamer', 'streamadd', 'addstream'],
    description: `Adds a Twitch Streamer to Complexity Streamers that the bot will post when they go live on Twitch.`,
    category: `Twitch`,
    args: true,
    usage: '<streameradd twitch_channel_name>',
    guildOnly: true,
    cooldown: 10,
    async execute(message, args, botAvatar, db) {

        const discordThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1627093582/discord/twitch.png`;
        const errorThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1570496619/discord/error.png`;

        const allowedRoles = "Guild Officers";

        let twitchChannel = args[0];

        if (twitchChannel == '') {
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`ComplexityBot`, botAvatar)
                .setTitle(`Streamer Add: Twitch Channel Missing!`)
                //.setURL(<url>)
                .setDescription(`You did not supply a Twitch Channel name! Please add one and try again.`)
                .setThumbnail(errorThumb)
                .addField(`Working Example`, `!streameradd asmongold`, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.reply({ embed: charEmbed });
            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer Add missing channel name.`, message);
            return;
        }

        if (message.member.roles.find(x => x.name === allowedRoles)) {

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer Add Command used.`);

            axios.put(`http://nodejs:3050/api/twitch/streamer/golive/${twitchChannel}`, {}, {
                headers: {
                    "Discord-Bot-Id": config.discordBotID,
                    "Content-Type": "application/json"
                }
            }).then(res => {
                
                const charEmbed = new Discord.RichEmbed()
                    .setColor('#6441A4')
                    .setTitle(`Complexity Streamer Added!`)
                    .setAuthor(`ComplexityBot`, botAvatar)
                    .setDescription(`When ${twitchChannel} goes live, the ComplexityBot will post in the [#streamer-go-live](https://discord.com/channels/127631752159035392/860360720100622376) channel.`)
                    .addBlankField()
                    .setThumbnail(discordThumb)
                    // .addField('Field 1 Title', 'Field 1 Text', true)
                    // .setImage('Image URL Goes Here', true)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Complexity Streamer ${twitchChannel} Added.`, res.data);

                message.channel.send({ embed: charEmbed });

            }).catch(err => {
                console.log(err)
                const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`ComplexityBot`, botAvatar)
                .setTitle(`Streamer Add Error`)
                .setDescription(`Something went wrong. Ensure that we aren't already waiting for ${twitchChannel} to go live via the "!streamerlist" command. It is also possible that the Twitch API encountered an error and you should try again in a few minutes.`)
                .setThumbnail(errorThumb)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer Add API Error`, err);
                message.channel.send({ embed: charEmbed });
            })

        } else {
            
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`ComplexityBot`, botAvatar)
                .setTitle(`Complexity Streamer: Permission Error`)
                //.setURL(<url>)
                .setDescription(`You do not have the required role to use the streameradd command!`)
                .setThumbnail(errorThumb)
                .addField(`Allowed Roles`, allowedRoles, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `User does not have sufficient privileges to use the streameradd command.`, message);

            message.reply({ embed: charEmbed });
        }
    },
};