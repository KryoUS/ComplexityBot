const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');
const axios = require('axios');
const config = require('../config.json');

module.exports = {
    name: 'streamerlist',
    aliases: ['liststreamers', 'streamlist', 'liststream'],
    description: `Returns a list of all Complexity Streamers that the bot will post when they go live on Twitch.`,
    category: `Twitch`,
    args: false,
    usage: '<streamerlist>',
    guildOnly: false,
    cooldown: 10,
    async execute(message, args, botAvatar, db) {

        const discordThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1627093582/discord/twitch.png`;
        const errorThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1570496619/discord/error.png`;

        const allowedRoles = "Guild Officers";

        if (message.member.roles.find(x => x.name === allowedRoles)) {

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer List Command used.`);

            axios.get(`https://www.complexityguild.net/api/twitch/webhooks/list`, {
                headers: {
                    "Discord-Bot-Id": config.discordBotID,
                    "Content-Type": "application/json"
                }
            }).then(res => {

                const charEmbed = new Discord.RichEmbed()
                    .setColor('#6441A4')
                    .setTitle(`Complexity Streamers`)
                    .setAuthor(`ComplexityBot`, botAvatar)
                    .setDescription(`When the following streamers go live, the ComplexityBot will post in the [#streamer-go-live](https://discord.com/channels/127631752159035392/860360720100622376) channel. To remove a streamer, copy the remove command listed below the Channel Name and paste it into Discord.`)
                    .addBlankField()
                    .setThumbnail(discordThumb)
                    // .addField('Field 1 Title', 'Field 1 Text', true)
                    // .setImage('Image URL Goes Here', true)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Complexity Streamers Listed.`, res.data);


                Promise.all(res.data.data.map(responseObj => {
                    return charEmbed.addField(`${responseObj.channel_info.broadcaster_name} - "${responseObj.channel_info.title}"`, `!streamerremove ${responseObj.id}`, false);
                }));

                message.channel.send({ embed: charEmbed });

            }).catch(err => {
                console.log(err)
                const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`Complexity Streamer`, botAvatar)
                .setTitle(`Streamer List Error`)
                .setDescription(`Either the Twitch API or the Complexity Web Server is having an issue, please try again later.`)
                .setThumbnail(errorThumb)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Streamer List API Error`, err);
                message.channel.send({ embed: charEmbed });
            })

        } else {
            
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setAuthor(`Complexity Streamer`, botAvatar)
                .setTitle(`Complexity Streamer: Permission Error`)
                //.setURL(<url>)
                .setDescription(`You do not have the required role to use the streamerlist command!`)
                .setThumbnail(errorThumb)
                .addField(`Allowed Roles`, allowedRoles, false)
                //.addField(`test`, `test`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `User does not have sufficient privileges to use the streamerlist command.`, message);

            message.reply({ embed: charEmbed });
        }
    },
};