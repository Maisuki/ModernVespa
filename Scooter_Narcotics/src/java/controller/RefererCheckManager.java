package controller;

public class RefererCheckManager {
    public static boolean refererCheck(String referer, String... fileNames) {
        if (referer.contains("https://modernvespa.sg") ||
                referer.contains("https://www.modernvespa.sg") ||
                referer.contains("https://scooternarcotics.com") ||
                referer.contains("https://www.scooternarcotics.com") ||
                referer.contains("https://scooter-narcotics.com") ||
                referer.contains("https://www.scooter-narcotics.com") ||
                referer.contains("localhost:8080/Scooter_Narcotics")) {
            boolean isFound = false;
            for (String fileName: fileNames) {
                if (referer.contains(fileName)) {
                    isFound = true;
                    break;
                }
            }
            if (referer.equals("https://scooter-narcotics.com/") ||
                    referer.equals("https://www.scooter-narcotics.com/") ||
                    referer.equals("https://scooternarcotics.com/") ||
                    referer.equals("https://www.scooternarcotics.com/") ||
                    referer.equals("https://modernvespa.sg/") ||
                    referer.equals("https://www.modernvespa.sg/")) {
                return true;
            }
            return isFound;
        }
        else {
            return false;
        }
    }
    
    public static boolean refererCheck(String referer) {
        if (referer.contains("https://modernvespa.sg") ||
                referer.contains("https://www.modernvespa.sg") ||
                referer.contains("https://scooternarcotics.com") ||
                referer.contains("https://www.scooternarcotics.com") ||
                referer.contains("https://scooter-narcotics.com") ||
                referer.contains("https://www.scooter-narcotics.com") ||
                referer.contains("localhost:8080/Scooter_Narcotics")) {
            return true;
        }
        return false;
    }
}
