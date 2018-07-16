const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
    name: 'wowaffixes',
    aliases: ['wowmythicaffixes', 'wowaffix'],
    description: 'Displays embeded information about the current Mythic Dungeon affixes.',
    category: `World of Warcraft`,
    args: true,
    usage: '<region>',
    guildOnly: false,
    cooldown: 10,
    async execute(message, args, botAvatar) {

        //Firebase thumbnails
        const affixesAuthorIcon = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Farmoryicon.png?alt=media&token=10abb5be-3322-4546-9eba-ffed91f92688'
        const errorThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Ferror.png?alt=media&token=19beee91-6acd-4949-87da-dc2949e68fa1`

        //Ensure the region is defined and allowed
        //TODO: This isn't working and we're hitting the API needlessly
        let region = args[0];
        if (region != 'us' && region != 'eu' && region != 'kr' && region != 'cn' && region != 'tw') {

            //Create Error Embed
            const errorEmbed = new Discord.RichEmbed()
                .setColor('#ff1000')
                .setAuthor(`Mythic+ Affixes`, affixesAuthorIcon)
                .setTitle(`Error`)
                .setDescription(`${region} is not a valid region!`)
                .setThumbnail(errorThumb)
                .addField(`Supported Regions`, `The following Regions are supported; US, EU, KR, CN, or TW.`, false)
                .addField(`Working Examples`, `!wowaffixes us\n!wowaffixes eu\n!wowaffixes kr\n!wowaffixes cn\n!wowaffixes tw`, false)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
            
            //Send Error Embed
            return message.reply({ embed: errorEmbed });
        }

        //Define RaiderIO API link
        const raiderIOAPI = `https://raider.io/api/v1/mythic-plus/affixes?region=${region}&locale=en`

        //RaiderIO API (No registration.) https://raider.io/api
        snekfetch.get(raiderIOAPI).then(response => {
            
            //Set variables for embed
            let affixes = response.body
            let affixesURL = 'https://raider.io'
            let affixesThumbnail = 'https://wow.zamimg.com/images/wow/icons/large/inv_relics_hourglass.jpg'
            //TODO: Create array loop to do this!
            let affixesOneName = affixes.affix_details[0].name
            let affixesOneDesc = affixes.affix_details[0].description
            let affixesOneLink = affixes.affix_details[0].wowhead_url
            let affixesTwoName = affixes.affix_details[1].name
            let affixesTwoDesc = affixes.affix_details[1].description
            let affixesTwoLink = affixes.affix_details[1].wowhead_url
            let affixesThreeName = affixes.affix_details[2].name
            let affixesThreeDesc = affixes.affix_details[2].description
            let affixesThreeLink = affixes.affix_details[2].wowhead_url

            let capRegion = region.toUpperCase();

            //Create Embed
            const charEmbed = new Discord.RichEmbed()
                .setColor('#FFD700')
                .setTitle(`Mythic+ Affixes - ${capRegion}`)
                .setAuthor(`Powered by RaiderIO`, affixesAuthorIcon, affixesURL)
                .setDescription(`This Week's Mythic+ Affixes.`)
                .setThumbnail(affixesThumbnail)
                .addField(`**(4) ${affixesOneName}**`, `${affixesOneDesc}\n[Read More](${affixesOneLink})`)
                .addField(`**(7) ${affixesTwoName}**`, `${affixesTwoDesc}\n[Read More](${affixesTwoLink})`)
                .addField(`**(10) ${affixesThreeName}**`, `${affixesThreeDesc}\n[Read More](${affixesThreeLink})`)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            //Send Embed 
            message.channel.send({ embed: charEmbed });

        }).catch(error => {
            //Raider IO API Failure!
            console.log(`${message.author.username} - RaiderIO API failed! `, error);
            
            //Create a default Error or use the returned one
            let errorReason = `Unknown Error`;
            if (error.body) {
                errorReason = error.body.message;
            }

            //Create Error Embed
            const apiErrorEmbed = new Discord.RichEmbed()
                .setColor('#ff1000')
                .setAuthor(`Mythic+ Affixes`, affixesAuthorIcon)
                .setTitle(`Error`)
                .setDescription(errorReason)
                .setThumbnail(errorThumb)
                .addField(`Supported Regions`, `The following Regions are supported; US, EU, KR, CN, or TW.`, false)
                .addField(`Working Examples`, `!wowaffixes us\n!wowaffixes eu\n!wowaffixes kr\n!wowaffixes cn\n!wowaffixes tw`, false)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
            
            //Send Error Embed
            message.reply({ embed: apiErrorEmbed });
        })
    },
};