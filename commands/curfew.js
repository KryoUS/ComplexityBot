const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');
const curfew = require('../curfew/curfew');

module.exports = {
    name: 'curfew',
    aliases: [],
    description: `Displays the current curfew hours for Discord Users with a specific Role.`,
    category: `Guild`,
    args: false,
    guildOnly: false,
    cooldown: 60,
    async execute(message, args, botAvatar, db) {
        const clockThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fdigital_clock_icon.png?alt=media&token=56ff341c-a89c-4ab6-baec-178372e33811`
        const errorThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Ferror.png?alt=media&token=19beee91-6acd-4949-87da-dc2949e68fa1`

        let startCurfewObj = curfew.getStartCurfew();
        let endCurfewObj = curfew.getEndCurfew();
        
        //For display purposes, but a zero before minutes that are under ten.
        if (startCurfewObj.minutes < 10) {startCurfewObj.minutes = "0" + startCurfewObj.minutes};
        if (endCurfewObj.minutes < 10) {endCurfewObj.minutes = "0" + endCurfewObj.minutes};

        const curfewEmbed = new Discord.RichEmbed()
            .setColor('#45f542')
            .setTitle(`Show Curfew`)
            //.setURL(<url>)
            .setAuthor(`Curfew`, botAvatar)
            .setDescription(`Curfew hours are currently set to ${startCurfewObj.hour}:${startCurfewObj.minutes} and ${endCurfewObj.hour}:${endCurfewObj.minutes}.`)
            .addBlankField()
            .setThumbnail(clockThumb)
            //.addField(`test`, `test`, false)
            //.setImage(<imageURL>)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

        DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Curfew time requested. Currently between ${startCurfewObj.hour}:${startCurfewObj.minutes} and ${endCurfewObj.hour}:${endCurfewObj.minutes}.`);

        message.channel.send({ embed: curfewEmbed });
    },
};