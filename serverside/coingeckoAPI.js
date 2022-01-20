


const axios = require('axios')

var lastIdLoadTimeStamp = 0
var tokenList = []
var topTokenList = []

function loadAllTokenIds() {
    return new Promise((resolve, reject) => {
        if(lastIdLoadTimeStamp + 6 * 60 * 60 * 1000 < Date.now()) {
            axios.get('https://api.coingecko.com/api/v3/coins/list')
            .then(response => {
                lastIdLoadTimeStamp = Date.now()
                tokenList = response.data
                resolve(tokenList)
            }).catch((err) => {
                console.log(err)
                reject(err)
            })
        } else {
            resolve(tokenList)
        }
    })
}

function loadTopTokens() {
    return new Promise((resolve, reject) => {
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc')
        .then(response => {
            topTokenList = response.data
            resolve(topTokenList)
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

function loadCurrencies() {
    return new Promise((resolve, reject) => {
        axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
        .then(response => {
            resolve(response.data)
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

function loadCoinInfo(tokenId) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.coingecko.com/api/v3/coins/' + tokenId)
        .then(response => {
            resolve(response.data)
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

function loadHistoryData(tokenId, days, chartProperty='prices') {
    return new Promise((resolve, reject) => {
        axios.get('https://api.coingecko.com/api/v3/coins/'+tokenId+'/market_chart?vs_currency=usd&days=' + days)
        .then(response => {

            var chartDataArray = response.data[chartProperty].map(entry => {return {x: entry[0], y: entry[1]}})
            var shrinkedData = chartDataArray
            while(shrinkedData.length >= 60) {
                chartDataArray = shrinkedData
                shrinkedData = []
                for (var i = 0; i < chartDataArray.length; i = i+2) {
                    shrinkedData.push(chartDataArray[i]);
                };
            }
            chartDataArray = shrinkedData
            resolve({
                prices: chartDataArray,
                timestamps: response.data[chartProperty].map(entry => entry[0]),
            })
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

function loadTrendingList() {
    return new Promise((resolve, reject) => {
        axios.get('https://api.coingecko.com/api/v3/search/trending')
            .then(response => {
                resolve(response.data)
            }).catch((err) => {
                console.log(err)
                reject(err)
            })
    })
}



module.exports = {
    loadTrendingList,
    loadAllTokenIds,
    loadCoinInfo,
    loadHistoryData,
    loadCurrencies,
    loadTopTokens
}