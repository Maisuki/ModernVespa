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
        JsonObject mainObj = result.getAsJsonObject();
        
        JsonObject obj = result.getAsJsonObject().get("product").getAsJsonObject();
        JsonArray related = result.getAsJsonObject().get("related").getAsJsonArray();
        
        String name = obj.get("name").getAsString();
        String desc = obj.get("desc").getAsString();
        System.out.println(desc);
        Charset u8 = Charset.forName("UTF-8");
        Charset l1 = Charset.forName("ISO-8859-1");
        
        String utf8Name = u8.decode(l1.encode(name)).toString();
        String utf8Desc = u8.decode(l1.encode(desc)).toString();
        
        obj.addProperty("name", utf8Name);
        obj.addProperty("desc", utf8Desc);
        
        mainObj.add("product", obj);

        JsonArray newRelatedArray = new JsonArray();
        
        for (int i = 0; i < related.size(); i++) {
            JsonObject relatedObj = related.get(i).getAsJsonObject();
            String relatedName = relatedObj.get("name").getAsString();
            String utf8RelatedName = u8.decode(l1.encode(relatedName)).toString();
            relatedObj.addProperty("name", utf8RelatedName);
            newRelatedArray.add(relatedObj);
        }
        
        mainObj.add("related", newRelatedArray);
        
        response.setHeader("Content-Type", "application/json; charset=ISO-8859-1");
        response.getWriter().println(new Gson().toJson(mainObj));
    }
}
