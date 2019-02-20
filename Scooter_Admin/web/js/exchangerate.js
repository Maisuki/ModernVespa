function SGD_TO_USD_EURO(sgdPrice, ratesStorage) {
    var results = [];
    var usd, eur;
    for (var idx in ratesStorage) {
        var rateObj = ratesStorage[idx];
        if (rateObj.name.indexOf('usd') !== -1) {
            var usdPrice = parseFloat(sgdPrice) / parseFloat(rateObj.rate);
            usd = usdPrice.toFixed(2);
        }
        if (rateObj.name.indexOf('eur') !== -1) {
            var eurPrice = parseFloat(sgdPrice) / parseFloat(rateObj.rate);
            eur = eurPrice.toFixed(2);
        }
    }
    results.push(usd);
    results.push(eur);
    return results;
}

function USD_TO_SGD_EURO(usdPrice, ratesStorage) {
    var results = [];
    var sgd, eur;
    var sgdPrice;
    // get sgd price first
    for (var idx in ratesStorage) {
        var rateObj = ratesStorage[idx];
        if (rateObj.name.indexOf('usd') !== -1) {
            sgdPrice = parseFloat(usdPrice) * parseFloat(rateObj.rate);
            sgd = sgdPrice.toFixed(2);
        }
    }

    // get eur price nw
    for (var idx in ratesStorage) {
        var rateObj = ratesStorage[idx];
        if (rateObj.name.indexOf('eur') !== -1) {
            var eurPrice = parseFloat(sgdPrice) / parseFloat(rateObj.rate);
            eur = eurPrice.toFixed(2);
        }
    }
    results.push(sgd);
    results.push(eur);
    return results;
}

function EUR_TO_SGD_USD(eurPrice, ratesStorage) {
    var results = [];
    var sgd, usd;
    var sgdPrice;
    // get sgd price first
    for (var idx in ratesStorage) {
        var rateObj = ratesStorage[idx];
        if (rateObj.name.indexOf('eur') !== -1) {
            sgdPrice = parseFloat(eurPrice) * parseFloat(rateObj.rate);
            sgd = sgdPrice.toFixed(2);
        }
    }

    // get usd price nw
    for (var idx in ratesStorage) {
        var rateObj = ratesStorage[idx];
        if (rateObj.name.indexOf('usd') !== -1) {
            var usdPrice = parseFloat(sgdPrice) / parseFloat(rateObj.rate);
            usd = usdPrice.toFixed(2);
        }
    }
    results.push(sgd);
    results.push(usd);
    return results;
}