package controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class SNServer {

    public static JsonElement sendPOST(String POST_URL, String POST_PARAMS) throws IOException {
        try {
            URL url = new URL(POST_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Accept", "application/json");
            // For POST only - START
            conn.setDoOutput(true);
            OutputStream os = conn.getOutputStream();
            os.write(POST_PARAMS.getBytes());
            os.flush();
            os.close();
            // For POST only - END

            int responseCode = conn.getResponseCode();

            System.out.println("POST Response Code :: " + responseCode);

            if (responseCode == HttpURLConnection.HTTP_OK) { //success
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "8859_1"));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                String results = response.toString();
                if (results.charAt(0) == '[' && results.charAt(results.length() - 1) == ']') {
                    JsonArray arr = new JsonParser().parse(results).getAsJsonArray();
                    return arr;
                } else {
                    JsonObject obj = new JsonParser().parse(results).getAsJsonObject();
                    return obj;
                }
            } else {
                System.out.println("POST request not worked");
                return null;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public static boolean verifyRecaptcha(String payload) {
        try {
            String POST_URL = "https://www.google.com/recaptcha/api/siteverify";
            String POST_PARAMS = "secret=" + "6LdoxT0UAAAAACL9PZICLM7nl-nXxhMYSGbmKB1o" + "&response=" + payload;
            JsonElement result = sendPOST(POST_URL, POST_PARAMS);
            JsonObject o = result.getAsJsonObject();
            boolean status = o.get("success").getAsBoolean();
            return status;
        } catch (IOException e) {
            return false;
        }
    }

    public static JsonObject verifyForgetPassword(String email) {
        try {
            String POST_URL = Global.BASE_URL + "/verifyUser";
            String POST_PARAMS = "email=" + email;
            JsonElement result = sendPOST(POST_URL, POST_PARAMS);
            JsonObject response = result.getAsJsonObject();
            return response;
        } catch (IOException e) {
            JsonObject response = new JsonObject();
            response.addProperty("status", Boolean.FALSE);
            response.addProperty("message", "Something went wrong! Please contact the administrator!");
            return response;
        }
    }

    public static JsonObject verifyKey(String key) {
        try {
            String POST_URL = Global.BASE_URL + "/verifyKey";
            String POST_PARAMS = "key=" + key;
            JsonElement result = sendPOST(POST_URL, POST_PARAMS);
            JsonObject response = result.getAsJsonObject();
            return response;
        } catch (IOException e) {
            JsonObject response = new JsonObject();
            response.addProperty("status", Boolean.FALSE);
            response.addProperty("message", "Something went wrong! Please contact the administrator!");
            return response;
        }
    }

    public static JsonElement sendGET(String serviceUrl) {
        try {
            URL url = new URL(serviceUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("Content-Type", "text/html;charset=iso-8859-1");
            int responseCode = conn.getResponseCode();
            System.out.println("GET Response Code :: " + responseCode);
            if (responseCode == HttpURLConnection.HTTP_OK) { // success
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "8859_1"));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                String results = response.toString();
                if (results.charAt(0) == '[' && results.charAt(results.length() - 1) == ']') {
                    JsonArray arr = new JsonParser().parse(results).getAsJsonArray();
                    return arr;
                } else {
                    JsonObject obj = new JsonParser().parse(results).getAsJsonObject();
                    return obj;
                }
            } else {
                System.out.println("GET request not worked");
                return null;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
