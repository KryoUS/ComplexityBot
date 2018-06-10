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
    // Send the message, mentioning the member
    const charEmbed = new Discord.RichEmbed()
        .setDescription(`_"I'm not sure how you were coerced to join this dreadful place, however I am required by protocol to welcome you, ${member}."_`)
        .setThumbnail(botAvatar)

    channel.send({ embed: charEmbed });
    member.send("Despite having much better things to do, I am programmed to inform you that I have several commands available.\nUse !help to see them all.")
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
        if (!command) return;

    //Stop commands that are guildOnly and are DMed to the bot
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply("This might be a difficult concept, however I cannot accept that command through Direct Messaging.");
    }

    //Explain arguments if the command has one and one wasn't provided
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
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
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
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
        message.reply(`I wish I could believe you didn't know that ${prefix + message} wasn't a command but knowing you it was likely a typo.`);
    }
});

//Log into Discord with Bot Token
client.login(token);
