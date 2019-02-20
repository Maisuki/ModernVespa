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

@WebServlet(name = "TransactionSearchServlet", urlPatterns = {"/transactionSearch"})
public class TransactionSearchServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "orders.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("user") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to perform transaction search!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        JsonObject userObj = (JsonObject) request.getSession().getAttribute("user");
        String clientId = userObj.get("_id").getAsString();
        
        String month = request.getParameter("month");
        String year = request.getParameter("year");
        
        if (month == null || month.trim().isEmpty() ||
            year == null || year.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "month and year are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        String POST_URL = Global.BASE_URL + "/transactionSearch";
        String POST_PARAMS = "clientId=" + clientId + "&monthFilter=" + month + "&yearFilter=" + year;
        POST_PARAMS = POST_PARAMS.replaceAll(" ", "%20");
        
        String results = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(results).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
