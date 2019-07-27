package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.ValidationManager;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "UpdatePasswordServlet", urlPatterns = {"/update"})
public class UpdatePasswordServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "forget-password.jsp", "reset?verify=")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        // Verify if recaptcha is being checked
        if (!controller.SNServer.verifyRecaptcha(request.getParameter("g-recaptcha-response"))) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Captcha verification fail!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        String password = request.getParameter("password");
        String cfmPassword = request.getParameter("cfmpassword");
        String username = request.getParameter("username");

        if (password == null || password.trim().isEmpty() ||
                cfmPassword == null || cfmPassword.trim().isEmpty() ||
                username == null || username.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Username, Password and Confirm Password are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        boolean validPassword = ValidationManager.validatePassword(password);
        if (!validPassword) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Password does not meet the requirements!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        boolean validCfmPassword = cfmPassword.equals(password);
        if (!validCfmPassword) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Password does not match!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        String POST_URL = Global.BASE_URL + "/resetPassword";
        String POST_PARAMS = "username=" + username + "&password=" + password + "&cfmPassword=" + cfmPassword;
        JsonElement result = controller.SNServer.sendPOST(POST_URL, POST_PARAMS);

        JsonObject obj = result.getAsJsonObject();
        response.getWriter().println(new Gson().toJson(obj));
        /*
        boolean status = obj.get("status").getAsBoolean();

        if (!status) {
            String message = obj.get("message").getAsString();
            request.setAttribute("message", result);
            navigateToResetPasswordPage(request, response);
            return;
        }

        request.setAttribute("successMsg", "Password updated successfully. You may proceed to login.");
        RequestDispatcher homepage = request.getRequestDispatcher("login.jsp");
        homepage.forward(request, response);
        */
    }

    private void navigateToResetPasswordPage(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        RequestDispatcher view = request.getRequestDispatcher("forget-password.jsp");
        request.setAttribute("password", request.getParameter("password"));
        request.setAttribute("cfmpassword", request.getParameter("cfmpassword"));
        request.setAttribute("username", request.getParameter("username"));
        view.forward(request, response);
    }
}
