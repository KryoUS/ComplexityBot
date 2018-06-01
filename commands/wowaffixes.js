const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
    name: 'wowaffixes',
    aliases: ['wowmythicaffixes', 'wowaffix'],
    description: 'Displays embeded information about the current Mythic Dungeon affixes.',
    args: true,
    usage: '<region>',
    guildOnly: false,
    cooldown: 10,
    async execute(message, args) {

        const raiderIOAPI = `https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=en`
    

        snekfetch.get(raiderIOAPI).then(response => {
            
            let affixes = response.body
            let affixesAuthorIcon = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Farmoryicon.png?alt=media&token=10abb5be-3322-4546-9eba-ffed91f92688'
            let affixesURL = 'https://raider.io'
            let affixesThumbnail = 'https://wow.zamimg.com/images/wow/icons/large/inv_relics_hourglass.jpg'
            let affixesOneName = affixes.affix_details[0].name
            let affixesOneDesc = affixes.affix_details[0].description
            let affixesOneLink = affixes.affix_details[0].wowhead_url
            let affixesTwoName = affixes.affix_details[1].name
            let affixesTwoDesc = affixes.affix_details[1].description
            let affixesTwoLink = affixes.affix_details[1].wowhead_url
            let affixesThreeName = affixes.affix_details[2].name
            let affixesThreeDesc = affixes.affix_details[2].description
            let affixesThreeLink = affixes.affix_details[2].wowhead_url

            const charEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle(`__Mythic+ Affixes__`)
                //.setURL(<url>)
                .setAuthor(`Powered by RaiderIO`, affixesAuthorIcon, affixesURL)
                .setDescription(`This Week's Mythic+ Affixes.`)
                .setThumbnail(affixesThumbnail)
                .addField(`**(4)${affixesOneName}**`, `${affixesOneDesc} [Read More](${affixesOneLink})`)
                .addField(`**(7)${affixesTwoName}**`, `${affixesTwoDesc} [Read More](${affixesTwoLink})`)
                .addField(`**(10)${affixesThreeName}**`, `${affixesThreeDesc} [Read More](${affixesThreeLink})`)
                //.setImage('<ImageURL>')
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.channel.send({ embed: charEmbed });

        }).catch(error => {
            console.log(message.author.username, error);
            message.channel.send('Ensure that the region exists with RaiderIO.')
        })
    },
};