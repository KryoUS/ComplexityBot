const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { hearthstoneKey } = require('../config.json');

module.exports = {
    name: 'hscard',
    aliases: ['cardsearch', 'hscardsearch', 'hscards', 'hearthstone', 'card'],
    description: `Displays the closest matching Hearthstone card.`,
    category: `Hearthstone`,
    args: true,
    usage: '<card name(this can contain spaces)>',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {
        message.reply('Fetching card data...').then(msg => {
            let searchText = args.join(' ')
            let hearthPwnSearch = args.join('+')

            const hearthstoneAPI = `https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${searchText}`
            const hearthstoneIcon = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2FhearthstoneLogo.png?alt=media&token=e13cbb22-44b4-40ba-8414-61de0dfec79d`
            
            snekfetch.get(hearthstoneAPI, {headers: {'X-Mashape-Key': hearthstoneKey}}).then(response => {
                const sortOrder = ['Hero', 'Hero Power', 'Weapon', 'Minion', 'Spell', 'Enchantment']
                let responseLength = response.body.length
                let cardInfo = ''
                let resArray = response.body

                resArray.sort((a, b) => {
                    return sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type)
                })

                msg.delete().then(rep => {
                    message.reply(`${responseLength} card(s) found! _(Only a maximum of **3** cards will be shown.)_`);
                    
                    if (responseLength > 3) {
                        responseLength =  3
                    }

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
                        return x.replace(/\\n/g, " ").replace(/_/g, " ").replace(/<i>/g, '').replace(/<b>/g, '').replace(/<\/i>/g, '').replace(/<\/b>/g, '').replace(/$/g, '').replace(/\[x\]/g, '');
                    }

                    //Loop over card results array
                    for (i = 0; i<responseLength; i++) {                        
                        let card = resArray[i]
                        cardInfo = ''

                        getCardInfo(card)

                        let cardName = card.name
                        let cardText = '_None._'
                        let cardFlavorText = '_None._'
                        if (card.flavor) {
                            cardFlavorText = removeFormatting(card.flavor)
                            cardFlavorText = `_${cardFlavorText}_`
                        }
                        let hearthPwnSearch = cardName.replace(/\s/g, '+')
                        let cardURL = `https://www.hearthpwn.com/cards?filter-name=${hearthPwnSearch}`
                        let cardImage = card.img
                        if (card.imgGold) {
                            cardImage = card.imgGold
                        }
                        if (card.text) {
                            cardText = removeFormatting(card.text)
                        }

                        const charEmbed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setAuthor(`Hearthstone Card Search`, hearthstoneIcon)
                            .setTitle(`${cardName}`)
                            //.setURL(<url>)
                            .setDescription(cardText)
                            //.setThumbnail(<thumbnail>)
                            .setImage(cardImage)
                            .addField(`__Card Info__`, cardInfo, true)
                            .addField(`__Flavor Text__`, cardFlavorText, true)
                            .addField(`__External Sites__`, `[Hearthpwn](${cardURL})`, false)
                            .setTimestamp()
                            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                        message.channel.send({ embed: charEmbed });
                    }
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