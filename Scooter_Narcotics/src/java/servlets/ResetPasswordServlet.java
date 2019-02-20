package servlets;

import com.google.gson.JsonObject;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "ResetPasswordServlet", urlPatterns = {"/reset"})
public class ResetPasswordServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String key = request.getParameter("verify");

        if (key == null || key.trim().isEmpty()) {
            response.sendRedirect("index.jsp");
            return;
        }

        // Verify if the key is a valid registered one
        JsonObject verification_payload = SNServer.verifyKey(key);

        boolean status = verification_payload.get("status").getAsBoolean();

        // Invalid key or server error
        if (!status) {
            String message = verification_payload.get("message").getAsString();
            RequestDispatcher view = request.getRequestDispatcher("recovery.jsp");
            request.setAttribute("message", message);
            view.forward(request, response);
            return;
        }

        // Valid key
        JsonObject responseData = verification_payload.get("response").getAsJsonObject();
        String username = responseData.get("username").getAsString();
        request.setAttribute("username", username);
        RequestDispatcher view = request.getRequestDispatcher("forget-password.jsp");
        view.forward(request, response);
    }
}
