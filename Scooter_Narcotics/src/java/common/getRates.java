package common;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

public class getRates {

    public static double getConRate(String ccode) {
        if (ccode.equals("SGD")) {
            return 1.0;
        }        
        
        double conRate = 0;
        try {
            URL url = new URL(Global.BASE_URL + "/rates");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            int responseCode = con.getResponseCode();

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuilder result = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                result.append(inputLine);
            }
            in.close();

            JsonObject data = new JsonParser().parse(result.toString()).getAsJsonObject();
            JsonArray recordArr = data.get("exchangeRates").getAsJsonObject().get("result").getAsJsonObject().getAsJsonArray("records").getAsJsonArray();
            JsonObject record = recordArr.get(0).getAsJsonObject();
            Set<String> keySet = record.keySet();
            for (String key : keySet) {
                if (key.contains(ccode.toLowerCase())) {
                    if (key.contains("100")) {
                        conRate = 1 / (record.get(key).getAsDouble() / 100);
                    } else {
                        conRate = 1 / record.get(key).getAsDouble();
                    }
                    break;
                }
            }
        } catch (MalformedURLException ex) {
            Logger.getLogger(getRates.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ProtocolException ex) {
            Logger.getLogger(getRates.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(getRates.class.getName()).log(Level.SEVERE, null, ex);
        }
        return conRate;
    }
}
