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

            if(role.id === '264164239797649408'){
                role.members.forEach(member => {
                    console.log(`${member.displayName}: ${member.id}`)
                })
            }
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
    if(message.channel.id === '662128396599558175' // change to #sorting_hat
    && message.guild.id === '160072797475962881' // change to thaButtCrew
    && isMod(message.guild, users)){
        if(!hasHouse(message.member)){
            if(HP_EMOTE_ID_TO_ROLES.hasOwnProperty(emoji.id)){
                console.log(`Would add to role ${HP_EMOTE_ID_TO_ROLES[emoji.id].name}`)
                // add roles here
                
                message.member.addRole(HP_EMOTE_ID_TO_ROLES[emoji.id].role_id)
                .then(res => {
                    console.log(`${message.member.displayName} has been added to ${HP_EMOTE_ID_TO_ROLES[emoji.id].name}.`)
                    message.reply(`${HP_EMOTE_ID_TO_ROLES[emoji.id].name.toUpperCase()}!!!`)
                }).catch(err => {
                    console.log(`Error Giving Role: ${err}`)
                })
            }
        }else{
            if('356889743239413763' === emoji.id && isJoeFish(users)){
                console.log(`Emote ID: ${emoji.id}`)
                console.log(`Emote Name: ${emoji.name}`)
                console.log('will remove the house role from the person')
                let current_house_id;
                message.member.roles.forEach(role => {
                    if(HP_ROLE_IDS.includes(role.id)){
                        current_house_id = role.id
                    }
                })

                message.member.removeRole(current_house_id)
            }
        }
    }
})

const HP_EMOTE_ID_TO_ROLES = { // change to HP emotes and roles
    '530429682839978018':{
        name:'Gryffindor',
        role_id:'528264636894806027'
    },
    '530429751442145300':{
        name:'Slytherin',
        role_id:'528264234233233409'
    },
    '530429771067424800':{
        name:'Ravenclaw',
        role_id:'528263676721889291'
    },
    '530429786431029250':{
        name:'Hufflepuff',
        role_id:'528264390080987146'
    }
}

const HP_ROLE_IDS = [
    '528263676721889291',
    '528264234233233409',
    '528264390080987146',
    '528264636894806027'] // change to just HP role id's

let isMod = (guild, users) => {
    let result = false

    guild.roles.forEach(role => {
        if(role.id === '264164239797649408' || role.id === '264165174414540810'){ // change to mod or god id
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

let isJoeFish = (users) => {
    let result = false

    users.forEach(user => {
        if(user.id === '91370189366530048')
            result = true
    })

    return result
}