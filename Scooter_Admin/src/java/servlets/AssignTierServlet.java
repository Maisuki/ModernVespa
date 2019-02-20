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

@WebServlet(name = "AssignTierServlet", urlPatterns = {"/assignTier"})
public class AssignTierServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "assignTier.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
//        String email = request.getParameter("email");
//        String username = request.getParameter("username");
        String clientId = request.getParameter("clientId");
        String tierNo = request.getParameter("tier");
        
//        if (email == null || email.trim().length() == 0 ||
//                username == null || username.trim().length() == 0 ||
//                tierNo == null || tierNo.trim().length() == 0) {
        if (clientId == null || clientId.trim().isEmpty() ||
                tierNo == null || tierNo.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "clientId and tierNo are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/setTierInfo";
//        String POST_PARAMS = "email=" + email + "&username=" + username + "&tierNo=" + tierNo;
        String POST_PARAMS = "clientId=" + clientId + "&tierNo=" + tierNo;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
