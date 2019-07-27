package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
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
        
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            String message = "Email/Password is not filled!";

            JsonObject errObj = new JsonObject();
            errObj.addProperty("status", false);
            errObj.addProperty("message", message);
            response.getWriter().println(new Gson().toJson(errObj));
            return;
        }

        String remoteAddr = request.getRemoteAddr();
        String xForwardedFor = request.getHeader("x-forwarded-for");

        String POST_URL = Global.BASE_URL + "/loginv3";
        String POST_PARAMS = "email=" + email + "&password=" + password + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = result.getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();

        if (!status) {
            String message = obj.get("message").getAsString();
            String url = referer.split("/")[referer.split("/").length - 1];
            if (url.equals("login2")) {
                url = "login.jsp";
            }
            
            RequestDispatcher view = request.getRequestDispatcher(url);
            request.setAttribute("email", email);
            request.setAttribute("password", password);
            request.setAttribute("message", message);
            view.forward(request, response);
        }
        else {
            JsonObject userObj = obj.get("user").getAsJsonObject();
            String clientId = userObj.get("_id").getAsString();
            String fullName = userObj.get("fname").getAsString() + " " + userObj.get("lname").getAsString();
            String email1 = userObj.get("email").getAsString();
            String contact = userObj.get("contact").getAsString();
            String role = userObj.get("role_id").getAsString();

            HttpSession session = request.getSession();
            request.getSession().setAttribute("user", userObj);

            request.getSession().setAttribute("clientId", clientId);
            session.setAttribute("name", fullName);
            session.setAttribute("email", email1);
            session.setAttribute("contact", contact);
            session.setAttribute("role", role);
            if (role.equals("909")) {
                session.setAttribute("tier", userObj.get("tierNo").getAsString());
            }

            String page;
            if (referer.contains("activate")) {
                response.sendRedirect("login.jsp");
                return;
            }
            
            if (referer.contains("login.jsp") || referer.contains("login2") || referer.contains("registration.jsp")) {
                response.sendRedirect("index.jsp");
                return;
            }
            
            String refererParam = referer.split("\\?")[1];
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
        }
    }
}