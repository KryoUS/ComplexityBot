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
        
        //Manipulate arguments for various locales, APIs, and external links.
        let guildNameAPI = args[0].replace(/_/g, '%20');
        let guildRealmAPI = args[1].replace(/_/g, '%20');
        let guildNameWowProg = args[0].replace(/_/g, '+');
        let guildRealmWowProg = args[1].replace(/_/g, '-');
        guildRealmWowProg = guildRealmWowProg.replace(/'/g, '');
        let guildRegion = args[2];

        const wowGuildMembersAPI = `https://${guildRegion}.api.battle.net/wow/guild/${guildRealmAPI}/${guildNameAPI}?fields=members&locale=en_${guildRegion}&apikey=${wowAPIKey}`
        const raiderIOGuildAPI = `https://raider.io/api/v1/guilds/profile?region=${guildRegion}&realm=${guildRealmAPI}&name=${guildNameAPI}&fields=raid_progression%2Craid_rankings`
        const warcraftLogsAPI = `https://www.warcraftlogs.com/v1/reports/guild/${guildNameAPI}/${guildRealmWowProg}/${guildRegion}?api_key=${warcraftLogsAPIKey}`
        
        const errorThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Ferror.png?alt=media&token=19beee91-6acd-4949-87da-dc2949e68fa1`
        const guildAuthorIcon = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Farmoryicon.png?alt=media&token=10abb5be-3322-4546-9eba-ffed91f92688'

        //Ensure that a space wasn't used for a guild name or realm name.
        if (args.length >= 4) {

            const charEmbed = new Discord.RichEmbed()
                .setColor('#ff1000')
                .setAuthor(`World of Warcraft Guild Search`, guildAuthorIcon)
                .setTitle(`Error`)
                .setDescription(`Too many variables! It is likely that you forgot to use an underscore for spaces in guild and/or realm names.`)
                .setThumbnail(errorThumb)
                .addField(`Working Examples`, `!wowguild complexity thunderlord us\n!wowguild handicap_hangtime aerie_peak us\n!wowguild method tarren_mill eu`, false)
                .addField(`Supported Regions`, `At this time, only US and EU regions are supported due to language locales.`, false)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            return message.reply({ embed: charEmbed });
        }

        //Ensure that the region is one of the two supported regions.
        if (!guildRegion == 'us' || !guildRegion == 'eu') {

            const charEmbed = new Discord.RichEmbed()
                .setColor('#ff1000')
                .setAuthor(`World of Warcraft Guild Search`, guildAuthorIcon)
                .setTitle(`Error`)
                .setDescription(`Invalid region!`)
                .setThumbnail(errorThumb)
                .addField(`Supported Regions`, `At this time, only US and EU regions are supported due to language locales.`, false)
                .addField(`Working Examples`, `!wowguild complexity thunderlord us\n!wowguild handicap_hangtime aerie_peak us\n!wowguild method tarren_mill eu`, false)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            return message.reply({ embed: charEmbed });
        }

        //Blizzard API (Requires registration.) https://dev.battle.net/docs
        snekfetch.get(wowGuildMembersAPI).then(response => {
            let guild = response.body
            let guildFactionThumbnail = ''
            let guildRegionUpper = guildRegion.toUpperCase();
            let guildArmoryRegion = ''
            let guildLeaderName = ''
            let guildLeaderRealm = ''
            let guildMemberCount = guild.members.length
            //Set thumbnail for Horde or Alliance
            if (guild.side === 0) {
                guildFactionThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Falliance_logo.png?alt=media&token=8c187ad6-497e-4876-862d-bf066c43b932'
            } else if (guild.side === 1) {
                guildFactionThumbnail = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fhorde_logo.png?alt=media&token=69778577-5ff0-40ce-943e-acb22f8b62ff'
            }
            //Set WoW Armory locale
            if (guildRegion === 'us') {
                guildArmoryRegion = 'en-us'
            } else if (guildRegion === 'eu') {
                guildArmoryRegion = 'en-gb'
            }

            //Begin building an array for the Guild Officers and variables for the Guild Master
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

            //Create a variable for a maximum of 10 Officers that have Armory links and will be in the end Embed.
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

            //Raider IO API (No account required.) https://raider.io/api
            snekfetch.get(raiderIOGuildAPI).then(response => {
                
                let rIOGuild = response.body //response.body shorthand

                //Begin Guild Progression
                // TODO: Modify this to build itself from the response.
                let guildProgression = response.body.raid_progression
                //Emerald Nightmare
                let guildProg1Summary = guildProgression["the-emerald-nightmare"].summary
                //Trial of Valor
                let guildProg2Summary = guildProgression["trial-of-valor"].summary
                //The Nighthold
                let guildProg3Summary = guildProgression["the-nighthold"].summary
                //Tomb of Sargeras
                let guildProg4Summary = guildProgression["tomb-of-sargeras"].summary
                //Antorus the Burning Throne
                let guildProg5Summary = guildProgression["antorus-the-burning-throne"].summary

                //Begin Guild Rankings
                let guildRanking = response.body.raid_rankings
                //Antorus the Burning Throne
                let guildRanking5NormalWorld = guildRanking["antorus-the-burning-throne"].normal.world
                let guildRanking5NormalRegion = guildRanking["antorus-the-burning-throne"].normal.region
                let guildRanking5NormalRealm = guildRanking["antorus-the-burning-throne"].normal.realm
                let guildRanking5HeroicWorld = guildRanking["antorus-the-burning-throne"].heroic.world
                let guildRanking5HeroicRegion = guildRanking["antorus-the-burning-throne"].heroic.region
                let guildRanking5HeroicRealm = guildRanking["antorus-the-burning-throne"].heroic.realm
                let guildRanking5MythicWorld = guildRanking["antorus-the-burning-throne"].mythic.world
                let guildRanking5MythicRegion = guildRanking["antorus-the-burning-throne"].mythic.region
                let guildRanking5MythicRealm = guildRanking["antorus-the-burning-throne"].mythic.realm

                //External Links
                let guildArmory = `http://${guildRegion}.battle.net/wow/en/guild/${guildRealmAPI}/${guildNameAPI}/`
                let guildRaiderIO = rIOGuild.profile_url
                let guildWoWProg = `https://www.wowprogress.com/guild/${guildRegion}/${guildRealmWowProg}/${guildNameWowProg}`

                //WarcraftLogs API (Requires registration.) https://www.warcraftlogs.com/v1/docs
                snekfetch.get(warcraftLogsAPI).then(response => {

                    //Check for any logs
                    let guildWarcraftLogs = ''
                    if (response.body.length != 0) {
                        let guildWLIndex = response.body.length-1;
                        let guildWarcraftLogRecent = response.body[guildWLIndex].id;
                        guildWarcraftLogs = ` | [WarcraftLogs: Most Recent Log](https://www.warcraftlogs.com/reports/${guildWarcraftLogRecent})`
                    }

                    //Create embed
                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#FFD700')
                        .setTitle(`<${guild.name}> - ${guild.realm} (${guildRegionUpper})`)
                        .setAuthor(`World of Warcraft Guild Search`, guildAuthorIcon)
                        .setThumbnail(guildFactionThumbnail)
                        .addField(`__Guild Master__`, `[${guildLeaderName}](https://worldofwarcraft.com/${guildArmoryRegion}/character/${guildLeaderRealm}/${guildLeaderName})`, true)
                        .addField(`__Officers__`, guildOfficers, true)
                        .addField(`__Characters__`, `${guildMemberCount}`, true)
                        .addField(`__Progression__`,`**EN:** ${guildProg1Summary}  **ToV:** ${guildProg2Summary}  **NH:** ${guildProg3Summary}  **ToS:** ${guildProg4Summary}  **ABT:** ${guildProg5Summary}`, false)
                        .addField(`__Antorus the Burning Throne__`,`RaiderIO Ranking.\n**Normal** - **Realm:** ${guildRanking5NormalRealm}  **Region:** ${guildRanking5NormalRegion}  **World:** ${guildRanking5NormalWorld}\n**Heroic** - **Realm:** ${guildRanking5HeroicRealm}  **Region:** ${guildRanking5HeroicRegion}  **World:** ${guildRanking5HeroicWorld}\n**Mythic** - **Realm:** ${guildRanking5MythicRealm}  **Region:** ${guildRanking5MythicRegion}  **World:** ${guildRanking5MythicWorld}`, false)
                        .addField('__External Sites__', `[Armory](${guildArmory}) | [RaiderIO](${guildRaiderIO}) | [WoWProgress](${guildWoWProg})${guildWarcraftLogs}`, false)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
                    
                    //Send Embed
                    message.channel.send({ embed: charEmbed });

                }).catch(error => {
                    //Warcraft Logs API Failed
                    console.log(`${message.author.username} - WarcraftLogs API Failed! `, error);

                    //Create a default Error or use the returned one
                    let errorReason = `Unknown Error`;
                    if (error.body) {
                        errorReason = error.body.reason;
                    }
                    
                    //Create WarcraftLogs Error Embed
                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#ff1000')
                        .setAuthor(`World of Warcraft Guild Search`, guildAuthorIcon)
                        .setTitle(`Error`)
                        .setDescription(errorReason)
                        .setThumbnail(errorThumb)
                        .addField(`Working Examples`, `!wowguild complexity thunderlord us\n!wowguild handicap_hangtime aerie_peak us\n!wowguild method tarren_mill eu`, false)
                        .addField(`Supported Regions`, `At this time, only US and EU regions are supported due to language locales.`, false)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
                    
                    //Send WarcraftLogs Error Embed
                    message.reply({ embed: charEmbed });
                })

            }).catch(error => {
                //RaiderIO API Failed
                console.log(`${message.author.username} - RaiderIO API Failed! `, error);
                
                //Create a default Error or use the returned one
                let errorReason = `Unknown Error`;
                if (error.body) {
                    errorReason = error.body.reason;
                }

                //Create RaiderIO Error Embed
                const charEmbed = new Discord.RichEmbed()
                    .setColor('#ff1000')
                    .setAuthor(`World of Warcraft Guild Search`, guildAuthorIcon)
                    .setTitle(`Error`)
                    .setDescription(errorReason)
                    .setThumbnail(errorThumb)
                    .addField(`Working Examples`, `!wowguild complexity thunderlord us\n!wowguild handicap_hangtime aerie_peak us\n!wowguild method tarren_mill eu`, false)
                    .addField(`Supported Regions`, `At this time, only US and EU regions are supported due to language locales.`, false)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                //Send RaiderIO Error Embed
                message.reply({ embed: charEmbed });
            })

        }).catch(error => {
            //Blizzard API Failed
            console.log(message.author.username, error);

            //Create a default Error or use the returned one
            let errorReason = `Unknown Error`;
            if (error.body) {
                errorReason = error.body.reason;
            }

            //Create Blizzard API Error Embed
            const charEmbed = new Discord.RichEmbed()
                .setColor('#ff1000')
                .setAuthor(`World of Warcraft Guild Search`, guildAuthorIcon)
                .setTitle(`Error`)
                .setDescription(errorReason)
                .setThumbnail(errorThumb)
                .addField(`Working Examples`, `!wowguild complexity thunderlord us\n!wowguild handicap_hangtime aerie_peak us\n!wowguild method tarren_mill eu`, false)
                .addField(`Supported Regions`, `At this time, only US and EU regions are supported due to language locales.`, false)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            //Send Blizzard API Error Embed
            message.reply({ embed: charEmbed });
        })
    },
};