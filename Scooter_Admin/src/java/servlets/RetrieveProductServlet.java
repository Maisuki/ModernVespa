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

@WebServlet(name = "RetrieveProductServlet", urlPatterns = {"/retrieveProduct"})
public class RetrieveProductServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateProduct.jsp", "updateProductImage.jsp", "updateProductBNM.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String productId = request.getParameter("productId");
        
        if (productId == null || productId.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Product ID is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/retrieveOne";
        String POST_PARAMS = "pId=" + productId;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        result = result.replaceAll("´", "%C2%B4");
        result = result.replaceAll("²", "%C2%B2");
        result = result.replaceAll("³", "%C2%B3");
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
