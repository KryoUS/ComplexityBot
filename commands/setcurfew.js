const Discord = require('discord.js');
const DiscordBotLogging = require('../db/dbLogging');
const curfew = require('../curfew/curfew');

module.exports = {
    name: 'setcurfew',
    aliases: [],
    description: `Sets the curfew hours for users with a specific Discord Role.`,
    category: `Guild`,
    args: true,
    usage: '<20:00> <5:00>',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args, botAvatar, db) {
        const clockThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fdigital_clock_icon.png?alt=media&token=56ff341c-a89c-4ab6-baec-178372e33811`
        const errorThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Ferror.png?alt=media&token=19beee91-6acd-4949-87da-dc2949e68fa1`
        
        //If the user that sent the message has the proper role
        const allowedRoles = "Guild Leaders"; //Prod Role: Guild Leaders
        if (message.member.roles.find(x => x.name === allowedRoles)) {

            //If there are no more than two arguments and it includes a colon as well as not including a hyphen
            if (args.length <= 2 && args[0].includes(":") && args[1].includes(":") && !args[0].includes("-") && !args[1].includes("-")) {

                //Set the starting and ending curfew
                curfew.setStartCurfew(args[0]);
                curfew.setEndCurfew(args[1]);

                //Get now and set the format to "##.##" based on Central Time Zone
                let now = new Date(Date.parse(new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}))).getHours() + "." + new Date().getMinutes();
                now = Number(now);

                //Define the new starting and ending curfew times, and set the format to "##.##"
                let startCurfew = Number(args[0].replace(":", "."));
                let endCurfew = Number(args[1].replace(":", "."));

                //If now is after the starting curfew and now is before midnight OR now is greater than midnight and now is before the end of the curfew
                if ((now > startCurfew && now < 23.59) || (now > 0.00 && now < endCurfew)) {

                    //Get all Members that belong to the restricted role
                    //Prod Role: 696104208088301752, Dev Role: 449045945594806272
                    message.guild.roles.get('696104208088301752').members.map(m => { 
                        //If the user is in the restricted channel, kick them.
                        //Prod Channel ID: 127631752159035393 
                        //Dev Channel ID: 448988109015875588
                        if (m.voiceChannelID == '127631752159035393') { 
                            m.setVoiceChannel(null, 'You have been disconnected from voice chat due to the current time being outside of curfew hours.');
                            m.send(`You have been disconnected from voice chat due to the current time being outside of curfew hours. Current curfew is set between the hours of ${startCurfew} and ${endCurfew}.`)
                            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `${m.user.username} was disconnected due to curfew. ${now} vs ${startCurfew} and ${endCurfew}`);
                        };
                    });
                };

                const curfewEmbed = new Discord.RichEmbed()
                    .setColor('#45f542')
                    .setTitle(`Set Curfew`)
                    //.setURL(<url>)
                    .setAuthor(`Curfew`, botAvatar)
                    .setDescription(`Curfew hours updated to be between ${args[0]} and ${args[1]}.`)
                    .addBlankField()
                    .setThumbnail(clockThumb)
                    //.addField(`test`, `test`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Curfew time modified to be between ${args[0]} and ${args[1]}.`);

                message.channel.send({ embed: curfewEmbed });

            } else {
                const errorEmbed = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .setTitle(`Error`)
                    //.setURL(<url>)
                    .setAuthor(`Curfew`, botAvatar)
                    .setDescription(`Incorrect format! The proper format is... \n ^setcurfew 22:00 5:00`)
                    .addBlankField()
                    .setThumbnail(errorThumb)
                    //.addField(`test`, `test`, false)
                    //.setImage(<imageURL>)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

                DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Curfew update failed!`, {arguments: args});

                message.channel.send({ embed: errorEmbed });
            }
            
        } else {
            const errorEmbed = new Discord.RichEmbed()
                .setColor('#ffffff')
                .setTitle(`Error`)
                //.setURL(<url>)
                .setAuthor(`Curfew`, botAvatar)
                .setDescription(`You do not have the proper Discord Role to access this command.`)
                .addBlankField()
                .setThumbnail(errorThumb)
                //.addField(`test`, `test`, false)
                //.setImage(<imageURL>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            DiscordBotLogging(db, message.author.id, message.author.username, message.author.avatarURL, `Curfew update failed!`, {error: 'User does not have the correct Discord Role to use this command.'});

            message.channel.send({ embed: errorEmbed });
        }
    },
};