
const { Telegraf } = require('telegraf')
const puppeteer = require('puppeteer-extra')

require('dotenv').config()
const {
    loadAllTokenIds,
    loadCurrencies,
    loadCoinInfo,
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
                    if(tokenInfo.id.toUpperCase() === tokenSymbol.toUpperCase() ||tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
                        console.log(tokenInfo.id)
                        replyWithPriceTicker(ctx, tokenInfo.id, days, currency)
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
                    if(tokenInfo.id.toUpperCase() === tokenSymbol.toUpperCase() ||tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
                        replyWithMarketCapTicker(ctx, tokenInfo.id, days, currency)
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
                    if(tokenInfo.id.toUpperCase() === tokenSymbol.toUpperCase() ||tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
                        replyWithVolumeTicker(ctx, tokenInfo.id, days, currency)
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
                    if(tokenInfo.id.toUpperCase() === tokenSymbol.toUpperCase() ||tokenInfo.symbol.toUpperCase() === tokenSymbol.toUpperCase() || tokenInfo.name.toUpperCase() === tokenSymbol.toUpperCase()) {
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
                replyWithPriceTicker(ctx, ctx.callbackQuery.data.replace('{{[i]}}', ''), 1, 'USD')
                ctx.deleteMessage();
            }
            if(ctx.callbackQuery.data.includes('{{[cap]}}')) {
                replyWithMarketCapTicker(ctx, ctx.callbackQuery.data.replace('{{[cap]}}', ''), 1, 'USD')
                ctx.deleteMessage();
            }
            if(ctx.callbackQuery.data.includes('{{[volume]}}')) {
                replyWithVolumeTicker(ctx, ctx.callbackQuery.data.replace('{{[volume]}}', ''), 1, 'USD')
                ctx.deleteMessage();
            }
            if(ctx.callbackQuery.data.includes('{{[markets]}}')) {
                replyWithTokenMarkets(ctx, ctx.callbackQuery.data.replace('{{[markets]}}', ''),)
                ctx.deleteMessage();
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

                sortedTokens = sortedTokens.filter((item) => {
                    if(allSymbols.includes(item.symbol)) {
                        return false
                    }
                    allSymbols.push(item.symbol)
                    return true
                })
                var sortedTokens = sortedTokens.slice(0,10)
                // console.log('http://localhost:'+VUE_PORT+'/toptenticker?tokenInfos='+JSON.stringify(sortedTokens))
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
        }).then(async browser => {
            puppeteerBrowser = browser
            initializeBot();
            await clearPupeteerPages()
        })
    },
}

function replyWithPriceTicker(ctx, tokenId, days, currency) {
    loadCoinInfo(tokenId).then(coinInfo => {
        replyWithCoingeckoPriceTickerImage(ctx, coinInfo.id, days, currency)
    })
}
function replyWithVolumeTicker(ctx, tokenId, days, currency) {
    loadCoinInfo(tokenId).then(coinInfo => {
        replyWithCoingeckoVolumeTickerImage(ctx, coinInfo.id, days, currency)
    })
}
function replyWithMarketCapTicker(ctx, tokenId, days, currency) {
    loadCoinInfo(tokenId).then(coinInfo => {
        replyWithCoingeckoMarketCapTickerImage(ctx, coinInfo.id, days, currency)
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

function replyWithBasicTextTickerImage(ctx, caption, value) {
    replyWithScreenshot(ctx, createBasicTextTickerUrl(caption, value))
}
function replyWithCoingeckoPriceTickerImage(ctx, tokenId, days, vsCurrency) {
    replyWithScreenshot(ctx, createCoingeckoPriceTickerUrl(tokenId, days, vsCurrency))
}
function replyWithCoingeckoVolumeTickerImage(ctx, tokenId, days, vsCurrency) {
    replyWithScreenshot(ctx, createCoingeckoVolumeTickerUrl(tokenId, days, vsCurrency))
}
function replyWithCoingeckoMarketCapTickerImage(ctx, tokenId, days, vsCurrency) {
    replyWithScreenshot(ctx, createCoingeckoMarketCapTickerUrl(tokenId, days, vsCurrency))
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
    })
}

async function clearPupeteerPages() {
    const pages = await puppeteerBrowser.pages()
    for(page in pages) {
        pages[page].close()
    }
}

function replyWithScreenshot(ctx, url) {
    puppeteerBrowser.newPage().then(async page => {
        // page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")
        page.goto(url, {"waitUntil" : "networkidle0"}).then(async () => {
            page.screenshot().then(screenshot => {
                ctx.replyWithPhoto({source: screenshot})
                page.close()
            })
        })
    })
}

function createCoingeckoPriceTickerUrl(tokenId, days, vsCurrency) {
    var url = 'http://localhost:'+VUE_PORT+'/coingeckopriceticker?'+
        'tokenId='+tokenId +
        '&vsCurrency='+vsCurrency +
        '&days='+days
    console.log('ticker url: ', url)
    return url;
}

function createCoingeckoVolumeTickerUrl(tokenId, days, vsCurrency) {
    var url = 'http://localhost:'+VUE_PORT+'/coingeckovolumeticker?'+
        'tokenId='+tokenId +
        '&vsCurrency='+vsCurrency +
        '&days='+days
    console.log('ticker url: ', url)
    return url;
}

function createCoingeckoMarketCapTickerUrl(tokenId, days, vsCurrency) {
    var url = 'http://localhost:'+VUE_PORT+'/coingeckomarketcapticker?'+
        'tokenId='+tokenId +
        '&vsCurrency='+vsCurrency +
        '&days='+days
    console.log('ticker url: ', url)
    return url;
}

function createBasicTextTickerUrl(caption, value) {
    var url = 'http://localhost:'+VUE_PORT+'/basictextticker?'+
        'caption='+caption +
        '&value='+value
    console.log('ticker url: ', url)
    return url;
}