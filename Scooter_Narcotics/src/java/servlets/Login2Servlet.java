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
import javax.servlet.http.HttpSession;

@WebServlet(name = "Login2Servlet", urlPatterns = {"/login2"})
public class Login2Servlet extends HttpServlet {

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

        String POST_URL = Global.BASE_URL + "/loginv2";
        String POST_PARAMS = "username=" + username + "&password=" + password + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();

        if (!status) {
            String message = obj.get("message").getAsString();

            RequestDispatcher view = request.getRequestDispatcher(referer);
            request.setAttribute("username", username);
            request.setAttribute("password", password);
            request.setAttribute("message", message);
            view.forward(request, response);

//            JsonObject errObj = new JsonObject();
//            errObj.addProperty("status", false);
//            errObj.addProperty("message", message);
//            response.getWriter().println(new Gson().toJson(errObj));
        }
        else {
            JsonObject userObj = obj.get("user").getAsJsonObject();
            String clientId = userObj.get("_id").getAsString();
            String fullName = userObj.get("fname").getAsString() + " " + userObj.get("lname").getAsString();
            String email = userObj.get("email").getAsString();
            String contact = userObj.get("contact").getAsString();
            String role = userObj.get("role_id").getAsString();

            HttpSession session = request.getSession();
            request.getSession().setAttribute("user", userObj);

            request.getSession().setAttribute("clientId", clientId);
            session.setAttribute("name", fullName);
            session.setAttribute("email", email);
            session.setAttribute("contact", contact);
            session.setAttribute("role", role);
            if (role.equals("909")) {
                session.setAttribute("tier", userObj.get("tierNo").getAsString());
            }

            String refererParam = referer.split("\\?")[1];
            String page;
            if (referer.contains("activate")) {
                response.sendRedirect("login.jsp");
                return;
            }
            if (refererParam.contains("&")) {
                page = refererParam.split("&")[0].split("\\=")[1];
            }
            else {
                page = refererParam.split("\\=")[1];
            }

            if (page.contains("checkout")) {
                page = "shop-cart.jsp";
            }

            response.sendRedirect(page);

//            String message = obj.get("message").getAsString();

//            JsonObject errObj = new JsonObject();
//            errObj.addProperty("status", true);
//            errObj.addProperty("message", message);
//            response.getWriter().println(new Gson().toJson(errObj));
        }
    }
}