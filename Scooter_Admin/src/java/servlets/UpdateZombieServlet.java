package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "UpdateZombieServlet", urlPatterns = {"/updateZombie"})
public class UpdateZombieServlet extends HttpServlet {

    private static final String POST_URL = Global.BASE_URL + "/updateZombie";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateZombie.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }        
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String zombieId = request.getParameter("id");

        if (zombieId == null || zombieId.trim().isEmpty() ||
                username == null || username.trim().isEmpty() ||
                password == null || password.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "zombieId, username and password are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        String POST_URL = Global.BASE_URL + "/updateZombie";
        String POST_PARAMS = "zombieId=" + zombieId + "&username=" + username + "&password=" + password;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        response.getWriter().println(new Gson().toJson(obj));
    }
}
