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

@WebServlet(name = "UpdateTierServlet", urlPatterns = {"/updateTier"})
public class UpdateTierServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "editTier.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String userId = request.getParameter("userId");
        String tierNo = request.getParameter("tierNo");
        if (userId == null || userId.trim().isEmpty() ||
                tierNo == null || tierNo.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "userId and tierNo are required!");
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/updateUserTier";
        String POST_PARAMS = "userId=" + userId + "&tierNo=" + tierNo;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
