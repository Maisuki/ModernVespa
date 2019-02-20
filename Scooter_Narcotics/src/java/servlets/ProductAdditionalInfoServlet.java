package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "ProductAdditionalInfoServlet", urlPatterns = {"/additionalInfo"})
public class ProductAdditionalInfoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
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
//            response.getWriter().println("You must login to use this service!");
//            return;
//        }
        
        String itemId = request.getParameter("itemId");
        
        if (itemId == null || itemId.trim().isEmpty()) {
            response.getWriter().println("itemId is required!");
            return;
        }
        
        String GET_URL = Global.BASE_URL + "/additionalInfo";
        GET_URL += "?id=" + itemId;
        
        JsonElement result = SNServer.sendGET(GET_URL);
        JsonObject obj = result.getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
