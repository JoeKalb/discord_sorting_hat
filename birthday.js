const moment = require('moment');

module.exports = {
    setBirthday: (userID, birthday)=>{
        let daysTilBday = moment().to(birthday, true)
        console.log(`userID ${userID}`)
        console.log(`Month: ${birthday.month()+1}`)
        console.log(`Day: ${birthday.date()}`)
        return `<@${userID}> your birthday is ${birthday.format("MMMM DD")}. That's ${daysTilBday} away!`
    }
}
