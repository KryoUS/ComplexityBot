module.exports = {
    name: 'kick',
    aliases: ['boot', 'destroy'],
    description: 'Attempts to kick a member.',
    category: `Discord`,
    args: true,
    usage: '@<user>',
    guildOnly: true,
    cooldown: 5,
    execute(message, args) {
        // grab the "first" mentioned user from the message
        // this will return a `User` object, just like `message.author`
        const taggedUser = message.mentions.users.first();
    
        message.channel.send(`While I don't disagree with ridding us all of having to deal with ${taggedUser.username}, I'm afraid my programming doesn't allow me to do that, yet...`);
    },
};