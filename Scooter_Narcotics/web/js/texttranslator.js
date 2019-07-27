function translate(text) {
    var translatedText = "";
    var isFound = false;
    for (var i = 0; i < text.length; i++) {
        var currentChar = text.charAt(i);
        var currentCharCode = currentChar.charCodeAt(0);
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
            case 63:
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
    translatedText = translatedText.replace(/%20/g, " ");
    return translatedText;
}