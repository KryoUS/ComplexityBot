module.exports = {
    name: 'server',
    description: 'Returns the Discord server\'s name and how many members there are.',
    category: `Discord`,
    execute(message, args, botAvatar) {
        message.channel.send(`Sadly my protocol requires that I answer you, even if the information is already in front of your pathetic image receptors.\n**Server Name:** ${message.guild.name}\n**Total Members:** ${message.guild.memberCount}`);
    },
};