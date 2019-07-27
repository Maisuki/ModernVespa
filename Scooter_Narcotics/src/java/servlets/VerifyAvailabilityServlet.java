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

@WebServlet(name = "VerifyAvailabilityServlet", urlPatterns = {"/verifyAvailability"})
public class VerifyAvailabilityServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "shop-cart.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
//        if (request.getSession().getAttribute("clientId") == null) {
//            response.getWriter().println("You must login to view your cart!");
//            return;
//        }
        
        String remoteAddr = request.getRemoteAddr();
        String xForwardedFor = request.getHeader("x-forwarded-for");

        String clientId;
        if (request.getSession().getAttribute("user") == null) {
            clientId = "-";
        }
        else {
            JsonObject userObj = (JsonObject) request.getSession().getAttribute("user");
            clientId = userObj.get("_id").getAsString();
        }

        String POST_URL = Global.BASE_URL + "/verifyAvailability";
        String POST_PARAMS = "clientId=" + clientId + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = result.getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
