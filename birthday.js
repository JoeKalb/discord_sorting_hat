const moment = require('moment');

const mongoose = require('mongoose')
const birthdayModel = require('./models/birthday.js');
const Birthday = require('./models/birthday.js');
const dotenv = require('dotenv').config(); 

mongoose.connect(`mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster0-sxqxp.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(console.error)


const getBirthday = async (discordID) => {
    return await birthdayModel.findOne( { discordID } )
}

const getMonthFromNumber = (number) =>{
    switch(number){
        case 1: return 'January'
        case 2: return 'February'
        case 3: return 'March'
        case 4: return 'April'
        case 5: return 'May'
        case 6: return 'June'
        case 7: return 'July'
        case 8: return 'August'
        case 9: return 'September'
        case 10: return 'October'
        case 11: return 'November'
        case 12: return 'December'
        default: return 'Month not found.'
    }
}

const getDaySuffix = (day) => {
    switch(day){
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        case 21: return 'st'
        case 22: return 'nd'
        case 23: return 'rd'
        case 31: return 'st'
        default: return 'th'
    }
}

module.exports = {
    addBirthday: async (discordID, birthday)=>{
        let daysTilBday = moment().to(birthday, true)
        /* console.log(`userID ${discordID}`)
        console.log(`Month: ${birthday.month()+1}`)
        console.log(`Day: ${birthday.date()}`) */

        const month = birthday.month()+1
        const day = birthday.date()

        const hasBday = await getBirthday(discordID)

        if(hasBday === null){
            const bday = new birthdayModel({
                discordID,
                month,
                day
            }).save().then(res => console.log(res)).catch(console.error)
        }
        else{
            hasBday.updateOne({ month, day }).catch(console.error)
        }
        
        return `Thank you <@${discordID}> for setting your birthday to ${birthday.format("MMMM DD")}${getDaySuffix(birthday.date())}!`
    },
    getBirthday: async(discordID) => {
        const userBday = await getBirthday(discordID)
        return (userBday)
            ?`<@${discordID}>, your birthday is currently set to ${getMonthFromNumber(userBday.month)} ${userBday.day}${getDaySuffix(userBday.day)}. If this is incorrect try "!set MM/DD" to reset your birthday.`
            :`Sorry <@${discordID}>, it looks like you haven't added your birthday in yet. To add it type "!set MM/DD" to get your birthday added and announced!`
    },
    getTodaysBirthdays: async(month, day) => {
        const birthdays = await Birthday.find({ month, day }).catch(console.error)
        return birthdays
    },
    getMonth: (monthNum) => {
        return getMonthFromNumber(monthNum)
    },
    getSuffix: (dayNum) => {
        return getDaySuffix(dayNum)
    },
    randomBirthdayMessage: (name) => {
        const messages = [
            `WOOOO! Today is <name>'s birthday!`,
            `Hold up, wait a minute, it's <name>'s birthday!`,
            `OMG! <name> was born on this very day! HAPPY BIRTHDAY!`,
            `Go <name>, it's ya birthday!`,
            `Great Scott! The day that <name> was born is this very day!`,
            `Did you know that <name>'s father invented the toaster strudel, also it's their birthday.`,
            `Today is <name>'s birthday! That's some pretty cool beans.`,
            `Happy Birthday <name>!!!`,
            `Happy happy birthday from all of us to you, we wish it was our birthday so we could party too. HEY! Happy Birthday <name>!!!`,
            `There can only be one <name>, and today is their birthday.`
        ]

        return `@here, ${messages[Math.floor(Math.random() * messages.length)].replace('<name>', name)}`
    }
}