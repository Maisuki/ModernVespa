package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "ProductDetailsServlet", urlPatterns = {"/retrieveProduct"})
public class ProductDetailsServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
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
        
        String GET_URL = Global.BASE_URL + "/productDetails";
        GET_URL += "?query=" + parameterValue;
        
        JsonElement result = SNServer.sendGET(GET_URL);
        
        response.getWriter().println(new Gson().toJson(result));
    }
}