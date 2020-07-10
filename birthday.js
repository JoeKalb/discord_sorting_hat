const moment = require('moment');

module.exports = {
    setBirthday: (username, birthday)=>{
        let daysTilBday = moment().to(birthday, true)
        console.log(`username ${username}`)
        console.log(`Month: ${birthday.month()+1}`)
        console.log(`Day: ${birthday.date()}`)
        return `your birthday is ${birthday.format("MMMM DD")}. That's ${daysTilBday} away!`
    }
}
