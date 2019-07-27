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

@WebServlet(name = "NotepadQtyUpdateServlet", urlPatterns = {"/npQtyUpdate"})
public class NotepadQtyUpdateServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "view-notepad.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("user") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to add or remove quantities of items in your notepads!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        JsonObject userObj = (JsonObject) request.getSession().getAttribute("user");
        String clientId = userObj.get("_id").getAsString();
        
        String notepadId = request.getParameter("npId");
        String action = request.getParameter("action");
        String qty = request.getParameter("qty");
        String item = request.getParameter("item");
        String price = request.getParameter("price");
        
        if (notepadId == null || notepadId.trim().isEmpty() ||
                action == null || action.trim().isEmpty() ||
                qty == null || qty.trim().isEmpty() ||
                item == null || item.trim().isEmpty() ||
                price == null || price.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "npId, action, qty, item and price are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        action = action.replaceAll("-", "%2D");
        action = action.replaceAll("\\+", "%2B");
        
        item = item.replaceAll("&", "%26");
        
        String POST_URL = Global.BASE_URL + "/npAction";
        String POST_PARAMS = "clientId=" + clientId + "&npId=" + notepadId + "&action=" + action + "&qty=" + qty + "&item=" + item + "&price=" + price;
        POST_PARAMS = POST_PARAMS.replaceAll(" ", "%20");
        
        JsonElement results = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = results.getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
