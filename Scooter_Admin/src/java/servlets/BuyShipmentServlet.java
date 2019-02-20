package servlets;

import com.easypost.EasyPost;
import com.easypost.exception.EasyPostException;
import com.easypost.model.Order;
import com.easypost.model.Rate;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "BuyShipmentServlet", urlPatterns = {"/buyShipment"})
public class BuyShipmentServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "transaction.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        EasyPost.apiKey = Global.EASYPOST;
        String orderId = request.getParameter("orderId");
        String service = request.getParameter("service");
        String cartId = request.getParameter("cartId");
        String isShipped = request.getParameter("isShipped");
        
        if (orderId == null || orderId.trim().isEmpty() ||
                service == null || service.trim().isEmpty() ||
                cartId == null || cartId.trim().isEmpty() ||
                isShipped == null || isShipped.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "orderId, service, cartId and isShipped are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        if (isShipped.equals("false")) {
            try {
                Order order = Order.retrieve(orderId);
                List<Rate> rates = order.getRates();
                for (Rate rate : rates) {
                    if (rate.getService().equals(service)) {
                        order.buy(rate);
                        break;
                    }
                }
            } catch (EasyPostException e) {
                JsonObject error = new JsonObject();
                error.addProperty("status", false);
                error.addProperty("message", e.getMessage());
                response.getWriter().println(new Gson().toJson(error));
                return;
            }
        }
        
        
        String POST_URL = Global.BASE_URL + "/updateShippedStatus";
        String POST_PARAMS = "cartId=" + cartId + "&shippingId=" + orderId;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
