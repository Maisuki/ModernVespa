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

@WebServlet(name = "AddBMServlet", urlPatterns = {"/addBM"})
public class AddBMServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "addBM.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String brand = request.getParameter("brand");
        String models = request.getParameter("models");
        
        if (brand == null || brand.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Brand Name is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        brand = brand.trim();
        
        String POST_URL = Global.BASE_URL + "/addBrand";
        String POST_PARAMS = "brandName=" + brand + "&modelList=" + models;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
}