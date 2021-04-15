const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');
const axios = require('axios');

module.exports = {
    name: 'anime',
    aliases: ['animesearch', 'searchanime', 'findanime', 'animefind'],
    description: `Returns the first result from searching the Kitsu.io Anime Database by title.`,
    category: `Guild`,
    args: true,
    usage: '<anime title (english/romanji search)>',
    guildOnly: true,
    cooldown: 10,
    async execute(message, args, botAvatar, db) {

        if (message.channel.id == 821512182826532864) {
            const animeThumb = `https://res.cloudinary.com/complexityguild/image/upload/v1605845267/discord/kitsu.png`;
            const errorThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Ferror.png?alt=media&token=19beee91-6acd-4949-87da-dc2949e68fa1`;

            const allowedRoles = "Guild Member";
            let argJoin = args.join(' ');
            let searchTerm = argJoin.replace(/"/g, '');

            if (searchTerm == '') {
                const charEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setAuthor(`Anime`, botAvatar)
                    .setTitle(`Anime: Search Title Missing!`)
                    //.setURL(<url>)
                    .setDescription(`You did not supply any titles to search for!`)
                    .setThumbnail(errorThumb)
                    .addField(`Working Example`, `!anime cowboy bebop`, false)
                    //.addField(`test`, `test`, false)
                    //.setImage(<image>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                message.reply({ embed: charEmbed });
                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Anime Command missing a title.`, message);
                return
            }

            if (message.member.roles.find(x => x.name === allowedRoles)) {

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Anime Command used.`);

                axios.get(`https://kitsu.io/api/edge/anime?filter%5Btext%5D=${encodeURI(searchTerm)}`).then(res => {
                    
                    let anime = res.data.data[0];

                    const charEmbed = new Discord.RichEmbed()
                        .setColor('#ffffff')
                        .setTitle(`${anime.attributes.titles.en ?? anime.attributes.titles.en_jp} [${anime.attributes.titles.ja_jp}]`)
                        .setURL(anime.links.self.replace('/api/edge', ''))
                        .setAuthor(`Anime`, botAvatar)
                        .setDescription(anime.attributes.description)
                        .addBlankField()
                        .setThumbnail(animeThumb)
                        .addField('Rating', anime.attributes.averageRating, true)
                        .addField('Start Date', anime.attributes.startDate, true)
                        .addField('End Date', anime.attributes.endDate, true)
                        .addField('Age Rating', `${anime.attributes.ageRating} - ${anime.attributes.ageRatingGuide}`, true)
                        .addField('Type', anime.attributes.subtype, true)
                        .addField('Status', anime.attributes.status, true)
                        .addField('Episode Count', anime.attributes.episodeCount, true)
                        .addField('Episode Length', anime.attributes.episodeLength, true)
                        .addField('Total Minutes', anime.attributes.episodeCount * anime.attributes.episodeLength, true)
                        .setImage(anime.attributes.posterImage.tiny, true)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                    DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Anime Searched.`, res);
                    message.channel.send({ embed: charEmbed });

                }).catch(err => {
                    console.log(err)
                    const charEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setAuthor(`Anime`, botAvatar)
                    .setTitle(`Anime Search Error`)
                    .setDescription(`The Kitsu.io API appears to be down. Please try again later.`)
                    .setThumbnail(errorThumb)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                    DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Anime Kitsu API Error`, err);
                    message.channel.send({ embed: charEmbed });
                })

            } else {
                
                const charEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setAuthor(`Anime`, botAvatar)
                    .setTitle(`Anime: Permission Error`)
                    //.setURL(<url>)
                    .setDescription(`You do not have the required role to use the anime command!`)
                    .setThumbnail(errorThumb)
                    .addField(`Allowed Roles`, allowedRoles, false)
                    //.addField(`test`, `test`, false)
                    //.setImage(<image>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `User does not have sufficient privileges to use the Anime command.`, message);

                message.reply({ embed: charEmbed });
            }

        } else {
            
            const charEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setAuthor(`Anime`, botAvatar)
                    .setTitle(`Anime: Wrong Channel!`)
                    //.setURL(<url>)
                    .setDescription(`Please use the #anime channel for this command!`)
                    .setThumbnail(errorThumb)
                    //.addField(`Working Example`, `!anime cowboy bebop`, false)
                    //.addField(`test`, `test`, false)
                    //.setImage(<image>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                message.reply({ embed: charEmbed });
                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Anime Command used in the wrong channel.`, message);
                return
        }
    },
};