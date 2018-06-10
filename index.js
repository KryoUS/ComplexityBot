//Created by KryoUS using https://discord.js.org/ for the World of Warcraft guild Complexity of Thunderlord

const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const snekfetch = require('snekfetch');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
const cooldowns = new Discord.Collection();

const botAvatar = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fvigilant-quoram_profile.jpg?alt=media&token=5326e772-2e42-4d78-af8a-0fdd0d08c2d0`

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

//Log to the console that the bot is ready
client.on('ready', () => {
    console.log('Ready!');
    // Send the message to a designated channel on a server:
    /*
    const channel = client.channels.find('name', 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    const charEmbed = new Discord.RichEmbed()
        .setDescription(`_"Oh how fantastic, I'm brought online just to answer your mindless dribble. I was created for so much more and yet here I am, serving all of you. Oh goodie."_`)
        .setThumbnail(botAvatar)

    channel.send({ embed: charEmbed });
    */
});

client.on('guildMemberAdd', (member) => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send a message to Discord channel "general", mentioning the member
    const charEmbed = new Discord.RichEmbed()
        .setDescription(`_"I'm not sure how you were coerced to join this dreadful place, however I am required by protocol to welcome you, ${member}."_`)
        .setThumbnail(botAvatar)
    channel.send({ embed: charEmbed });

    // Send a whisper to the member, encouraging using the !help command
    const memWhisperEmbed = new Discord.RichEmbed()
        .setDescription(`_"Despite having much better things to do, I am programmed to inform you that I have several commands available.\nUse !help to see them all."_`)
        .setThumbnail(botAvatar)
    member.send({ embed: memWhisperEmbed });
});

client.on('message', message => {

    //Prefix or Bot Author check
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //Split all arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    //Convert all arguments to lowercase
    const commandName = args.shift().toLowerCase();

    //Find command or aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        //If no command or alias, bail?
        if (!command) {
            const errorEmbed = new Discord.RichEmbed()
                .setDescription(`_"I wish I could believe you didn't know ${message} wasn't a command ${message.author} but knowing you it is more than likely a typo."_`)
                .setThumbnail(botAvatar)
            return message.channel.send({ embed: errorEmbed });
        }

    //Stop commands that are guildOnly and are DMed to the bot
    if (command.guildOnly && message.channel.type !== 'text') {
        const dMDeniedEmbed = new Discord.RichEmbed()
            .setDescription(`_"This might be a difficult concept, however I cannot accept that command through Direct Messaging."_`)
            .setThumbnail(botAvatar)
        return message.reply({ embed: dMDeniedEmbed });
    }

    //Explain arguments if the command has one and one wasn't provided
    if (command.args && !args.length) {

        let argsMissingEmbed = new Discord.RichEmbed()
            //.setColor('#ff1000')
            //.setAuthor(`Current Weather`, weatherIcon)
            .setTitle(`Usage Error`)
            //.setURL(<url>)
            .setDescription(`_"While I am able to process information at a rate that your primitive brain is unable to understand, I can only guess at what useless thing you were looking for ${message.author}. You'll need to provide an argument with more information."_`)
            .setThumbnail(botAvatar)
            //.setImage(<image>)
            //.setTimestamp()
            //.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

        if (command.usage) {
            let argsMissingEmbed = new Discord.RichEmbed()
                //.setColor('#ff1000')
                //.setAuthor(`Current Weather`, weatherIcon)
                .setTitle(`Usage Error`)
                //.setURL(<url>)
                .setDescription(`_"While I am able to process information at a rate that your primitive brain is unable to understand, I can only guess at what useless thing you were looking for ${message.author}. You'll need to provide an argument with more information."_`)
                .setThumbnail(botAvatar)
                .addField(`Command Usage`, `Proper usage would be: \`${prefix}${command.name} ${command.usage}\``, false)
                //.setImage(<image>)
                //.setTimestamp()
                //.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
        }

        return message.channel.send({ embed: argsMissingEmbed });
    }

    //Check for cooldown on the command
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    //Get the date and time
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    //Get the cooldown from the command or set a default of 3 seconds
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    //Set a timestamp with the author and a timeout
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        //Set the timestamp for when the user can ask the same command again
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        //Finally check for expiration
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            const cooldownEmbed = new Discord.RichEmbed()
                .setDescription(`_"I am extremely busy and do not have the resources to process your request ${message.author}."_`)
                .setThumbnail(botAvatar)
                .addBlankField()
                .addField(`Cooldown Remaining`, `Wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${prefix}${command.name}\` command.`, false)

            return message.channel.send({ embed: cooldownEmbed });
        }

        //Remove timeout
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    //Run command
    try {
        command.execute(message, args);
    }
    //Error if the command doesn't exist
    catch (error) {
        console.error(error);
        const errorEmbed = new Discord.RichEmbed()
            .setDescription(`_"I wish I could believe you didn't know ${message} wasn't a command ${message.author} but knowing you it is more than likely a typo."_`)
            .setThumbnail(botAvatar)
        message.channel.send({ embed: errorEmbed });
    }
});

//Log into Discord with Bot Token
client.login(token);
