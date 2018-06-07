const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { hearthstoneKey } = require('../config.json');

module.exports = {
    name: 'hscard',
    aliases: ['cardsearch', 'hscardsearch', 'hscards', 'hearthstone', 'card'],
    description: `Displays the closest matching Hearthstone card.`,
    args: true,
    usage: '<card name>',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {
        message.reply('Fetching card data...').then(msg => {
            let searchText = args.join(' ')
            let hearthPwnSearch = args.join('+')

            const hearthstoneAPI = `https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${searchText}`
            const hearthstoneIcon = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2FhearthstoneLogo.png?alt=media&token=e13cbb22-44b4-40ba-8414-61de0dfec79d`
            
            snekfetch.get(hearthstoneAPI, {headers: {'X-Mashape-Key': hearthstoneKey}}).then(response => {
                let card = response.body[response.body.length-1]
                let cardInfo = ''

                capitalize = (letter) => {
                    return letter[0].toUpperCase() + letter.slice(1);
                }
    
                getCardInfo = (obj) => {
                    for (key in obj) {
                        if (!['img', 'imgGold', 'text', 'flavor', 'name', 'cardId', 'dbfId', 'locale', 'mechanics', 'collectible'].includes(key)) {
                            let capKey = key.replace(/([A-Z])/g, ' $1')
                            capKey = capitalize(capKey)
                            cardInfo+=`**${capKey}:** ${obj[key]}\n`
                        }
                    }
                }

                removeFormatting = (x) => {
                    return x.replace(/\\n/g, " ").replace(/_/g, " ").replace(/<i>/g, '').replace(/<b>/g, '').replace(/<\/i>/g, '').replace(/<\/b>/g, '').replace(/[$|[x\]]/g, '');
                }

                getCardInfo(card)

                let cardName = card.name
                let cardFlavorText = '_None._'
                if (card.flavor) {
                    cardFlavorText = removeFormatting(card.flavor)
                    cardFlavorText = `_${cardFlavorText}_`
                }
                let cardURL = `https://www.hearthpwn.com/cards?filter-name=${hearthPwnSearch}`
                let cardImage = card.img
                let cardText = removeFormatting(card.text)

                const charEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setAuthor(`Hearthstone Card Search`, hearthstoneIcon)
                    .setTitle(`__${cardName}__`)
                    //.setURL(<url>)
                    .setDescription(cardText)
                    //.setThumbnail(<thumbnail>)
                    .setImage(cardImage)
                    .addField(`__Card Info__`, cardInfo, true)
                    .addField(`__Flavor Text__`, cardFlavorText, true)
                    .addField(`__External Sites__`, `[Hearthpwn](${cardURL})`, false)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                msg.delete().then(rep => {
                    message.reply({ embed: charEmbed });
                }).catch(error => {
                    console.log(error)
                })

            }).catch(error => {
                console.log(message.author.username, error);

                const charEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Error: ${error.body.message}`)
                    //.setURL(<url>)
                    .setAuthor(`Hearthstone Card Search`, hearthstoneIcon)
                    .setDescription(`Ensure the spelling of the Card's name is correct, then try again.`)
                    //.setThumbnail(<thumbnail>)
                    .addField(`**Working Example**`, `!hscard Frostbolt`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                msg.edit({ embed: charEmbed });
            })
        })
    },
};