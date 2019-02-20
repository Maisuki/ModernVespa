package common;

import com.google.gson.JsonObject;

public class MessageHandler {
    public static JsonObject errorMessageGenerator(String message) {
        JsonObject error = new JsonObject();
        error.addProperty("status", false);
        error.addProperty("message", message);
        return error;
    }
    
    public static JsonObject successMessageGenerator(String message) {
        JsonObject error = new JsonObject();
        error.addProperty("status", true);
        error.addProperty("message", message);
        return error;
    }
}
