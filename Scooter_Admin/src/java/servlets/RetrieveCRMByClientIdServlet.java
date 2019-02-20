package servlets;

import com.google.gson.Gson;
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

@WebServlet(name = "RetrieveCRMByClientIdServlet", urlPatterns = {"/retrieveCRMByClientId"})
public class RetrieveCRMByClientIdServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "buyerAccount.jsp", "dealerAccount.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String type = request.getParameter("type");
        String clientId = request.getParameter("clientId");
        if (type == null || type.trim().isEmpty() ||
                clientId == null || clientId.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "type and clientId are required!");
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/retrieveCRMByClientId";
        String POST_PARAMS = "type=" + type + "&clientId=" + clientId;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
