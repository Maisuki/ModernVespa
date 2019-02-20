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

@WebServlet(name = "RetrieveRatesServlet", urlPatterns = {"/retrieveRates"})
public class RetrieveRatesServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer)) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String currency = request.getParameter("currency");
        
        if (currency == null || currency.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Currency is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String GET_URL = Global.BASE_URL + "/rates";
        GET_URL += "?currency=" + currency;
        
        String result = SNServer.sendGET(GET_URL);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }

}
