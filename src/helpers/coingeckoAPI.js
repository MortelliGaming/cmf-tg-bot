import axios from 'axios'

export const coins = (tokenId, days = 1, vsCurrency = 'usd', includeHistory = false) => {
        return new Promise((resolve, reject) => {
            axios.get('https://api.coingecko.com/api/v3/coins/' + tokenId)
                .then(response => {
                    if(includeHistory) {
                        history(tokenId, days, vsCurrency).then(history => {
                            response.data.history = history
                            resolve(response.data)
                        })
                        return
                    }
                    resolve(response.data)
                }).catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    }
export const history = (tokenId, days = 1, vsCurrency = 'usd') => {
        return new Promise((resolve, reject) => {
            axios.get('https://api.coingecko.com/api/v3/coins/'+tokenId+'/market_chart?vs_currency='+vsCurrency+'&days=' + days)
            .then(response => {
                resolve(response.data)
            }).catch((err) => {
                console.log(err)
                reject(err)
            })
        })
    }