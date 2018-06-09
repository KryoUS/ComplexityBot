const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { wowAPIKey, warcraftLogsAPIKey } = require('../config.json');

module.exports = {
    name: 'wowguild',
    aliases: ['wowguildinfo', 'wowclan', 'wowclaninfo'],
    description: `Displays embeded information about a World of Warcraft guild.`,
    category: `World of Warcraft`,
    args: true,
    usage: '<guild_name> <realm_name> <region>',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {
        
        let guildNameAPI = args[0].replace(/_/g, '%20');
        let guildRealmAPI = args[1].replace(/_/g, '%20');
        let guildNameWowProg = args[0].replace(/_/g, '+');
        let guildRealmWowProg = args[1].replace(/_/g, '-');
        guildRealmWowProg = guildRealmWowProg.replace(/'/g, '');
        let guildNameWarcraftLogsAPI = args[0].replace(/_/g, '-');
        let guildRegion = args[2];

        if (args.length >= 4) {
            return message.channel.send('Either the <realm> or the <guildname> is incorrect!\nIf either of these contain spaces, use an underscore instead.\n**Example: **aerie_peak')
        }

        if (guildRegion.length >= 3) {
            return message.channel.send('<region> is incorrect!\n**Valid Regions:** us | eu | kr | cn')
        }

        const wowGuildMembersAPI = `https://${guildRegion}.api.battle.net/wow/guild/${guildRealmAPI}/${guildNameAPI}?fields=members&locale=en_${guildRegion}&apikey=${wowAPIKey}`
        const raiderIOGuildAPI = `https://raider.io/api/v1/guilds/profile?region=${guildRegion}&realm=${guildRealmAPI}&name=${guildNameAPI}&fields=raid_progression%2Craid_rankings`
        const warcraftLogsAPI = `https://www.warcraftlogs.com/v1/reports/guild/${guildNameAPI}/${guildRealmWowProg}/${guildRegion}?api_key=${warcraftLogsAPIKey}`

        snekfetch.get(wowGuildMembersAPI).then(response => {
            
            let guild = response.body
            let guildAuthorIcon = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Farmoryicon.png?alt=media&token=10abb5be-3322-4546-9eba-ffed91f92688'
            let guildFactionThumbnail = ''
            let guildRegionUpper = guildRegion.toUpperCase();
            let guildArmoryRegion = '';
            let guildLeaderName = ''
            let guildLeaderRealm = ''
            let guildLeaderLvl = ''
            let guildMemberCount = guild.members.length
            if (guild.side === 0) {
                guildFactionThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Falliance_logo.png?alt=media&token=8c187ad6-497e-4876-862d-bf066c43b932'
            } else if (guild.side === 1) {
                guildFactionThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fhorde_logo.png?alt=media&token=69778577-5ff0-40ce-943e-acb22f8b62ff'
            }
            
            if (guildRegion === 'us') {
                guildArmoryRegion = 'en-us'
            } else if (guildRegion === 'eu') {
                guildArmoryRegion = 'en-gb'
            }

            let guildofficersArray = []
            for (i=0;i<guildMemberCount;i++) {
                if (guild.members[i].rank === 0) {
                    guildLeaderName = guild.members[i].character.name
                    guildLeaderRealm = guild.members[i].character.realm.replace(/ /g, '-');
                    guildLeaderLvl = guild.members[i].character.level
                }
                if (guild.members[i].rank === 1) {
                    guildOfficersRealm = guild.members[i].character.realm.replace(/ /g, '-');
                    guildofficersArray.push(`[${guild.members[i].character.name}](https://worldofwarcraft.com/${guildArmoryRegion}/character/${guildOfficersRealm}/${guild.members[i].character.name}), `)
                }
            }

            let guildOfficers = ``
            if (guildofficersArray.length <= 10) {
                for (j=0;j<guildofficersArray.length;j++) {
                    guildOfficers += guildofficersArray[j]
                }
                guildOfficers = guildOfficers.slice(0, -2)
            } else {
                for (j=0;j<10;j++) {
                    guildOfficers += guildofficersArray[j]
                }
                guildOfficers = guildOfficers.slice(0, -2)
                guildOfficers += '...'
            }

            snekfetch.get(raiderIOGuildAPI).then(response => {

                let rIOGuild = response.body                

                //Begin Guild Progression
                let guildProgression = response.body.raid_progression
                //Emerald Nightmare
                let guildProg1Raid = 'Emerald Nightmare'
                let guildProg1Summary = guildProgression["the-emerald-nightmare"].summary
                //Trial of Valor
                let guildProg2Raid = 'Trial of Valor'
                let guildProg2Summary = guildProgression["trial-of-valor"].summary
                //The Nighthold
                let guildProg3Raid = 'The Nighthold'
                let guildProg3Summary = guildProgression["the-nighthold"].summary
                //Tomb of Sargeras
                let guildProg4Raid = 'Tomb of Sargeras'
                let guildProg4Summary = guildProgression["tomb-of-sargeras"].summary
                //Antorus the Burning Throne
                let guildProg5Raid = 'Antorus the Burning Throne'
                let guildProg5Summary = guildProgression["antorus-the-burning-throne"].summary

                //Begin Guild Rankings
                let guildRanking = response.body.raid_rankings
                //Antorus the Burning Throne
                let guildRanking5Raid = 'Antorus the Burning Throne'
                let guildRanking5NormalWorld = guildRanking["antorus-the-burning-throne"].normal.world
                let guildRanking5NormalRegion = guildRanking["antorus-the-burning-throne"].normal.region
                let guildRanking5NormalRealm = guildRanking["antorus-the-burning-throne"].normal.realm
                let guildRanking5HeroicWorld = guildRanking["antorus-the-burning-throne"].heroic.world
                let guildRanking5HeroicRegion = guildRanking["antorus-the-burning-throne"].heroic.region
                let guildRanking5HeroicRealm = guildRanking["antorus-the-burning-throne"].heroic.realm
                let guildRanking5MythicWorld = guildRanking["antorus-the-burning-throne"].mythic.world
                let guildRanking5MythicRegion = guildRanking["antorus-the-burning-throne"].mythic.region
                let guildRanking5MythicRealm = guildRanking["antorus-the-burning-throne"].mythic.realm

                let guildArmory = `http://${guildRegion}.battle.net/wow/en/guild/${guildRealmAPI}/${guildNameAPI}/`
                let guildRaiderIO = rIOGuild.profile_url
                let guildWoWProg = `https://www.wowprogress.com/guild/${guildRegion}/${guildRealmWowProg}/${guildNameWowProg}`

                snekfetch.get(warcraftLogsAPI).then(response => {

                    let guildWarcraftLogs = ''

                    if (response.body.length != 0) {
                        let guildWLIndex = response.body.length-1;
                        let guildWarcraftLogRecent = response.body[guildWLIndex].id;
                        guildWarcraftLogs = ` | [WarcraftLogs: Most Recent Log](https://www.warcraftlogs.com/reports/${guildWarcraftLogRecent})`
                    }

                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#FFD700')
                        .setTitle(`<${guild.name}> - ${guild.realm} (${guildRegionUpper})`)
                        //.setURL(<url>)
                        .setAuthor(`World of Warcraft Guild Search`, guildAuthorIcon)
                        //.setDescription(`<Desc>`)
                        .setThumbnail(guildFactionThumbnail)
                        .addField(`__Guild Master__`, `[${guildLeaderName}](https://worldofwarcraft.com/${guildArmoryRegion}/character/${guildLeaderRealm}/${guildLeaderName})`, true)
                        .addField(`__Officers__`, guildOfficers, true)
                        .addField(`__Characters__`, `${guildMemberCount}`, true)
                        .addField(`__Progression__`,`**EN:** ${guildProg1Summary}  **ToV:** ${guildProg2Summary}  **NH:** ${guildProg3Summary}  **ToS:** ${guildProg4Summary}  **ABT:** ${guildProg5Summary}`, false)
                        .addField(`__Antorus the Burning Throne__`,`RaiderIO Ranking.\n**Normal** - **Realm:** ${guildRanking5NormalRealm}  **Region:** ${guildRanking5NormalRegion}  **World:** ${guildRanking5NormalWorld}\n**Heroic** - **Realm:** ${guildRanking5HeroicRealm}  **Region:** ${guildRanking5HeroicRegion}  **World:** ${guildRanking5HeroicWorld}\n**Mythic** - **Realm:** ${guildRanking5MythicRealm}  **Region:** ${guildRanking5MythicRegion}  **World:** ${guildRanking5MythicWorld}`, false)
                        .addField('__External Sites__', `[Armory](${guildArmory}) | [RaiderIO](${guildRaiderIO}) | [WoWProgress](${guildWoWProg})${guildWarcraftLogs}`, false)
                        //.setImage(<imageURL>)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                    message.channel.send({ embed: charEmbed });

                }).catch(error => {
                    console.log(message.author.username, error);
                    message.channel.send(error.body.reason)
                    message.channel.send('Either the <realm> or the <guildname> is incorrect!\nIf either of these contain spaces, use an underscore instead.\n**Example: **aerie_peak')
                })

            }).catch(error => {
                console.log(message.author.username, error);
                message.channel.send(error.body.reason)
                message.channel.send('Either the <realm> or the <guildname> is incorrect!\nIf either of these contain spaces, use an underscore instead.\n**Example: **aerie_peak')
            })

        }).catch(error => {
            console.log(message.author.username, error);
            let displayError = `Either the <realm> or the <guildname> is incorrect!\nIf either of these contain spaces, use an underscore instead.\n\n**Example: **!guild handicap_hangtime aerie_peak us`
            if (error.body.reason) {
                displayError = `${error.body.reason}\nOr the <realm>/<guildname> is incorrect!\nIf they contain spaces, use an underscore instead.\n\n**Example: **!guild handicap_hangtime aerie_peak us`
            }
            message.channel.send(displayError)
        })
    },
};