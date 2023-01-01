exports.numberWithCommas = (number, bool) => {
    if (bool) {
        number /= 1000000
        return number.toLocaleString()
    } else {
        number /= 1000000000000000000
        return number.toLocaleString()
    }
}

exports.getAmountToString = (amount) => {
    const amountConverted = parseInt(amount._hex, 16)
    const amountToConvertedToString = amountConverted.toString()

    return { amountConverted, amountToConvertedToString }
}

exports.getTreshHold = (treshold, bool) => {
    if (bool) {
        return treshold /= 1000000
    }; return treshold /= 1000000000000000000
}