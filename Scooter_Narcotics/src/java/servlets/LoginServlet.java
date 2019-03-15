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
import javax.servlet.http.HttpSession;

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

        String type = request.getParameter("type");
        String POST_URL = "", POST_PARAMS = "";

        if (type.equals("fb")) {
            String fbId = request.getParameter("fbId");
            String email = request.getParameter("email");
            if (fbId == null || fbId.trim().isEmpty() || email == null || email.trim().isEmpty()) {
                String message = "Your facebook account is not linked yet!";

                JsonObject errObj = new JsonObject();
                errObj.addProperty("status", false);
                errObj.addProperty("message", message);
                response.getWriter().println(new Gson().toJson(errObj));
                return;
            }
            
            String remoteAddr = request.getRemoteAddr();
            String xForwardedFor = request.getHeader("x-forwarded-for");

            POST_URL = Global.BASE_URL + "/fblogin";
            POST_PARAMS = "fbId=" + fbId + "&email=" + email + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        } else if (type.equals("google")) {
            String googleId = request.getParameter("googleId");
            String email = request.getParameter("email");
            if (googleId == null || googleId.trim().isEmpty() || email == null || email.trim().isEmpty()) {
                String message = "Your google account is not linked yet!";

                JsonObject errObj = new JsonObject();
                errObj.addProperty("status", false);
                errObj.addProperty("message", message);
                response.getWriter().println(new Gson().toJson(errObj));
                return;
            }
            
            String remoteAddr = request.getRemoteAddr();
            String xForwardedFor = request.getHeader("x-forwarded-for");

            POST_URL = Global.BASE_URL + "/googlelogin";
            POST_PARAMS = "googleId=" + googleId + "&email=" + email + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        } else {
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            if (username == null || password == null || username.trim().isEmpty() || password.trim().isEmpty()) {
                String message = "Username/Password is not filled!";

                JsonObject errObj = new JsonObject();
                errObj.addProperty("status", false);
                errObj.addProperty("message", message);
                response.getWriter().println(new Gson().toJson(errObj));
                return;
            }

            String remoteAddr = request.getRemoteAddr();
            String xForwardedFor = request.getHeader("x-forwarded-for");

            POST_URL = Global.BASE_URL + "/loginv2";
            POST_PARAMS = "username=" + username + "&password=" + password + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        }

        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();

        if (!status) {
            String message = obj.get("message").getAsString();

            JsonObject errObj = new JsonObject();
            errObj.addProperty("status", false);
            errObj.addProperty("message", message);
            response.getWriter().println(new Gson().toJson(errObj));
        } else {
            JsonObject userObj = obj.get("user").getAsJsonObject();
            String clientId = userObj.get("_id").getAsString();
            String fullName = userObj.get("fname").getAsString() + " " + userObj.get("lname").getAsString();
            String email = userObj.get("email").getAsString();
            String contact = userObj.get("contact").getAsString();
            String role = userObj.get("role_id").getAsString();

            HttpSession session = request.getSession();
            session.setAttribute("user", userObj);

            session.setAttribute("clientId", clientId);
            session.setAttribute("name", fullName);
            session.setAttribute("email", email);
            session.setAttribute("contact", contact);
            session.setAttribute("role", role);
            if (role.equals("909")) {
                session.setAttribute("tier", userObj.get("tierNo").getAsString());
            }

            String message = obj.get("message").getAsString();

            JsonObject errObj = new JsonObject();
            errObj.addProperty("status", true);
            errObj.addProperty("message", message);
            response.getWriter().println(new Gson().toJson(errObj));
        }
    }
}
