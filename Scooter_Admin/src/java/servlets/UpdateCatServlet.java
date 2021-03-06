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

@WebServlet(name = "UpdateCatServlet", urlPatterns = {"/updateCat"})
public class UpdateCatServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateCat.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String catId = request.getParameter("catId");
        String catName = request.getParameter("catName");
        
        if (catName == null || catName.trim().isEmpty() ||
                catId == null || catId.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Category Name and ID are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        catName = catName.trim();
        catName = catName.replaceAll("&", "%26");
        
        String POST_URL = Global.BASE_URL + "/updateCat";
        String POST_PARAMS = "catId=" + catId + "&catName=" + catName;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
