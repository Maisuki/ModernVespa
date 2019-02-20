package common;

public class StringEntityTranslator {

    public static String translate(String text) {
        String updatedText = "";
        for (char idx = 0; idx < text.length(); idx++) {
            char current = text.charAt(idx);
            int unicode = (int) current;
//            System.out.println(current + " >> " + unicode);
            switch (unicode) {
                case 8364:
                    updatedText += "&#34;";
                    break;
                case 162:
                case 194:
                case 195:
                case 339:
                case 65533:
                    break;
                default:
                    updatedText += current;
                    break;
            }
        }
        return updatedText;
    }
}
