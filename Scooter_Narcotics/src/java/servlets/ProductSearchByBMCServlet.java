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

@WebServlet(name = "ProductSearchByBMCServlet", urlPatterns = {"/searchService"})
public class ProductSearchByBMCServlet extends HttpServlet {
    
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
        
        String category = request.getParameter("category");
        String brand = request.getParameter("brand");
        String model = request.getParameter("model");
        String query = request.getParameter("query");
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
        
        if (category == null && brand == null && model == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "At least one of the following are required to be selected! (Category/Brand/Model)");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/search";
        String POST_PARAMS = "category=" + category + "&brand=" + brand + "&model=" + model + "&currency=" + currency + "&page=" + page;
        
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        
        JsonObject mainObj = result.getAsJsonObject();
        if (mainObj.get("status").getAsBoolean()) {
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
        }
        
        response.setHeader("Content-Type", "application/json; charset=ISO-8859-1");
        response.getWriter().println(new Gson().toJson(mainObj));
    }
    
}
