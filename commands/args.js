module.exports = {
    name: 'args',
    description: 'Information about the argument provided.',
    args: false,
    execute(message, args) {
        if (args[0] === 'user') {
            return message.channel.send(`<user> will need to be replaced with the Discord User's name.`);
        } else if (args[0] === 'charname') {
            return message.channel.send(`<charname> will need to be replaced with the Character's name.`)
        } else if (args[0] === 'realm') {
            return message.channel.send(`<realm> will need to be replaced with the realm or server name.`)
        } else if (args[0] === 'region') {
            return message.channel.send(`<region> will need to be replaced with the region.\n**Example:** us, eu, kr, cn`)
        } else {
            return message.channel.send(`Current arguments are as follows...\nuser\ncharname\nrealm\nregion`)
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};