
const { Telegraf } = require('telegraf')
const puppeteer = require('puppeteer-extra')

require('dotenv').config()
const {
    loadAllTokenIds,
    loadCurrencies,
    loadCoinInfo,
    loadHistoryData,
    loadTopTokens,
    loadTrendingList
} = require('./coingeckoAPI')

const {
    getErrorMessage
} = require('./errormessages')

const VUE_PORT = (process.env.VUE_SERVER_PORT || 8080)

var puppeteerBrowser = null
var currencies = []

loadAllTokens =  function() {
    loadCurrencies().then(result => {
        currencies = result
    })
}

initializeBot = function() {
        const bot = new Telegraf(process.env.TG_BOT_TOKEN)
        bot.start((ctx) => ctx.reply('This is the CMF Bot \n \n type /i [tokenname or symbol] [num of days] [compare-currency] for the price ticker image \n type /markets [tokenname or symbol] for the markets \n\n /volume /cap works the same as /i'))
        // bot.help((ctx) => ctx.reply('Send me a sticker'))
        // bot.on('sticker', (ctx) => ctx.reply('👍'))
        // bot.hears('hi', (ctx) => ctx.reply('Hey there'))

        bot.hears(/^\/i (.+)/, (ctx) => {
            const params = ctx.message.text.replace('/i ','')
            var currency = getCompareCurrency(params)
            var tokenSymbol = getToken(params)
            var days = getDays(params)
            
            loadAllTokenIds().then((tokenList) => {
                var found = false
                tokenList.map(tokenInfo => {
                    if(tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
                        replyWithTicker(ctx, tokenInfo.id, days, currency, 'prices', 'Price', false)
                        found = true;
                    }
                })
                if(!found)
                    ctx.reply(getErrorMessage())
            })
        })

        bot.hears(/^\/cap (.+)/, (ctx) => {
            const params = ctx.message.text.replace('/cap ','')

            var currency = getCompareCurrency(params)
            var tokenSymbol = getToken(params)
            var days = getDays(params)
            
            loadAllTokenIds().then((tokenList) => {
                var found = false
                tokenList.map(tokenInfo => {
                    if(tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
                        replyWithTicker(ctx, tokenInfo.id, days, currency, 'market_caps', 'Market Capitalisation')
                        found = true;
                    }
                })
                if(!found)
                    ctx.reply(getErrorMessage())
            })
        })

        bot.hears(/^\/volume (.+)/, (ctx) => {
            const params = ctx.message.text.replace('/volume ','')

            var currency = getCompareCurrency(params)
            var tokenSymbol = getToken(params)
            var days = getDays(params)
            
            loadAllTokenIds().then((tokenList) => {
                var found = false
                tokenList.map(tokenInfo => {
                    if(tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
                        replyWithTicker(ctx, tokenInfo.id, days, currency, 'total_volumes', 'Volume')
                        found = true;
                    }
                })
                if(!found)
                    ctx.reply(getErrorMessage())
            })
        })

        bot.hears(/^\/markets (.+)/, (ctx) => {
            const params = ctx.message.text.replace('/markets ','')
            var tokenSymbol = ''
            if(params.includes(' ')) {
                tokenSymbol = params.split(' ')[0]
            } else {
                tokenSymbol = params
            }
            loadAllTokenIds().then((tokenList) => {
                var found = false
                tokenList.map(tokenInfo => {
                    if(tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
                        replyWithTokenMarkets(ctx, tokenInfo.id)
                        found = true;
                    }
                })
                if(!found)
                    ctx.reply(getErrorMessage())
            })
        })


        bot.hears("/t", (ctx) => {
            loadTrendingList().then((tokenList) => {
                var tokenLinks = []
                tokenList.coins.map((tokenInfo) => {
                    tokenLinks.push('['+tokenInfo.item.name + ' ('+tokenInfo.item.symbol+')]('+'https://coingecko.com/coins/'+tokenInfo.item.id+')')
                })
                ctx.reply('*Trending on Coingecko:* \n\n' + tokenLinks.join('\n'), { parse_mode: "Markdown" })
            })
        })

        bot.on('callback_query', (ctx) => {
            if(ctx.callbackQuery.data.includes('{{[i]}}')) {
                replyWithTicker(ctx, ctx.callbackQuery.data.replace('{{[i]}}', ''), 1, 'USD', 'prices', 'Price')
            }
            if(ctx.callbackQuery.data.includes('{{[cap]}}')) {
                replyWithTicker(ctx, ctx.callbackQuery.data.replace('{{[cap]}}', ''), 1, 'USD', 'market_caps', 'Market Capitalisation')
            }
            if(ctx.callbackQuery.data.includes('{{[volume]}}')) {
                replyWithTicker(ctx, ctx.callbackQuery.data.replace('{{[volume]}}', ''), 1, 'USD', 'total_volumes', 'Volume')
            }
            if(ctx.callbackQuery.data.includes('{{[markets]}}')) {
                replyWithTokenMarkets(ctx, ctx.callbackQuery.data.replace('{{[markets]}}', ''),)
            }
            
            ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
            // Using context shortcut
            ctx.answerCbQuery()
        })

        bot.command("i", (ctx) => {
            loadTopTokens().then((tokenList) => {
                var keys =  getTopTokenKeys('{{[i]}}', tokenList)
                bot.telegram.sendMessage(ctx.chat.id, "*choose a token*", {
                    reply_markup: {
                        inline_keyboard: keys
                    },
                    parse_mode: "MarkdownV2"
                })
            })
        })
        bot.command("top", (ctx) => {
            loadTopTokens().then((tokenList) => {
                var allSymbols = [];

                var sortedTokens = tokenList.sort((a, b) => {
                    return a.market_cap_rank - b.market_cap_rank
                }).map(info => {
                    return {
                        rank: info.market_cap_rank,
                        name: info.name,
                        symbol: info.symbol,
                        image: info.image
                    }
                })

                console.log(sortedTokens.length)
                sortedTokens = sortedTokens.filter((item) => {
                    console.log(item.symbol)
                    if(allSymbols.includes(item.symbol)) {
                        return false
                    }
                    allSymbols.push(item.symbol)
                    return true
                })
                console.log(sortedTokens.length)
                var sortedTokens = sortedTokens.slice(0,10)
                console.log(sortedTokens)
                console.log('http://localhost:'+VUE_PORT+'/toptenticker?tokenInfos='+JSON.stringify(sortedTokens))
                replyWithScreenshot(ctx, 'http://localhost:'+VUE_PORT+'/toptenticker?tokenInfos='+JSON.stringify(sortedTokens))
            })
        })
        bot.command("cap", (ctx) => {
            loadTopTokens().then((tokenList) => {
                var keys =  getTopTokenKeys('{{[cap]}}', tokenList)
                bot.telegram.sendMessage(ctx.chat.id, "*choose a token*", {
                    reply_markup: {
                        inline_keyboard: keys
                    },
                    parse_mode: "MarkdownV2"
                })
            })
        })
        bot.command("volume", (ctx) => {
            loadTopTokens().then((tokenList) => {
                var keys =  getTopTokenKeys('{{[volume]}}', tokenList)
                bot.telegram.sendMessage(ctx.chat.id, "*choose a token*", {
                    reply_markup: {
                        inline_keyboard: keys
                    },
                    parse_mode: "MarkdownV2"
                })
            })
        })

        bot.command("markets", (ctx) => {
            loadTopTokens().then((tokenList) => {
                var keys =  getTopTokenKeys('{{[markets]}}', tokenList)
                bot.telegram.sendMessage(ctx.chat.id, "*choose a token*", {
                    reply_markup: {
                        inline_keyboard: keys
                    },
                    parse_mode: "MarkdownV2"
                })
            })
        })

        bot.command("currencies", (ctx) => {
            ctx.reply('*Supported Ticker Convert Currencies:* \n\n' + currencies.join('\n'), { parse_mode: "Markdown" })
        })

        bot.launch()

        
        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'))
        process.once('SIGTERM', () => {bot.stop('SIGTERM'); puppeteerBrowser.close();})
    }
const bot = new Telegraf(process.env.TG_BOT_TOKEN)

module.exports = {
    setupTGBot() {
        loadAllTokens()
        puppeteer.launch({
            defaultViewport: {
                height: 820,
                width: 1400,
            },
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        }).then(browser => {
            puppeteerBrowser = browser
            initializeBot();
        })
    }
}

function replyWithTicker(ctx, tokenId, days, currency, priceProperty, caption, abbreviateValue = true) {
    loadCoinInfo(tokenId).then(coinInfo => {
        loadHistoryData(tokenId, days, priceProperty).then(tokenHistory => {
            console.log(coinInfo)
            replyWithBaseTickerImage(ctx,
                coinInfo.symbol.toUpperCase(),
                coinInfo.name,
                (tokenHistory.prices[tokenHistory.prices.length-1].y ? tokenHistory.prices[tokenHistory.prices.length-1].y : coinInfo.price),
                coinInfo.image.large,
                (tokenHistory.prices[tokenHistory.prices.length-1].y * 100 / tokenHistory.prices[0].y) - 100,
                (days > 1 ? days + ' days': '24 hours'),
                coinInfo.market_cap_rank,
                currency.toUpperCase(),
                tokenHistory.prices,
                caption + ' in '+ currency.toUpperCase(),
                abbreviateValue)
        })
    })
}

function getTopTokenKeys(callbackPrefix, tokenList) {
    var keyData =  tokenList.sort((a, b) => {
        return a.market_cap_rank - b.market_cap_rank
    }).map(item => {
        return {
            callback_data: callbackPrefix + item.id,
            text: item.name + ' (' + item.symbol.toUpperCase() + ')',
        }
    })
    var rowCounter = 0
    var keys = [];
    keyData.slice(0,10).map(key => {
        if(!keys[rowCounter]) {
            keys[rowCounter] = []
        }
        keys[rowCounter].push(key)
        if(keys[rowCounter].length == 2) {
            rowCounter++
        }
    })
    return keys
}

function getCompareCurrency(params) {
    var compareCurrency = 'usd'
    currencyParam = params.split(' ').length > 1 && params.split(' ')[params.split(' ').length -1]
    if (currencyParam && currencies.includes(currencyParam.toLowerCase())) {
        compareCurrency = currencyParam
    }
    return compareCurrency
}

function getToken(params) {
    return tokenSymbol = params.includes(' ')? params.split(' ')[0] : params
}

function getDays(params) {
    return params.split(' ').length > 1 ? (Number.isInteger(Number.parseInt(params.split(' ')[1])) ? Number.parseInt(params.split(' ')[1]) : 1) : 1
}

function replyWithBaseTickerImage(ctx, tokenSymbol, tokenName, tokenValue, tokenImage, tokenChange, timespan, tokenRank, conversionCurrency, graphData, caption, abbreviateValue) {
    replyWithScreenshot(ctx, createBaseTickerUrl(tokenSymbol, tokenName, tokenValue, tokenImage, tokenChange, timespan, tokenRank, conversionCurrency, graphData, caption, abbreviateValue))
}

function replyWithTokenMarkets(ctx, tokenId) {
    loadCoinInfo(tokenId).then((tokenData) => {
        var markets = []
        tokenData.tickers.map(ticker => {
            if(!markets.includes(ticker.market.name))
               markets.push(ticker.market.name)
        })
        ctx.reply('*'+tokenData.name +' ('+tokenData.symbol.toUpperCase()+') ' + ' is traded on following markets:* \n\n' + markets.join('\n'), { parse_mode: "Markdown" })
    }).catch(err => {
        console.log(err)
        // ctx.reply('sorry sir/madame/other non-binary individuum, there was an error while processing your request')
    })
}

function replyWithScreenshot(ctx, url) {
    puppeteerBrowser.newPage().then(async page => {
        // page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")
        page.goto(url, {"waitUntil" : "networkidle0"}).then(async () => {
            page.screenshot().then(screenshot => {
                ctx.replyWithPhoto({source: screenshot})
            })
        })
    })
}

function createBaseTickerUrl(tokenSymbol, tokenName, tokenValue, tokenImage, tokenChange, timespan, tokenRank, conversionCurrency, graphData, caption, abbreviateValue) {
    var url = 'http://localhost:'+VUE_PORT+'/customvalueticker?'+
        'tokenValue='+tokenValue +
        '&tokenSymbol='+tokenSymbol+
        '&tokenName='+tokenName+
        '&timespan='+timespan+
        '&caption='+caption+
        '&tokenChangePercentage='+tokenChange+
        '&tokenRank='+tokenRank+
        '&conversionCurrency='+conversionCurrency+
        '&graphdata='+JSON.stringify(graphData)+
        '&tokenImage='+tokenImage +
        '&abbreviateValue='+abbreviateValue
    return url;
}