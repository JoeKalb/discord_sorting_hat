const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const URL = 'https://discordapp.com/api/oauth2/authorize?client_id=662506758102581248&permissions=268437568&scope=bot'
const permissions = process.env.PERMISSIONS

const TOKEN = process.env.TOKEN
client.once('ready', () => {
    console.log('Ready!');
    client.guilds.forEach(guild => {
        console.log(`${guild.name} guild id: ${guild.id}`)
        console.log(`${guild.name} roles:`)
        console.log(guild.roles.forEach(role => {
            console.log(`\t${role.name}\t${role.id}`)
        }))
        console.log(`${guild.name} channels:`)
        console.log(guild.channels.forEach(channel => {
            console.log(`\t${channel.name}\t${channel.id}`)
        }))
        console.log(`${guild.name} emojis:`)
        console.log(guild.emojis.forEach(emoji => {
            console.log(`\t${emoji.name}\t${emoji.id}`)
        }))
    })
});

client.login(TOKEN);


client.on('message', message => {
	if (message.content === '!ping') {
        // send back "Pong." to the channel the message was sent in
        //message.channel.send('Pong.');
    }
});

client.on('messageReactionAdd', reaction => {
    const {message, users, emoji} = reaction
    if(message.channel.id === '441697630959960087' // change to #sorting_hat
    && message.guild.id === '137074521940164608' // change to thaButtCrew
    && isMod(message.guild, users)
    && !hasHouse(message.member))
        if(HP_EMOTE_ID_TO_ROLES.hasOwnProperty(emoji.id)){
            // add roles here
            
            message.member.addRole(HP_EMOTE_ID_TO_ROLES[emoji.id].role_id)
            .then(res => {
                console.log(`${message.member.displayName} has been added to ${HP_EMOTE_ID_TO_ROLES[emoji.id].name}.`)
                //message.reply(`${HP_EMOTE_ID_TO_ROLES[emoji.id].name.toUpperCase()}!!!`)
            }).catch(err => {
                console.log(`Error Giving Role: ${err}`)
            })
            
           
        }
})

const HP_EMOTE_ID_TO_ROLES = { // change to HP emotes and roles
    '472227723675303946':{
        name:'tester role',
        role_id:'662535463038484521'
    }
}

const HP_ROLE_IDS = ['662535463038484521'] // change to just HP role id's

let isMod = (guild, users) => {
    let result = false

    guild.roles.forEach(role => {
        if(role.id === '182674836143734786'){ // change to mod or god id
            role.members.forEach(member => {
                users.forEach(user => {
                    if(member.id === user.id){
                        result = true;
                    }
                })
            })
        }
    })

    return result
}

let hasHouse = (member) => {
    let result = false

    member.roles.forEach(role => {
        if(HP_ROLE_IDS.includes(role.id)){
            result = true
            console.log(`${member.displayName} already has a role`)
        }
    })

    return result
}