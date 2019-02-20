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

@WebServlet(name = "RetrieveCartForInvoiceServlet", urlPatterns = {"/cartForInvoice"})
public class RetrieveCartForInvoiceServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "transaction.jsp", "invoice.jsp", "invoice-print.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String clientId = request.getParameter("clientId");
        String cartId = request.getParameter("cartId");
        
        if (clientId == null || clientId.trim().isEmpty() ||
                cartId == null || cartId.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "clientId and cartId are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/retrieveCartForInvoice";
        String POST_PARAMS = "clientId=" + clientId + "&cartId=" + cartId;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
