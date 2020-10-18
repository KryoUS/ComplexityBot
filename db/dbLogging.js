//Discord Bot Logging
const config = require('../config.json');

//Function to remove Circular Object references
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

module.exports = (db, userid, username, useravatarURL, message, errorJSON) => {
    db.discordbotlog.insert({ 
        epoch_datetime: new Date().getTime(),  
        userid: userid,
        username: username,
        useravatarurl: useravatarURL,
        message: config.dev === true ? `DevEnviro: ${message}` :  message,
        error: errorJSON ? JSON.stringify(errorJSON, getCircularReplacer()) : '{}'
    }).then(result => {
        //Do nothing with results
    }).catch(error => {
        console.log(`${new Date()} Massive.js DiscordBotLogging Insert Error = `, error);
    })
};
