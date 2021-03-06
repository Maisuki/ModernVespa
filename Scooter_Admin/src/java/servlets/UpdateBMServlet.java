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

@WebServlet(name = "UpdateBMServlet", urlPatterns = {"/updateBM"})
public class UpdateBMServlet extends HttpServlet {

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
        
        String id = request.getParameter("id");
        String brand = request.getParameter("brand");
        String models = request.getParameter("models");
        
        if (brand == null || brand.trim().isEmpty() ||
                id == null || id.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Brand Name and ID are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        brand = brand.trim();
        
        String POST_URL = Global.BASE_URL + "/updateBrand";
        String POST_PARAMS = "brandId=" + id + "&brandName=" + brand + "&modelList=" + models;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
