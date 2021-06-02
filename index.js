const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: false });
const dotenv = require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const URL = 'https://discordapp.com/api/oauth2/authorize?client_id=662506758102581248&permissions=268437568&scope=bot'
const permissions = process.env.PERMISSIONS

const TOKEN = process.env.TOKEN

const moment = require('moment');
const bday = require('./birthday');

const giphy_api_key = process.env.GIPHY_API_KEY
const giphy = require('giphy-api')(giphy_api_key)

const schedule = require('node-schedule');
const thaButtCrew = '160072797475962881'
const subs_patrons = '307669416580218881'
const secret_stuff_general = '137074521940164608'
const general_everyone = '160072797475962881'
const checkBday = schedule.scheduleJob({hour: 08, minute: 00}, async () => { // add +7 hours from PST to get proper AWS time scheudle
    bdayAnnouncments()
});

const bdayAnnouncments = async () => {
    if(!ready) return

    const announcment_channel = client.channels.cache.get(general_everyone)
    const sub_channel = client.channels.cache.get(subs_patrons)

    const bdays = await bday.getTodaysBirthdays(moment().month() + 1, moment().date()).catch(console.error)
    if(bdays.length === 0) return 

    let hasSubBirthdays = false
    bdays.forEach(user => {
        if(sub_channel.members.get(user.discordID)){
            hasSubBirthdays = true
            announcment_channel.send(bday.randomBirthdayMessage(`<@${user.discordID}>`))
        }
    })

    const gifs = await giphy.search( {q:'birthday', limit:100}).catch(console.error)
    if(!gifs) return 

    const randomGif = gifs.data[Math.floor(Math.random() * gifs.data.length)]
    if(hasSubBirthdays)
        announcment_channel.send(randomGif.bitly_url)
}

let ready = false
client.once('ready', () => {
    ready = true
    console.log('Ready!');
    client.user.setActivity('with 0s and 1s.', {type:'PLAYING'}).catch(console.error)
});

client.login(TOKEN);

const BOT_ID = '662506758102581248'
client.on('message', async message => {
    if(message.author.id === BOT_ID) return //no more endless loops!
    
	if (message.content === '!ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }
    
    if(message.channel.id !== subs_patrons) return

    if(message.content.match(/^!set [a-zA-Z\s\d]+/g)){
        let dateString = message.content.substring(5)
        let date 

        if(dateString.match(/[a-zA-Z]{3} [\d]{1,2}/g))
            date = moment(dateString, "MMM DD")
        else if(dateString.match(/[a-zA-Z]{5,} [\d]{1,2}/g))
            date = moment(dateString, "MMMM DD")
        else if(dateString.match(/[\d]{2}[\s|\S][\d]{2}/g))
            date = moment(dateString, "MM DD")
        else if(dateString.match(/[\d]{1,2} [a-zA-Z]{3}/g))
            date = moment(dateString, "DD MMM")
        else if(dateString.match(/[\d]{1,2} [a-zA-Z]{5,}/g))
            date = moment(dateString, "DD MMMM")

        if(date === undefined || !date.isValid())
            message.reply(`I couldn't figure out the date ${dateString}. Please use the format MM/DD`)
        else if(date.isValid()){
            message.channel.send(await bday.addBirthday(message.author.id, date).catch(console.error))
            if(moment().month() + 1 === date.month() + 1 && moment().date() === date.date()){
                message.reply('your birthday is today?!? HAPPY BIRTHDAY!')
                const gifs = await giphy.search( {q:'birthday', limit:100}).catch(console.error)
                if(!gifs) return 

                const randomGif = gifs.data[Math.floor(Math.random() * gifs.data.length)]
                message.channel.send(randomGif.bitly_url)
            }
        }
    }else if(message.content.match(/^!birthday/g)){
        message.channel.send(await bday.getBirthday(message.author.id))
    }else if(message.content.match(/^!commands/g)){
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#d74561')
            .setTitle('Command List')
            .addField('!birthday', 'Show the birthday you currently have.')
            .addField('!set MM/DD', 'Set your birthday so it can be announced!')
        message.channel.send(commandsEmbed)
    }
});

// adding people with the sorting hat
client.on('messageReactionAdd', (reaction,user) => {
    const {message, emoji} = reaction
    //console.log(message, user, emoji)
    if(message.channel.id === '662128396599558175' // change to #sorting_hat
    && message.guild.id === '160072797475962881' // change to thaButtCrew
    && isMod(message.guild, user)){
        if(!hasHouse(message.member)){
            if(HP_EMOTE_ID_TO_ROLES.hasOwnProperty(emoji.id)){
                
                message.member.roles.add(HP_EMOTE_ID_TO_ROLES[emoji.id].role_id)
                .then(res => {
                    message.reply(`${HP_EMOTE_ID_TO_ROLES[emoji.id].name.toUpperCase()}!!!`)
                }).catch(err => {
                    console.log(`Error Giving Role: ${err}`)
                })
            }
        }else{
            if('356889743239413763' === emoji.id && isJoeFish(user)){
                let current_house_id;
                message.member.roles.forEach(role => {
                    if(HP_ROLE_IDS.includes(role.id)){
                        current_house_id = role.id
                    }
                })

                message.member.roles.remove(current_house_id)
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

let isMod = (guild, user) => {
    let result = false

    guild.roles.cache.forEach(role => {
        if(role.id === '264164239797649408' || role.id === '264165174414540810'){ // change to mod or god id
            role.members.forEach(member => {
                if(member.id === user.id){
                    result = true;
                }
            })
        }
    })

    return result
}

let hasHouse = (member) => {
    let result = false

    member.roles.cache.forEach(role => {
        if(HP_ROLE_IDS.includes(role.id)){
            result = true
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

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.redirect(URL))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))