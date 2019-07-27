package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
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

@WebServlet(name = "AddToNotepadServlet", urlPatterns = {"/addToNotepad"})
public class AddToNotepadServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        String productId = null;
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "shop-details.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!referer.contains("?")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        String parameter = referer.split("\\?")[1];
        if (!parameter.contains("=")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }

        String parameterKey = parameter.split("=")[0];
        String parameterValue = parameter.split("=")[1];

        if (!parameterKey.equals("productId") || parameterValue.equals("")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("user") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to add items to notepad!");
            response.getWriter().println(new Gson().toJson(error));
        }
        else {
            JsonObject userObj = (JsonObject) request.getSession().getAttribute("user");
            String item = parameterValue;
            String clientId = userObj.get("_id").getAsString();
            String price = request.getParameter("price");
            String qty = request.getParameter("qty");
            
            if (price == null || price.trim().isEmpty() ||
                qty == null || qty.trim().isEmpty()) {
                JsonObject error = new JsonObject();
                error.addProperty("status", false);
                error.addProperty("message", "price and quantity are required!");
                response.getWriter().println(new Gson().toJson(error));
                return;
            }
            
            int quantity = Integer.parseInt(qty);
            
            String POST_URL = Global.BASE_URL + "/npAction";
            String POST_PARAMS = "clientId=" + clientId + "&action=%2B&item=" + item + "&qty=" + quantity + "&price=" + price;
            JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
            JsonObject obj = result.getAsJsonObject();
            response.getWriter().println(new Gson().toJson(obj));
        }
    }
    
}
