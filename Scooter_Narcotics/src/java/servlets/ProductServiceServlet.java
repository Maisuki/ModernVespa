package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import java.nio.charset.Charset;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "ProductServiceServlet", urlPatterns = {"/productService"})
public class ProductServiceServlet extends HttpServlet {
    
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
        
        String currency = request.getParameter("currency");
        String page = request.getParameter("page");
        
        if (currency == null || currency.trim().isEmpty() ||
                page == null || page.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "currency and page are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String GET_URL = Global.BASE_URL + "/products";
        GET_URL += "?currency=" + currency + "&page=" + page;
        
        JsonElement result = SNServer.sendGET(GET_URL);
        
        JsonObject mainObj = result.getAsJsonObject();
        
        JsonArray productsArray = mainObj.get("products").getAsJsonArray();
        JsonArray newProductsArray = new JsonArray();
        
        for (int i = 0; i < productsArray.size(); i++) {
            JsonObject obj = productsArray.get(i).getAsJsonObject();
            String name = obj.get("name").getAsString();
            Charset u8 = Charset.forName("UTF-8");
            Charset l1 = Charset.forName("ISO-8859-1");
            String utf8Name = u8.decode(l1.encode(name)).toString();
            obj.addProperty("name", utf8Name);
            newProductsArray.add(obj);
        }
        
        mainObj.add("products", newProductsArray);
        
        response.setHeader("Content-Type", "application/json; charset=ISO-8859-1");
        response.getWriter().println(new Gson().toJson(mainObj));
    }
    
}
