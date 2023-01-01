const { ethers, Contract } = require("ethers")
const rpcURL = 'https://cloudflare-eth.com/'
const provider = new ethers.providers.JsonRpcProvider(rpcURL)
const functionDiscord = require('./discord.js')
const operations = require('./operations.js')
let imgURL
var boolDecimals

//===============================================
const CONTRACT_ADDRESS_USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' //USDC
const CONTRACT_ADDRESS_USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7' //USDT
const CONTRACT_ADDRESS_BUSD = '0x4Fabb145d64652a948d72533023f6E7A623C7C53' //BUSD
// Contracts To add => SHIB, FTM, BNB, MATIC, DAI, UNI
const CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
var TRANSFER_THRESHOLD_6 = 1000000000000 //1,000,000 TreshHold
var TRANSFER_THRESHOLD_18 = 1000000000000000000000000 //1,000,000 TreshHold
//===============================================

const contract_USDC = new Contract(CONTRACT_ADDRESS_USDC, CONTRACT_ABI, provider)
const contract_USDT = new Contract(CONTRACT_ADDRESS_USDT, CONTRACT_ABI, provider)
const contract_BUSD = new Contract(CONTRACT_ADDRESS_BUSD, CONTRACT_ABI, provider)

const main = async () => {

    const nameUSDC = await contract_USDC.name()
    const nameUSDT = await contract_USDT.name()
    const nameBUSD = await contract_BUSD.name()

    console.log(`🏁 Started ${nameUSDC}, ${nameUSDT} & ${nameBUSD} Tracker `)
    contract_USDC.on('Transfer', (from, to, amount, data) => {
        let values = operations.getAmountToString(amount)
        boolDecimals = true
        //TRANSFER_THRESHOLD = operations.getTreshHold(TRANSFER_THRESHOLD, boolDecimals)
        if(values.amountToConvertedToString >= TRANSFER_THRESHOLD_6) {

            console.log("*****************************")
            console.log(`🌪 TreshHold => ${TRANSFER_THRESHOLD_6}`)
            console.log(`🥕 New ${nameUSDC} Tranfer`)
            console.log(`💵 Amount => ${operations.numberWithCommas(values.amountConverted, boolDecimals)}`)
            console.log(`👦 From => ${from}`)
            console.log(`👨 To => ${to}`)
            console.log(`🔨 BlockNumber => ${data.blockNumber}`)
            console.log(`⛩  Event => ${data.event}`)
            console.log(`#️⃣  Transaction Hash => ${data.transactionHash}`)
            console.log("*****************************")

            imgURL = 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'

            functionDiscord.sendInfoToDiscord(nameUSDC, from, to, operations.numberWithCommas(values.amountConverted, boolDecimals), data, data.blockNumber, values.amountConverted, imgURL )
        }
    })

    contract_USDT.on('Transfer', (from, to, amount, data) => {
        let values = operations.getAmountToString(amount)
        boolDecimals = true
        //TRANSFER_THRESHOLD = operations.getTreshHold(TRANSFER_THRESHOLD, boolDecimals)
        if(values.amountToConvertedToString >= TRANSFER_THRESHOLD_6) {

            console.log("*****************************")
            console.log(`🌪 TreshHold => ${TRANSFER_THRESHOLD_6}`)
            console.log(`🚚 New ${nameUSDT} Tranfer`)
            console.log(`💵 Amount => ${operations.numberWithCommas(values.amountConverted, boolDecimals)}`)
            console.log(`👦 From => ${from}`)
            console.log(`👨 To => ${to}`)
            console.log(`🔨 BlockNumber => ${data.blockNumber}`)
            console.log(`⛩  Event => ${data.event}`)
            console.log(`#️⃣  Transaction Hash => ${data.transactionHash}`)
            console.log("*****************************")

            imgURL = 'https://cryptologos.cc/logos/tether-usdt-logo.png'

            functionDiscord.sendInfoToDiscord(nameUSDT, from, to, operations.numberWithCommas(values.amountConverted, boolDecimals), data, data.blockNumber, values.amountConverted, imgURL )
        }
    })

    contract_BUSD.on('Transfer', (from, to, amount, data) => {
        let values = operations.getAmountToString(amount)
        boolDecimals = false
        //TRANSFER_THRESHOLD = operations.getTreshHold(TRANSFER_THRESHOLD, boolDecimals)
        if(values.amountToConvertedToString >= TRANSFER_THRESHOLD_18) {

            console.log("*****************************")
            console.log(`🌪 TreshHold => ${TRANSFER_THRESHOLD_18}`)
            console.log(`🚚 New ${nameBUSD} Tranfer`)
            console.log(`💵 Amount => ${operations.numberWithCommas(values.amountConverted, boolDecimals)}`)
            console.log(`👦 From => ${from}`)
            console.log(`👨 To => ${to}`)
            console.log(`🔨 BlockNumber => ${data.blockNumber}`)
            console.log(`⛩  Event => ${data.event}`)
            console.log(`#️⃣  Transaction Hash => ${data.transactionHash}`)
            console.log("*****************************")

            imgURL = 'https://cryptologos.cc/logos/binance-usd-busd-logo.png'

            functionDiscord.sendInfoToDiscord(nameBUSD, from, to, operations.numberWithCommas(values.amountConverted, boolDecimals), data, data.blockNumber, values.amountConverted, imgURL )
        }
    })

}; main()