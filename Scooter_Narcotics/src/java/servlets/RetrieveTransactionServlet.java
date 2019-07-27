package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "RetrieveTransactionServlet", urlPatterns = {"/retrieveTransactions"})
public class RetrieveTransactionServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "orders.jsp", "account.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("user") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to view your transactions!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        JsonObject userObj = (JsonObject) request.getSession().getAttribute("user");
        String clientId = userObj.get("_id").getAsString();
        
        String POST_URL = Global.BASE_URL + "/retrieveTransactions";
        String POST_PARAMS = "clientId=" + clientId;
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject objResult = result.getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(objResult));
    }
    
}
