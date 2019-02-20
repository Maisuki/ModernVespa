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

@WebServlet(name = "LoginServlet", urlPatterns = {"/login"})
public class LoginServlet extends HttpServlet {

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
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String isZombie = request.getParameter("isZombie");
        
        if (username == null || username.trim().isEmpty() ||
                password == null || password.trim().isEmpty() ||
                isZombie == null || isZombie.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Username, Password and IsZombie are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = "";
        if (isZombie.equals("true")) {
            POST_URL += Global.BASE_URL + "/loginZ";
        }
        else {
            POST_URL += Global.BASE_URL + "/login";
        }
        
        String POST_PARAMS = "username=" + username + "&password=" + password;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();
        if (status) {
            JsonObject userObj;
            if (isZombie.equals("true")) {
                userObj = obj.get("zombie").getAsJsonObject();
            }
            else {
                userObj = obj.get("user").getAsJsonObject();
            }
            request.getSession().setAttribute("user", userObj);
            request.getSession().setAttribute("username", userObj.get("username").getAsString());
            request.getSession().setAttribute("role", obj.get("role").getAsString());
        }
        
        response.getWriter().println(new Gson().toJson(obj));
    }

}
