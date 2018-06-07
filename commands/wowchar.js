const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { wowAPIKey } = require('../config.json');

module.exports = {
    name: 'wowchar',
    aliases: ['wowcharacterinfo', 'wowtoon', 'wowtooninfo', 'wowcharinfo', 'warcraftchar', 'warcrafttoon'],
    description: 'Displays embeded information about a World of Warcraft character.',
    args: true,
    usage: '<charname> <realm> <region>',
    guildOnly: false,
    cooldown: 10,
    async execute(message, args) {

        let charRealmSpace = args[1].replace(/_/g, '%20');
        let charRealmHyphen = args[1].replace(/_/g, '-');
        let charRegion = args[2].toLowerCase();

        if (args.length >= 4) {
            return message.channel.send('The <realm> is incorrect!\nIf it contains spaces, use an underscore instead.\n**Example: **aerie_peak')
        }

        if (charRegion.length >= 3) {
            return message.channel.send('<region> is incorrect!\n**Valid Regions:** us | eu | kr | cn')
        }

        if (charRegion == 'us') {
            charArmoryRegion = 'en-us'
        } else if (charRegion == 'eu') {
            charArmoryRegion = 'en-gb'
        }

        const raiderIOAPI = `https://raider.io/api/v1/characters/profile?region=${charRegion}&realm=${charRealmSpace}&name=${args[0]}&fields=gear%2Craid_progression%2Cmythic_plus_scores%2Cmythic_plus_best_runs`
        const wowStatsAPI = `https://${charRegion}.api.battle.net/wow/character/${charRealmSpace}/${args[0]}?fields=stats%2Cpvp&locale=en_${charRegion}&apikey=${wowAPIKey}`
        const wowProgress = `https://www.wowprogress.com/character/${charRegion}/${charRealmHyphen}/${args[0]}`
        const warcraftLogs = `https://www.warcraftlogs.com/character/${charRegion}/${charRealmHyphen}/${args[0]}`
        let url = `https://worldofwarcraft.com/${charArmoryRegion}/character/${charRealmHyphen}/${args[0]}`


        msToTime = duration => {
            var milliseconds = parseInt((duration%1000)/100)
                , seconds = parseInt((duration/1000)%60)
                , minutes = parseInt((duration/(1000*60))%60)
                , hours = parseInt((duration/(1000*60*60))%24);
    
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
    
            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        }

        snekfetch.get(raiderIOAPI).then(response => {
            
            let title = response.body.realm + ' | ' + response.body.region.toUpperCase() + ' | ' + response.body.active_spec_name + ' ' + response.body.class + ' | ' + response.body.gear.item_level_equipped + ' ilvl'
            let raiderIOURL = response.body.profile_url
            let thumbnail = response.body.thumbnail_url
            let author = response.body.name
            let authorIcon = 'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Farmoryicon.png?alt=media&token=10abb5be-3322-4546-9eba-ffed91f92688'
            let raidProgression = response.body.raid_progression
            let raidNH = raidProgression["the-nighthold"].summary
            let raidToS = raidProgression["tomb-of-sargeras"].summary
            let raidABT = raidProgression["antorus-the-burning-throne"].summary
            let normalRaidKills = 0;
            let heroicRaidKills = 0;
            let mythicRaidKills = 0;
            for (x in raidProgression) {
                    normalRaidKills += raidProgression[x].normal_bosses_killed
                    heroicRaidKills += raidProgression[x].heroic_bosses_killed
                    mythicRaidKills += raidProgression[x].mythic_bosses_killed
            }

            let mythicScoreDPS = response.body.mythic_plus_scores.dps
            let mythicScoreHealer = response.body.mythic_plus_scores.healer
            let mythicScoreTank = response.body.mythic_plus_scores.tank
            
            let mythicBest = '';

            //Check for Mythic Best array [0]
            let mythicBestOne = response.body.mythic_plus_best_runs[0]
            if (mythicBestOne) {
                let mythicBestOneLevel = mythicBestOne.mythic_level
                let mythicBestOneShortName = mythicBestOne.short_name
                let mythicBestOneClearTime = msToTime(mythicBestOne.clear_time_ms)
                mythicBest=`+${mythicBestOneLevel} - ${mythicBestOneShortName} - *${mythicBestOneClearTime}*`
            } else {
                mythicBest=`\nnone`
            }
            
            //Check for Mythic Best array [1]
            let mythicBestTwo = response.body.mythic_plus_best_runs[1]
            if (mythicBestTwo) {
                let mythicBestTwoLevel = mythicBestTwo.mythic_level
                let mythicBestTwoShortName = mythicBestTwo.short_name
                let mythicBestTwoClearTime = msToTime(mythicBestTwo.clear_time_ms)
                mythicBest+=`\n+${mythicBestTwoLevel} - ${mythicBestTwoShortName} - *${mythicBestTwoClearTime}*`
            } else {
                mythicBest+=`\nnone`
            }

            //Check for Mythic Best array [2]
            let mythicBestThree = response.body.mythic_plus_best_runs[2]
            if (mythicBestThree) {
                let mythicBestThreeLevel = mythicBestThree.mythic_level
                let mythicBestThreeShortName = mythicBestThree.short_name
                let mythicBestThreeClearTime = msToTime(mythicBestThree.clear_time_ms)
                mythicBest+=`\n+${mythicBestThreeLevel} - ${mythicBestThreeShortName} - *${mythicBestThreeClearTime}*`
            } else {
                mythicBest+=`\nnone`
            }

            snekfetch.get(wowStatsAPI).then(wowResponse => {

                let charHealth = wowResponse.body.stats.health
                let charCrit = wowResponse.body.stats.crit
                charCrit = Math.round(charCrit)
                let charHaste = wowResponse.body.stats.hasteRatingPercent
                charHaste = Math.round(charHaste)
                let charMastery = wowResponse.body.stats.mastery
                charMastery = Math.round(charMastery)

                let charPVPArena2s = wowResponse.body.pvp.brackets.ARENA_BRACKET_2v2.rating
                let charPVPArena3s = wowResponse.body.pvp.brackets.ARENA_BRACKET_3v3.rating
                let charPVPRBG = wowResponse.body.pvp.brackets.ARENA_BRACKET_RBG.rating
                let charAchievementPoint = wowResponse.body.achievementPoints


                const charEmbed = new Discord.RichEmbed()
                    .setColor('#FFD700')
                    .setTitle(title)
                    //.setURL(url)
                    .setAuthor(author, authorIcon, url)
                    //.setDescription('Some description here')
                    .setThumbnail(thumbnail)
                    .addField('__Character Stats__', `**Health:** ${charHealth} **Crit:** ${charCrit}% **Haste:** ${charHaste}% **Mastery:** ${charMastery}%`)
                    //.addBlankField()
                    .addField('__Legion Raid Progression__', `**NH:** ${raidNH}\n**ToS:** ${raidToS}\n**ABT:** ${raidABT}`, true)
                    .addField('__Legion Boss Kills__', `**N:** ${normalRaidKills}\n**H:** ${heroicRaidKills}\n**M:** ${mythicRaidKills}`, true)
                    .addField('__M+ Score__', `**DPS:** ${mythicScoreDPS}\n**Healer:** ${mythicScoreHealer}\n**Tank:** ${mythicScoreTank}`, true)
                    .addField('__Best M+ Dungeon__', mythicBest, true)
                    .addField('__PVP__', `**2v2:** ${charPVPArena2s}\n**3v3:** ${charPVPArena3s}\n**RBG:** ${charPVPRBG}`, true)
                    .addField('__Achievement Points__', charAchievementPoint, true)
                    .addField('__External Sites__', `[Armory](${url}) | [RaiderIO](${raiderIOURL}) | [WoWProgress](${wowProgress}) | [WarcraftLogs](${warcraftLogs})`, true)
                    //.setImage('https://i.imgur.com/wSTFkRM.png')
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                message.channel.send({ embed: charEmbed });
            }).catch(wowerror => {
                console.log(message.author.username, wowerror);
                message.channel.send('Check the spelling of the name and realm, then try again.')
            })

        }).catch(error => {
            console.log(message.author.username,error);
            let displayError = `Either the character doesn't exist, it was typoed, or the <realm> is incorrect!\nIf the <realm> contains spaces, use an underscore instead.\n\n**Example: **!char rachel aerie_peak us`
            if (error.body.message) {
                displayError = `${error.body.message}.\nCheck the character name!\nIf the <realm> contains spaces, use an underscore instead.\n\n**Example: **!char rachel aerie_peak us`
            }
            message.channel.send(displayError)
        })
    },
};