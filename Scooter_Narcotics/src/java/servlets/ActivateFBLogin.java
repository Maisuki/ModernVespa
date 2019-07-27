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

@WebServlet(name = "ActivateFBLogin", urlPatterns = {"/activateFBLogin"})
public class ActivateFBLogin extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");

        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }

        if (!RefererCheckManager.refererCheck(referer, "account.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }

        if (request.getSession().getAttribute("user") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to add items to notepad!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        String clientId = (String) request.getSession().getAttribute("clientId");
        String fbId = request.getParameter("fbId");

        String POST_URL = Global.BASE_URL + "/activateFBLogin";
        String POST_PARAMS = "clientId=" + clientId + "&fbId=" + fbId;
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        
        JsonObject obj = result.getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();
        if (status) {
            JsonObject user = (JsonObject) request.getSession().getAttribute("user");
            user.addProperty("fb_id", fbId);
        }
        
        response.getWriter().println(new Gson().toJson(obj));
    }

}
