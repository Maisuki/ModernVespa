function translate(text) {
    var translatedText = "";
    var isFound = false;
    for (var i = 0; i < text.length; i++) {
        var currentChar = text.charAt(i);
        var currentCharCode = currentChar.charCodeAt(0);
//        console.log(currentChar + " >> " + currentCharCode);
        switch (currentCharCode) {
            case 13:
                translatedText += "<br>";
                isFound = false;
                i += 1;
                break;
            case 131:
                if (!isFound) {
                    translatedText += "&#216;";
                    isFound = !isFound;
                } else {
                    i += 3;
                }
                break;
            case 130:
                translatedText = translatedText.substring(0, translatedText.length - 1);
                break;
            case 128:
            case 152:
            case 156:
            case 157:
            case 194:
            case 195:
            case 65533:
                break;
            case 226:
                translatedText += "\"";
                isFound = false;
                break;
            default:
                translatedText += currentChar;
                isFound = false;
        }
    }
    return translatedText;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};