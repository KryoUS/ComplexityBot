module.exports = {
    name: 'args',
    description: 'Information about the argument provided.',
    category: `Bot`,
    aliases: ['arguments', 'argument'],
    usage: '<argument>',
    args: false,
    execute(message, args) {
        const { commands } = message.client;
        const data = [];

        if (!args.length) {
            data.push('Here\'s a list of all command arguments:');
            data.push(commands.map(command => command.usage).join(`\n`));
            data.push(`\nYou can send \`${prefix}args <argument>\` to get more info on a specific argument!`);
        }
        else {
            if (!commands.has(args[0])) {
                return message.reply('that\'s not a valid argument!');
            }
            
            const command = commands.get(args[1]);
            
            data.push(`**Available Arguments:** ${command.usage}`);
        }

        message.author.send(data, { split: true })
        .then(() => {
            if (message.channel.type !== 'dm') {
                message.channel.send('I\'ve sent you a DM with all my arguments!');
            }
        })
        .catch(() => message.reply('it seems like I can\'t DM you!'));
    },
};