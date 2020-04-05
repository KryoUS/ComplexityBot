//Created by KryoUS using https://discord.js.org/ for the World of Warcraft guild Complexity of Thunderlord
//This project will require a config.json that contains various API keys and the Discord Bot's Secret to function. The prefix variable also comes from config.json

const fs = require('fs');
const Discord = require('discord.js');
const getDb = require('./db/db');
const DiscordBotLogging = require('./db/dbLogging');
const axios = require('axios');
const { prefix, token } = require('./config.json');
const curfew = require('./curfew/curfew');
const cron = require('./cron/cron');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}



getDb().then(db => {
    //Log Database Connection
    DiscordBotLogging(db, 1, 'system', null, 'Database Connected');
  
    // don't pass the instance
    return Promise.resolve();
}).then(() => {
    // retrieve the already-connected instance synchronously
    const db = getDb();

    //cron.curfewCron(db, client);

    //Log to the console that the bot is ready
    client.on('ready', () => {

        const botAvatar = client.user.avatarURL;

        DiscordBotLogging(db, 1, 'system', botAvatar, 'Discord Bot Ready');
        // Send the message to a designated channel on a server:
        /*
        const channel = client.channels.find('name', 'general');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        const charEmbed = new Discord.RichEmbed()
            .setDescription(`_"Oh how fantastic, I'm brought online just to answer your mindless dribble. I was created for so much more and yet here I am, serving all of you. Oh goodie."_`)
            .setThumbnail(botAvatar)
            .setImage(message.author.avatarURL)

        channel.send({ embed: charEmbed });
        */
    });

    // client.on('guildMemberAdd', (member) => {

    //     const botAvatar = client.user.avatarURL;

    //     // Send the message to a designated channel on a server:
    //     const channel = member.guild.channels.find('name', 'general');
    //     // Do nothing if the channel wasn't found on this server
    //     if (!channel) return;
    //     // Send a message to Discord channel "general", mentioning the member
    //     const charEmbed = new Discord.RichEmbed()
    //         .setDescription(`_"I'm not sure how you were coerced to join this dreadful place, however I am required by protocol to welcome you, ${member}."_`)
    //         .setThumbnail(botAvatar)
    //     channel.send({ embed: charEmbed });

    //     // Send a whisper to the member, encouraging using the !help command
    //     const memWhisperEmbed = new Discord.RichEmbed()
    //         .setDescription(`_"Despite having much better things to do, I am programmed to inform you that I have several commands available.\nUse !help to see them all."_`)
    //         .setThumbnail(botAvatar)
    //     member.send({ embed: memWhisperEmbed });
    // });

    client.on('message', message => {

        //Add the Thumbs Up and Thumbs Down reaction to all embeds or attachments
        //Dev ID: 448988109015875586, Prod ID: 696197131542986782
        if (message.channel.id == '696197131542986782') {

            if (message.embeds.length > 0) {
                message.react('👍');
                message.react('👎');
            }
            if (message.attachments.size > 0) {
                message.react('👍');
                message.react('👎');
            }
        }

        //Set the Bot Avatar URL
        const botAvatar = client.user.avatarURL;

        // news-worldofwarcraft
        if (message.author.username === 'Wowhead News') {
            const dateTime = new Date().getTime();

            //Insert news
            db.news.insert({
                title: message.embeds[0].title,
                description: message.embeds[0].description,
                link: message.embeds[0].url,
                image: message.embeds[0].thumbnail.url,
                news_datetime: dateTime,
                category: 'worldofwarcraft',
                source: 'wowhead'
            }).then(insertRes => {
                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, 'Wowhead News Inserted', message);
            }).catch(insertErr => {
                DiscordBotLogging(db, 1, 'system', botAvatar, 'Wowhead News Insert Failure', insertErr);
            });
        }

        //Testing Raider.IO webhook
        if (message.author.username === 'Raider.IO') {

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, 'RaiderIO News Inserted', message);

        //     if (message.embeds[0].fields.name.includes('Guild Run!')) {
        //         let mythicGuildRun = {};
        //         mythicGuildRun.dateTime = message.embeds[0].message.createdTimestamp;
        //         mythicGuildRun.image = message.embeds[0].image ? message.embeds[0].image.url : null,
        //         message.embeds[0].fields.map((obj, index) => {
        //             if (obj.name.includes('Guild Run!')) {
        //                 mythicGuildRun.title = obj.name.replace('👊 ','');
        //                 mythicGuildRun.description = obj.value;
        //             } else if (obj.value.includes('Group Details')) {
        //                 mythicGuildRun.runUrl = obj.value.substring(obj.value.indexOf('Details]') + 10, obj.value.indexOf(' ● ') - 2);
        //                 mythicGuildRun.dungeonUrl = obj.value.substring(obj.value.indexOf(' ● ') + 4, obj.value.lastIndexOf(' ● ') - 2);
        //                 let affixes = obj.value.substring(obj.value.lastIndexOf(' ● ') + 4, obj.value.indexOf('](https://raider.io/mythic-plus-affix-rankings'));
        //                 mythicGuildRun.affixes = affixes.split(', ');
        //                 mythicGuildRun[`character${index}Spec`] = obj.name;
        //                 mythicGuildRun[`character${index}Name`] = obj.value.substring(obj.value.indexOf('[') + 1, obj.value.indexOf(']') - 1);
        //                 mythicGuildRun[`character${index}Score`] = obj.value.substring(obj.value.indexOf(' - ') + 3, obj.value.lastIndexOf('Score') - 1);
        //                 mythicGuildRun[`character${index}URL`] = obj.value.substring(obj.value.indexOf('(') + 1, obj.value.indexOf(')') - 1);
        //             } else {
        //                 mythicGuildRun[`character${index}Spec`] = obj.name;
        //                 mythicGuildRun[`character${index}Name`] = obj.value.substring(obj.value.indexOf('[') + 1, obj.value.indexOf(']') - 1);
        //                 mythicGuildRun[`character${index}Score`] = obj.value.substring(obj.value.indexOf(' - ') + 3, obj.value.lastIndexOf('Score') - 1);
        //                 mythicGuildRun[`character${index}URL`] = obj.value.substring(obj.value.indexOf('(') + 1, obj.value.indexOf(')') - 1);
        //             }
        //         })

        //         console.log('Mythic Guild Run = ', mythicGuildRun);
        //     } else {
        //         console.log('Something = ', message.embeds[0].fields);
        //     }
            
        }

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

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Bad Command Attempt: ${message}`);
                return message.channel.send({ embed: errorEmbed });
            }

        //Stop commands that are guildOnly and are DMed to the bot
        if (command.guildOnly && message.channel.type !== 'text') {
            const dMDeniedEmbed = new Discord.RichEmbed()
                .setDescription(`_"This might be a difficult concept, however I cannot accept that command through Direct Messaging."_`)
                .setThumbnail(botAvatar)

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Direct Message Denied: ${message}`);
            return message.reply({ embed: dMDeniedEmbed });
        }

        //Explain arguments if the command has one and one wasn't provided
        if (command.args && !args.length) {

            let argsMissingEmbed = new Discord.RichEmbed()
                .setTitle(`Usage Error`)
                .setDescription(`_"While I am able to process information at a rate that your primitive brain is unable to understand, I can only guess at what useless thing you were looking for ${message.author}. You'll need to provide an argument with more information."_`)
                .setThumbnail(botAvatar)

            if (command.usage) {
                argsMissingEmbed.setDescription(`_"While I am able to process information at a rate that your primitive brain is unable to understand, I can only guess at what useless thing you were looking for ${message.author}. You'll need to provide an argument with more information."_`)
                argsMissingEmbed.addField(`Command Usage`, `Proper usage would be: \`${prefix}${command.name} ${command.usage}\``, false)
            }

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Missing Command Argument: ${command.name} ${command.usage && command.usage}`);
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
                    .setDescription(`_"I am extremely busy and can't be bothered with you ${message.author}."_`)
                    .setThumbnail(botAvatar)
                    .addBlankField()
                    .addField(`Cooldown Remaining`, `Wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${prefix}${command.name}\` command.`, false)

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Command Cooldown: ${command.name} ${timeLeft.toFixed(1)}s left.`);
                return message.channel.send({ embed: cooldownEmbed });
            }

            //Remove timeout
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        //Run command
        try {
            command.execute(message, args, botAvatar, db);
        }
        //Error if the command doesn't exist
        catch (error) {
            console.error(error);
            const errorEmbed = new Discord.RichEmbed()
                .setDescription(`_"I wish I could believe you didn't know ${message} wasn't a command ${message.author} but knowing you it is more than likely a typo."_`)
                .setThumbnail(botAvatar)
            message.channel.send({ embed: errorEmbed });

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Missing Command: ${message}`);
        }

    });

    //Check for restricted users using Discord after curfew hours.
    //Triggers on users entering, leaving, muting, and unmuting Discord.
    client.on('voiceStateUpdate', (oldMember, newMember) => {
        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;

        //User joined a voice channel
        if (oldUserChannel === undefined && newUserChannel !== undefined && newUserChannel.id == '127631752159035393') {
            //Check for role
            if (newMember._roles.find(roleID => roleID == '696104208088301752')) { //Prod Role: 696104208088301752, Dev Role: 449045945594806272
                //Set a string of "##.##" for hour.minute timestamp format, based on Central TimeZone
                let now = new Date(Date.parse(new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}))).getHours() + "." + new Date().getMinutes();
                now = Number(now);
                //Get start and end curfew object from imported module
                let startCurfewObj = curfew.getStartCurfew();
                if (startCurfewObj.minutes < 10) {startCurfewObj.minutes = "0" + startCurfewObj.minutes}
                let endCurfewObj = curfew.getEndCurfew();
                if (endCurfewObj.minutes < 10) {endCurfewObj.minutes = "0" + endCurfewObj.minutes}
                //Set curfew strings with "##.##" for hour.minute timestamp format
                let startCurfew = startCurfewObj.hour + "." + startCurfewObj.minutes;
                startCurfew = Number(startCurfew);
                let endCurfew = endCurfewObj.hour + "." + endCurfewObj.minutes;
                endCurfew = Number(endCurfew);
                
                //If now is after the starting curfew and now is before midnight OR now is greater than midnight and now is before the end of the curfew
                if ((now > startCurfew && now < 23.59) || (now > 0.00 && now < endCurfew)) {
                    newMember.setVoiceChannel(null);
                    newMember.send(`You have been disconnected from voice chat due to the current time being outside of curfew hours. Current curfew is set between the hours of ${startCurfew} and ${endCurfew}.`)
                    DiscordBotLogging(db, newMember.user.id, newMember.user.username, newMember.user.avatarURL, `${newMember.user.username} was disconnected due to curfew. ${now} vs ${startCurfew} and ${endCurfew}`);
                }
            };
        };
    });

    //Catches Message Edits, only used for Raidbots
    client.on('messageUpdate', (oldMessage, newMessage) => {

        //Set the Bot Avatar URL
        const botAvatar = client.user.avatarURL;
        
        //Ensure the Author is the Raidbots Discord Bot & that there is an embed (The presence of the embed signifies that the simulation is done)
        if (newMessage.author.username === 'Raidbots' && newMessage.embeds.length) {

            //Get the report url from the content string
            report = newMessage.content.substring(newMessage.content.indexOf('https:'));
            reportURL = report.substring(0, report.indexOf('**') - 1);

            //Get JSON data from Raidbots
            axios.get(reportURL + '/data.json').then(res => {
                
                //Insert the Raidbots JSON into database
                db.raidbots.saveDoc(res.data).then(result => {
                    DiscordBotLogging(db, newMessage.author.id, newMessage.author.username, newMessage.author.avatarURL, `Raidbot Sim Inserted: ${result.simbot.title}`);
                }).catch(error => {
                    DiscordBotLogging(db, 1, 'system', botAvatar, `Raidbot Sim Insertion Error`, error);
                })

            }).catch(error => {
                DiscordBotLogging(db, 1, 'system', botAvatar, `Raidbot Sim Fetch Error`, error);
            })
        }
    })

    //Log into Discord with Bot Token
    client.login(token);

    //Show Discord.js library errors
    client.on('error', (error) => {
        console.error;
        DiscordBotLogging(db, 1, 'system', null, `Discord.js Library Error`, error);
    });

}).catch(error => {
    console.log('DB Connection Error: ', error);
});
