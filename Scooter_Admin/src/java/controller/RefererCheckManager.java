package controller;

public class RefererCheckManager {
    public static boolean refererCheck(String referer, String... fileNames) {
        if (referer.contains("https://modernvespa.sg") ||
                referer.contains("https://www.modernvespa.sg") ||
                referer.contains("https://scooternarcotics.com") ||
                referer.contains("https://www.scooternarcotics.com") ||
                referer.contains("https://scooter-narcotics.com") ||
                referer.contains("https://www.scooter-narcotics.com") ||
                referer.contains("http://localhost:8080/Scooter_Admin")) {
            boolean isFound = false;
            for (String fileName: fileNames) {
                if (referer.contains(fileName)) {
                    isFound = true;
                    break;
                }
            }
            if (referer.equals("https://modernvespa.sg/Scooter_Admin/") ||
                    referer.equals("https://www.modernvespa.sg/Scooter_Admin/") ||
                    referer.equals("https://scooternarcotics.com/Scooter_Admin/") ||
                    referer.equals("https://www.scooternarcotics.com/Scooter_Admin/") ||
                    referer.equals("https://scooter-narcotics.com/Scooter_Admin/") ||
                    referer.equals("https://www.scooter-narcotics.com/Scooter_Admin/") ||
                    referer.equals("http://localhost:8080/Scooter_Admin/")) {
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
                referer.contains("http://localhost:8080/Scooter_Admin")) {
            return true;
        }
        return false;
    }
}