const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    category: `Bot`,
    aliases: ['commands'],
    usage: '<commandname>',
    cooldown: 5,
    execute(message, args, botAvatar) {
        const { commands } = message.client;
        const data = [];

        // console.log();
        const botEmbed = new Discord.RichEmbed()
            .setThumbnail(botAvatar)
            .addBlankField();

        if (!args.length) {
            let arr = [];

            botEmbed.setDescription(`_"Here is a list of all the mundane things I've been programmed to respond to. Feel free to not use them."_`);

            commands.map(command => {
                arr.push({category: command.category, name: command.name, description: command.description})
            });

            arr.sort((a, b) => {
                let c = a.category.toLowerCase();
                let d = b.category.toLowerCase();
                if (c < d) {return -1;}
                if (c > d) {return 1;}
                return 0;
            });

            // botEmbed.addField(com.category, `\`${prefix}${com.name}\`: ${com.description}\n`, false);
            arr.map(com => {
                botEmbed.addField(`${prefix}${com.name}`, `-${com.description}`, false);
            });

        } else {
            if (!commands.has(args[0])) {
                return message.reply('that\'s not a valid command!');
            }
            
            const command = commands.get(args[0]);
            botEmbed.setDescription(`_"It's not like I have enough computing power to solve REAL problems or anything. No no, it's fine. Here is more information about the __**${prefix}${command.name}**__ command, meatsack"_`);
            
            if (command.description) botEmbed.addField(`__**Description:**__`, `${command.description}`);
            if (command.category) botEmbed.addField(`__**Category:**__`, `${command.category}`);
            if (command.aliases) botEmbed.addField(`__**Aliases:**__`, `${command.aliases.join(', ')}`);
            if (command.usage) botEmbed.addField(`__**Usage:**__`, `${prefix}${command.name} ${command.usage}`);
        }

        message.author.send({ embed: botEmbed })
    },
};