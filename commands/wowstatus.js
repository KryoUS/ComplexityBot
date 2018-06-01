const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { wowAPIKey } = require('../config.json');

module.exports = {
    name: 'wowstatus',
    aliases: ['wowrealmstatus', 'wowserverstatus'],
    description: `Displays embeded information about a realm's status.`,
    args: true,
    usage: '<realm> <region>',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {

        const wowRealmStatusAPI = `https://${args[1]}.api.battle.net/wow/realm/status?locale=en_${args[1]}&apikey=${wowAPIKey}`

        snekfetch.get(wowRealmStatusAPI).then(response => {
            
            let statusAuthorIcon = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Farmoryicon.png?alt=media&token=10abb5be-3322-4546-9eba-ffed91f92688'
            let affixesThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fserver_status_false.png?alt=media&token=0d9b5b01-20f5-4bbd-acd8-839e96d0ae6e'
            let realmStatus = response.body.realms
            let realm = realmStatus.find(function (obj) {
                return obj.slug === args[0]
            })
            
            if (realm.status === true) {
                affixesThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fserver_status.png?alt=media&token=0258fbe1-53e2-474d-beea-543513577d9b'
            }
            if (realm.queue === true) {
                affixesThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fserver_status_queue.png?alt=media&token=9c1c0793-f40e-4a30-8caa-23dc1d1ba69b'
            }

            const charEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle(`__${realm.name}__`)
                //.setURL(<url>)
                .setAuthor(`Realm Status`, statusAuthorIcon)
                //.setDescription(`<Desc>`)
                .setThumbnail(affixesThumbnail)
                .addField(`Server Live`, `${realm.status}`, true)
                .addField(`Server Queue`, `${realm.queue}`, true)
                .addField(`Server Type`, `${realm.type}`, true)
                .addField(`Population`, `${realm.population}`, true)
                .addField(`Battlegroup`, `${realm.battlegroup}`, true)
                .addField(`Server Timezone`, `${realm.timezone}`, true)
                //.setImage('<ImageURL>')
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.channel.send({ embed: charEmbed });

        }).catch(error => {
            console.log(message.author.username, error);
            message.channel.send('Either the <realm> or the <region> is incorrect!\nEnsure that the realm was entered correctly and that the <region> only has two letters.\n**Valid Regions:** us | eu | kr | cn')
        })
    },
};