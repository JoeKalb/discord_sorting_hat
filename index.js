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
const checkBday = schedule.scheduleJob({hour: 15, minute: 00}, async () => { // add +7 hours from PST to get proper AWS time scheudle
    const channel = client.channels.cache.get('137074521940164608')
    const now = moment.now()

    const bdays = await bday.getTodaysBirthdays(moment().month() + 1, moment().date()).catch(console.error)
    if(!bdays) return 

    bdays.forEach(user => {
        channel.send(bday.randomBirthdayMessage(`<@${user.discordID}>`))
    })

    const gifs = await giphy.search('birthday').catch(console.error)
    if(!gifs) return 

    const randomGif = gifs.data[Math.floor(Math.random() * gifs.data.length)]
    channel.send(randomGif.bitly_url)
});

client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity('with 0s and 1s.', {type:'PLAYING'}).catch(console.error)
    
    // client.guilds.forEach(guild => {
    //     console.log(`${guild.name} guild id: ${guild.id}`)
    //     console.log(`${guild.name} roles:`)
    //     console.log(guild.roles.forEach(role => {
    //         console.log(`\t${role.name}\t${role.id}`)

    //         /* if(role.id === '264164239797649408'){
    //             role.members.forEach(member => {
    //                 console.log(`${member.displayName}: ${member.id}`)
    //             })
    //         } */
    //     }))
    //     /* console.log(`${guild.name} channels:`)
    //     console.log(guild.channels.forEach(channel => {
    //         console.log(`\t${channel.name}\t${channel.id}`)
    //     }))
    //     console.log(`${guild.name} emojis:`)
    //     console.log(guild.emojis.forEach(emoji => {
    //         console.log(`\t${emoji.name}\t${emoji.id}`)
    //     })) */
    // })
    
});

client.login(TOKEN);


client.on('message', async message => {
    if(message.author.id === '662506758102581248') return //no more endless loops!
    

	if (message.content === '!ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }else if(message.author.id === '91370189366530048' && message.content === '!updateRoles'){
        updateRoles()
        message.channel.send('Roles Updated!')
    }else if(message.content.match(/!set [a-zA-Z\s\d]+/g)){
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
        }
    }else if(message.content.match(/!birthday/g)){
        message.channel.send(await bday.getBirthday(message.author.id))
    }

    /* try{
        if(message.channel.type !== 'dm' && message.member.guild.id === '137074521940164608'){ // temp sub nights
            const { id } = message.member
    
            let buttMemberRoles = isInButtCrew(id)
            if(buttMemberRoles.length){
                //console.log(buttMemberRoles)
                if(buttMemberRoles.includes('311705462754246656') || buttMemberRoles.includes('689249934742126610')){ // Twitch Subscriber || SD: Tier 1 Sub
                    message.member.addRole('708361296541777951').catch(console.error) // T1 Butt Sub
                }
                if(buttMemberRoles.includes('689249934742126715')){ // HG: Tier 2 Sub
                    message.member.addRole('708361402229719079').catch(console.error) // T2 Butt Sub
                }
                if(buttMemberRoles.includes('689249934742126763') || buttMemberRoles.includes('278298980134420480') || buttMemberRoles.includes('278299105468350464')){
                    message.member.addRole('708361495209181195').cache(console.error) //T3++ Butt Sub
                }
                if(buttMemberRoles.includes('264165174414540810') || buttMemberRoles.includes('264164239797649408')){ // God || Professors
                    message.member.addRole('708395235134144524').cache(console.error) // Essential Employees
                }
            }
        }
    }
    catch(err)
    {console.log(err)} */
    
});
let updateRoles = () => {
    let tempServer = client.guilds.get('137074521940164608')
    let buttCrewServer = client.guilds.get('160072797475962881')

    tempServer.members.forEach(member => {
        let buttCrewMember = buttCrewServer.members.get(member.id)

        if(buttCrewMember){

            let buttCrewRoles = []

            buttCrewMember.roles.forEach(role => {
                buttCrewRoles = [...buttCrewRoles, role.id]
            })
            // remove roles
            if(member.roles.hasOwnProperty('708361296541777951')){ //T1
                if(!(buttCrewRoles.includes('311705462754246656') || buttCrewRoles.includes('689249934742126610'))){
                    member.removeRole('708361296541777951')
                    //console.log(`${member.displayName} removed from role: T1`)
                }
            }
            if(member.roles.hasOwnProperty('708361402229719079')){ //T2
                if(!buttCrewRoles.includes('689249934742126715')){
                    member.removeRole('708361402229719079')
                    //console.log(`${member.displayName} removed from role: T2`)
                }
            }
            if(member.roles.hasOwnProperty('708361495209181195')){ //T3++
                if(!(buttCrewRoles.includes('689249934742126763') || buttCrewRoles.includes('278298980134420480') || buttCrewRoles.includes('278299105468350464'))){
                    member.removeRole('708361495209181195')
                    //console.log(`${member.displayName} removed from role: T3`)
                }
            }

            // add roles
            if((buttCrewRoles.includes('311705462754246656') || buttCrewRoles.includes('689249934742126610'))
                && !member.roles.has('708361296541777951')){
                member.addRole('708361296541777951')
                //console.log(`${member.displayName} added role: T1`)
            }
            if(buttCrewRoles.includes('689249934742126715')
                && !member.roles.has('708361402229719079')){
                member.addRole('708361402229719079')
                //console.log(`${member.displayName} added role: T2`)
            }
            if((buttCrewRoles.includes('689249934742126763') || buttCrewRoles.includes('278298980134420480') || buttCrewRoles.includes('278299105468350464'))
                && !member.roles.has('708361495209181195')){
                member.addRole('708361495209181195')
                //console.log(`${member.displayName} added role: T3`)
            }
        }
    })
}

/* client.on('guildMemberAdd', member => {

    if(member.guild.id === '137074521940164608'){ // temp sub nights
        const { id } = member

        let buttMemberRoles = isInButtCrew(id)
        if(buttMemberRoles.length){
            console.log(buttMemberRoles)
            if(buttMemberRoles.includes('311705462754246656') || buttMemberRoles.includes('689249934742126610')){ // Twitch Subscriber || SD: Tier 1 Sub
                member.addRole('708361296541777951') // T1 Butt Sub
            }
            if(buttMemberRoles.includes('689249934742126715')){ // HG: Tier 2 Sub
                member.addRole('708361402229719079') // T2 Butt Sub
            }
            if(buttMemberRoles.includes('689249934742126763') || buttMemberRoles.includes('278298980134420480') || buttMemberRoles.includes('278299105468350464')){
                member.addRole('708361495209181195') //T3++ Butt Sub
            }
            if(buttMemberRoles.includes('264165174414540810') || buttMemberRoles.includes('264164239797649408')){ // God || Professors
                member.addRole('708395235134144524') // Essential Employees
            }
        }
    }
}); */

// adding people with the sorting hat
client.on('messageReactionAdd', (reaction,user) => {
    const {message, emoji} = reaction
    console.log(message, user, emoji)
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

let isInButtCrew = (id) => {
    let roleIDs = []
    client.guilds.cache.forEach(guild => {
        if(guild.id === '160072797475962881'){
            guild.members.cache.forEach(member => {
                if(member.id === id){
                    //console.log('found')
                    member.roles.cache.forEach(role => {
                        //console.log(`${role.name}: ${role.id}`)
                        roleIDs = [...roleIDs, role.id]
                    })
                }
            })
        }
    })
    return roleIDs
}

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