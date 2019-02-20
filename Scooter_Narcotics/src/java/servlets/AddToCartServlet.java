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

@WebServlet(name = "AddToCartServlet", urlPatterns = {"/addToCart"})
public class AddToCartServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String remoteAddr = request.getRemoteAddr();
        String removeHost = request.getRemoteHost();
        String xForwardedFor = request.getHeader("x-forwarded-for");
        
        String referer = request.getHeader("Referer");
        String productId = null;
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "index.jsp", "products.jsp", "shop-details.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        
        if (referer.contains("products.jsp") || referer.contains("index.jsp") 
                || referer.equals("https://scooter-narcotics.com/") || referer.equals("https://www.scooter-narcotics.com/")
                || referer.equals("https://scooternarcotics.com/") || referer.equals("https://www.scooternarcotics.com/") 
                || referer.equals("https://modernvespa.sg/") || referer.equals("https://www.modernvespa.sg/") 
                || referer.equals("http://localhost:8080/Scooter_Narcotics/")) {
            productId = request.getParameter("pid");
        }
        else if (referer.contains("shop-details.jsp")) {
            if (!referer.contains("?")) {
                response.getWriter().println("Unauthorized access!");
                return;
            }
            if (request.getParameter("pid") == null) {
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

                productId = parameterValue;
            }
            else {
                productId = request.getParameter("pid");
            }
        }
        
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");
        
        if (productId == null || price == null || price.trim().isEmpty() ||
                qty == null || qty.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "productId, price and quantity are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String clientId;
        if (request.getSession().getAttribute("user") == null) {
            clientId = "-";
        }
        else {
            JsonObject userObj = (JsonObject) request.getSession().getAttribute("user");
            clientId = userObj.get("_id").getAsString();
        }
        
        int quantity = Integer.parseInt(qty);

        String POST_URL = Global.BASE_URL + "/cartAction";
        String POST_PARAMS = "item=" + productId + "&action=%2B&clientId=" + clientId + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr + "&qty=" + quantity + "&price=" + price;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);

        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();
        
        JsonObject resultObj = new JsonObject();
        resultObj.addProperty("status", true);

        if (status) {
            resultObj.addProperty("message", "Item added to your cart!");
        }
        else {
            resultObj.addProperty("message", obj.get("message").getAsString());
        }
        response.getWriter().println(new Gson().toJson(resultObj));
        
        
        /*
        
        
        JsonObject resultObj = new JsonObject();
        if (request.getSession().getAttribute("user") == null) {
            resultObj.addProperty("status", false);
            resultObj.addProperty("message", "You must login to add items to cart!");
            response.getWriter().println(new Gson().toJson(resultObj));
        }
        else {
            JsonObject userObj = (JsonObject) request.getSession().getAttribute("user");
            String clientId = userObj.get("_id").getAsString();
            int quantity = Integer.parseInt(qty);

            String POST_URL = Global.BASE_URL + "/cartAction";
            String POST_PARAMS = "item=" + productId + "&action=%2B&clientId=" + clientId + "&qty=" + quantity + "&price=" + price;
            String result = SNServer.sendPOST(POST_URL, POST_PARAMS);

            JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
            boolean status = obj.get("status").getAsBoolean();

            resultObj.addProperty("status", true);
            
            if (status) {
                resultObj.addProperty("message", "Item added to your cart!");
            }
            else {
                resultObj.addProperty("message", obj.get("message").getAsString());
            }
            response.getWriter().println(new Gson().toJson(resultObj));
        }

        */
    }
}