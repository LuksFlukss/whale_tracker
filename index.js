// Code your whale tracker script here!
const { ethers, Contract } = require("ethers")

const rpcURL = 'https://cloudflare-eth.com/'    //Free ETH-NODE

const provider = new ethers.providers.JsonRpcProvider(rpcURL)

const CONTRACT_ADDRESS_USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' //USDC
const CONTRACT_ADDRESS_USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7' //USDT
const CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

//Note in USDC six last 0's are decimals. They rest of currencies normally use 18. 
const TRANSFER_THRESHOLD = 1000000000000 // 1,000,000 USDC/USDT (in wei)

const contract_USDC = new Contract(CONTRACT_ADDRESS_USDC, CONTRACT_ABI, provider)
const contract_USDT = new Contract(CONTRACT_ADDRESS_USDT, CONTRACT_ABI, provider)

const previous_amount = 0

const main = async () => {
    const name_USDC = await contract_USDC.name()
    const name_USDT = await contract_USDT.name()

    console.log(`Started Whale Tracker!\nListing for larga transfers on ${name_USDC}/${name_USDT}`)

    contract_USDC.on('Transfer', (from, to, amount, data) => {

        //console.log(from, to , amount, data)
        const amount_decimal = parseInt(amount._hex, 16)
        const amount_decimal_toString = actual_amount = amount_decimal.toString()

        //console.log(`${amount_decimal_toString}\n${amount}`)
        if(amount_decimal_toString >= TRANSFER_THRESHOLD) {
            if(actual_amount != previous_amount){
                console.log(`New whale transfer for ${name_USDC}:\n
                Amount = ${amount_decimal_toString}\n
                from = ${from}\n
                to = ${to}\n
                https://etherscan.io/tx/${data.transactionHash}`)

                const previous_amount = actual_amount
            }
        }
    })
    
    contract_USDT.on('Transfer', (from, to, amount, data) => {
        
        //console.log(from, to , amount, data)
        const amount_decimal = parseInt(amount._hex, 16)
        const amount_decimal_toString = amount_decimal.toString()

        //console.log(`${amount_decimal_toString}\n${amount}`)
        if(amount_decimal_toString >= TRANSFER_THRESHOLD) {
            if(actual_amount != previous_amount){
                console.log(`New whale transfer for ${name_USDT}:\n
                Amount = ${amount_decimal_toString}\n
                from = ${from}\n
                to = ${to}\n
                https://etherscan.io/tx/${data.transactionHash}`)

                const previous_amount = actual_amount
            }
        }
    }) 
}
main()
