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

@WebServlet(name = "ApproveFBAccountServlet", urlPatterns = {"/approveFBAccount"})
public class ApproveFBAccountServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "accountApproval.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String email = request.getParameter("email");
        String fbId = request.getParameter("fbId");
        
        if (email == null || email.trim().length() == 0 ||
                fbId == null || fbId.trim().length() == 0) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "email and fbId are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/approveFBAccount";
        String POST_PARAMS = "email=" + email + "&fbId=" + fbId;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        // Send email to notify
        String GET_URL = "https://scooter-narcotics.com/ScooterEmailer/notify";
        GET_URL += "?email=" + email + "&clientId=" + obj.get("clientId").getAsString() + "&type=fb";
        SNServer.sendGET(GET_URL);
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
