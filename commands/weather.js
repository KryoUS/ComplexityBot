const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { weatherKey } = require('../config.json');

module.exports = {
    name: 'weather',
    aliases: ['myweather'],
    description: `Displays embedded information about the city's current weather conditions.`,
    category: `Weather`,
    args: true,
    usage: '<city name> or <city name, country code> or <zipcode> or <+/-lat +/-lon> (Spaces are allowed for <city name> and <+/-lat +/-lon>)',
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {

        const regex = new RegExp("[0-9]+")
        const regexLatLon = new RegExp(/\./g)
        let weatherAPI = ``
        let city = ''
        
        if (regexLatLon.test(args)) {
            city = `lat=${args[0]}&lon=${args[1]}`
            weatherAPI = `http://api.openweathermap.org/data/2.5/weather?${city}&APPID=${weatherKey}`
        } else if (regex.test(args)) {
            city = args
            weatherAPI = `http://api.openweathermap.org/data/2.5/weather?zip=${city}&APPID=${weatherKey}`
        } else {
            city = args.join(' ')
            weatherAPI = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${weatherKey}`
        }

        const weatherIcon = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Fweather.png?alt=media&token=b3f8ce0d-c175-4e4a-a53b-b067e5f8b757`
        const errorThumb = `https://firebasestorage.googleapis.com/v0/b/complexitywebsite-bdcf7.appspot.com/o/DiscordBot%2Ferror.png?alt=media&token=19beee91-6acd-4949-87da-dc2949e68fa1`

        kelvinToFarenheit = (x) => {
            x = 1.8*(x-273)+32
            x = Math.floor(x)
            return x
        }

        makeTime = (unixTimeStamp) => {
            return new Date(unixTimeStamp*1000).toLocaleTimeString('en-US')
        }

        makeDate = (unixTimeStamp) => {
            return new Date(unixTimeStamp*1000).toLocaleDateString('en-US')
        }

        capitalize = (letter) => {
            return letter[0].toUpperCase() + letter.slice(1);
        }

        snekfetch.get(weatherAPI).then(response => {

            let weather = response.body
            let currentTemp = kelvinToFarenheit(weather.main.temp)
            let cityName = weather.name
            let country = weather.sys.country
            let pressure = `${weather.main.pressure} hPa`
            let humidity = `${weather.main.humidity}%`
            let conditions = capitalize(weather.weather[0].description)
            let weatherThumb = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`
            let cloudCoverage = `${weather.clouds.all}%`
            let windSpeed = weather.wind.speed
            let lastUpdate = `${makeDate(weather.dt)} ${makeTime(weather.dt)}`
            let sunrise = makeTime(weather.sys.sunrise)
            let sunset = makeTime(weather.sys.sunset)
            let rainVolume = 0
            if (weather.rain) {
                rainVolume = weather.rain["3h"]
            }

            let snowVolume = 0
            if (weather.snow) {
                snowVolume = weather.snow["3h"]
            }

            const charEmbed = new Discord.RichEmbed()
                .setColor('#ff9400')
                .setAuthor(`Current Weather`, weatherIcon)
                .setTitle(`${cityName}, ${country}`)
                //.setURL(<url>)
                .setDescription(`${conditions}.`)
                .setThumbnail(weatherThumb)
                //.setImage(<image>)
                .addField(`__Current Temperature__`, currentTemp, true)
                .addField(`__Pressure__`, pressure, true)
                .addField(`__Humidity__`, humidity, true)
                .addField(`__Cloud Coverage__`, cloudCoverage, true)
                .addField(`__Windspeed__`, windSpeed, true)
                .addField(`__Sunrise__`, sunrise, true)
                .addField(`__Rain Volume__`, rainVolume, true)
                .addField(`__Sunset__`, sunset, true)
                .addField(`__Snow Volume__`, snowVolume, true)
                .addField(`__Last Updated__`, lastUpdate, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.reply({ embed: charEmbed });

        }).catch(error => {
            console.log(message.author.username, error);

            const charEmbed = new Discord.RichEmbed()
                .setColor('#ff1000')
                .setAuthor(`Current Weather`, weatherIcon)
                .setTitle(`Error`)
                //.setURL(<url>)
                .setDescription(error.body.message)
                .setThumbnail(errorThumb)
                .addField(`Working Examples`, `!weather Salt Lake City\n!weather Tokyo, JP\n!weather 84123\n!weather 32.9343 -97.0781`, false)
                .addField(`Latitude and Longitude`, `Remember, North/South come first, followed by East/West. Both South and West are negative numbers. And finally, Latitude comes before Longitude.`, false)
                //.setImage(<image>)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);

            message.reply({ embed: charEmbed });
        })
    },
};