const Discord = require('discord.js');

module.exports = {
    name: 'everyone',
    aliases: ['everybody', 'here'],
    description: `Returns random embedded image.`,
    category: `Guild`,
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 10,
    async execute(message, args) {

        const everyoneArray = [
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fangrydognoises.gif?alt=media&token=36fc1e32-4654-45d3-8f5e-e215ffb61cc9',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fdrake.jpg?alt=media&token=922852e7-1764-44e3-b535-2028c1a38b18',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Feveryoneeveryone.gif?alt=media&token=96816f78-584b-4510-afb5-7bc222ff078c',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fgrul.jpg?alt=media&token=1513de58-0eb2-4101-b823-0b55bd428b6e',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Finhales.jpg?alt=media&token=1827b1e6-73e0-421a-b154-dd87bfa5b076',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fnews.jpg?alt=media&token=47d0d1f6-6dc3-4be1-8792-17ac0170241a',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fnichi.gif?alt=media&token=d083bf8b-63ef-463b-ac91-abca56e73f77',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fpenguin.jpg?alt=media&token=8aa47413-f386-4040-8ef8-e5b26bce6f4a',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fprofessor.jpg?alt=media&token=f8cdb961-8da5-4baf-a74c-2529b992c9af',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fpuppy.png?alt=media&token=9ded896e-5242-4075-b788-2acce33bdcd4',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Frepunzel.jpg?alt=media&token=95548368-95fc-4978-b2c9-0d4225189957',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fronnie.jpg?alt=media&token=205f4c3a-6925-4f55-ba34-8332369c6861',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fsayitagain.jpg?alt=media&token=b22620e6-7615-4ef1-b9f9-7fa6f96170df',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fsendnow.jpg?alt=media&token=3ca37893-e970-4854-9f7e-d218a95e09c8',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Ftaggedcomic.jpg?alt=media&token=17f0de21-84a5-4472-bd4e-668ea774a1e7',
            'https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Feveryone%2Fwebcomic.jpg?alt=media&token=dd52ad1f-b73b-473b-b75e-9a49c391457d'
        ]

        let everyoneIndex = Math.floor(Math.random() * (everyoneArray.length))

        const charEmbed = new Discord.RichEmbed()
            .setImage(everyoneArray[everyoneIndex])

        message.channel.send({ embed: charEmbed });
    },
};