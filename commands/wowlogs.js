const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { warcraftLogsAPIKey } = require('../config.json');

module.exports = {
    name: 'wowlogs',
    aliases: ['warcraftlogs'],
    description: `Displays the last six logging sessions from Warcraft Logs for the provided guild.`,
    args: true,
    usage: '<guildname> <realm> <region>',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {
        
        let logsGuildSpace = args[0].replace(/_/g, '%20');
        let logsRealmHyphen = args[1].replace(/_/g, '-');
        let logsGuildRegion = args[2];

        if (args.length >= 4) {
            return message.channel.send('Either the <realm> or the <guildname> is incorrect!\nIf either of these contain spaces, use an underscore instead.\n\n**Example: **!wowlogs handicap_hangtime aerie_peak us')
        }

        if (logsGuildRegion.length >= 3) {
            return message.channel.send('<region> is incorrect!\n**Valid Regions:** us | eu | kr | cn')
        }

        const warcraftLogsAPI = `https://www.warcraftlogs.com/v1/reports/guild/${logsGuildSpace}/${logsRealmHyphen}/${logsGuildRegion}?api_key=${warcraftLogsAPIKey}`
        let logsAuthorIcon = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Farmoryicon.png?alt=media&token=10abb5be-3322-4546-9eba-ffed91f92688'
        let logsThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fwarcraft_logs_logo.png?alt=media&token=6e8a4407-9f43-495d-b57f-93c5a2176a9a'

        toTitleCase = (str) => {
            return str.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        let logsGuildDisplayName = args[0].replace(/_/g, ' ');
        logsGuildDisplayName = toTitleCase(logsGuildDisplayName)
        let logsRealmDisplayName = args[1].replace(/_/g, ' ');
        logsRealmDisplayName = toTitleCase(logsRealmDisplayName)

        let logsGuildRegionUpper = logsGuildRegion.toUpperCase();

        snekfetch.get(warcraftLogsAPI).then(response => {

            let logs = response.body

            if (logs.length === 0) {
                const charEmbed = new Discord.RichEmbed()
                    .setColor('#FFD700')
                    .setTitle(`__Warcraft Logs__`)
                    //.setURL(<url>)
                    .setAuthor(`<${logsGuildDisplayName}> - ${logsRealmDisplayName} (${logsGuildRegionUpper})`, logsAuthorIcon)
                    .setDescription(`This guild does not use Warcraft Logs.`)
                    .setThumbnail(logsThumbnail)
                    //.addField(`test`, `test`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                message.channel.send({ embed: charEmbed });

            } else {

                let logsArray = logs.slice(1).slice(-6)

                makeDate = (unixTimeStamp) => {
                    return new Date(unixTimeStamp).toLocaleDateString('en-US')
                }

                const charEmbed = new Discord.RichEmbed()
                    .setColor('#FFD700')
                    .setTitle(`__Warcraft Logs__`)
                    //.setURL(<url>)
                    .setAuthor(`<${logsGuildDisplayName}> - ${logsRealmDisplayName} (${logsGuildRegionUpper})`, logsAuthorIcon)
                    .setDescription(`[${makeDate(logsArray[5].start)} - ${logsArray[5].title}](https://www.warcraftlogs.com/reports/${logsArray[5].id})\n[${makeDate(logsArray[4].start)} - ${logsArray[4].title}](https://www.warcraftlogs.com/reports/${logsArray[4].id})\n[${makeDate(logsArray[3].start)} - ${logsArray[3].title}](https://www.warcraftlogs.com/reports/${logsArray[3].id})\n[${makeDate(logsArray[2].start)} - ${logsArray[2].title}](https://www.warcraftlogs.com/reports/${logsArray[2].id})\n[${makeDate(logsArray[1].start)} - ${logsArray[1].title}](https://www.warcraftlogs.com/reports/${logsArray[1].id})\n[${makeDate(logsArray[0].start)} - ${logsArray[0].title}](https://www.warcraftlogs.com/reports/${logsArray[0].id})`)
                    .setThumbnail(logsThumbnail)
                    //.addField(`${logsArray[10].title}`, `[${makeDate(logsArray[10])}](https://www.warcraftlogs.com/reports/${logsArray[10].id})`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                message.channel.send({ embed: charEmbed });
            }

        }).catch(error => {
            console.log(message.author.username, error);

            const charEmbed = new Discord.RichEmbed()
                .setColor('#FFD700')
                .setTitle(`${error.body.error}`)
                //.setURL(<url>)
                .setAuthor(`Warcraft Logs Error`, logsAuthorIcon)
                .setDescription(`*If the <realm> or the <guildname> contain spaces, use an underscore instead.*`)
                .setThumbnail(logsThumbnail)
                .addField(`**Working Example**`, `!wowlogs handicap_hangtime aerie_peak us`, false)
                //.setImage(<imageURL>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.channel.send({ embed: charEmbed });
        })
    },
};