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

@WebServlet(name = "RetrieveOneBNMServlet", urlPatterns = {"/rerieveBNM"})
public class RetrieveOneBNMServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateBM.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String brandId = request.getParameter("brandId");
        if (brandId == null || brandId.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "brandId is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/getOneBrand";
        String POST_PARAMS = "brandId=" + brandId;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        result = result.replaceAll("´", "%C2%B4");
        result = result.replaceAll("²", "%C2%B2");
        result = result.replaceAll("³", "%C2%B3");
        
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
