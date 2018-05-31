module.exports = {
    name: 'server',
    description: 'Returns the Discord server\'s name and how many members there are.',
    execute(message, args) {
        message.channel.send(`Sadly my protocol requires that I answer you, even if the information is already in front of your pathetic image capsules.\n**Server Name:** ${message.guild.name}\n**Total Members:** ${message.guild.memberCount}`);
    },
};