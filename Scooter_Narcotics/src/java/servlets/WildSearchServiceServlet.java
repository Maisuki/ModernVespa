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

@WebServlet(name = "WildSearchServiceServlet", urlPatterns = {"/wildSearchService"})
public class WildSearchServiceServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "products.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String query = request.getParameter("query");
        String currency = request.getParameter("currency");
        String page = request.getParameter("page");
        
        if (query == null || query.trim().isEmpty() ||
                currency == null || currency.trim().isEmpty() ||
                page == null || page.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "query, currency and page are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/superSearch";
        String POST_PARAMS = "query=" + query + "&currency=" + currency + "&page=" + page;
        
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = result.getAsJsonObject();
        
        response.setHeader("Content-Type", "application/json; charset=ISO-8859-1");
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
