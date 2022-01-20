


const axios = require('axios')

function getErrorMessage() {
    return errorMessages[getRandomInt(errorMessages.length)]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const errorMessages = [
    'our sloth has not found this token yet! - search for another one',
    'searching for tik tok tokens agian? not with me!',
    "no one knows that coin dude, it's probably worthless",
    'seriously?!',
    "Hold up, we're still waiting on sloth to list that one",
    "We don't have that coin, now go away!",
    'come on, not that shit again!',
    "that token does not exist on coingecko - may the force be with you",
]



module.exports = {
    errorMessages,
    getErrorMessage
}