const CronJob = require('cron').CronJob;
const curfew = require('../curfew/curfew');
const DiscordBotLogging = require('../db/dbLogging');

module.exports = {
    
    curfewCron: (db, client) => new CronJob('*/10 * * * * *', () => {
        
        //Set an integer as "####" (HRMN) timestamp format, based on Central TimeZone
        let now = new Date(Date.parse(new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}))).getHours() * 100 + new Date().getMinutes();
        now = Number(now);

        //Set curfew integers with "####" for HRMN timestamp format
        let startCurfew = curfew.getCurfew().start;
        let endCurfew = curfew.getCurfew().end;

        //If now is after the starting curfew and now is before midnight OR now is greater than midnight and now is before the end of the curfew
        if ((now > startCurfew && now < 2359) || (now > 0 && now < endCurfew)) {

            //Get all Members that belong to the restricted role
            //Prod Guild: 127631752159035392 , Prod Role: 696104208088301752
            //Dev Guild: 448988109015875584, Dev Role: 449045945594806272
            client.guilds.get('127631752159035392').roles.get('696104208088301752').members.map(m => { 
                //If the user is in the restricted channel, kick them.
                //Prod Channel ID: 127631752159035393
                //Dev Channel ID: 448988109015875588
                if (m.voiceChannelID == '127631752159035393') {  
                    m.setVoiceChannel(null);
                    m.send(`You have been disconnected from voice chat due to the current time being outside of curfew hours. Current curfew is set between the hours of ${startCurfew} and ${endCurfew}.`)
                    DiscordBotLogging(db, m.user.id, m.user.username, m.user.avatarURL, `${m.user.username} was disconnected due to curfew. ${now} vs ${startCurfew} and ${endCurfew}`);
                };
            });
        };

    }, null, true, 'America/Chicago', null, false),

}