//Discord Bot Logging
module.exports = (db, userid, username, useravatarURL, message, errorJSON) => {
    db.discordbotlog.insert({ 
        epoch_datetime: new Date().getTime(),  
        userid: userid,
        username: username,
        useravatarurl: useravatarURL,
        message: message,
        error: errorJSON ? errorJSON : '{}'
    }).then(result => {
        //Do nothing with results
    }).catch(error => {
        console.log(`${new Date()} Massive.js DiscordBotLogging Insert Error = `, error);
    })
};
