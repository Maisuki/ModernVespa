package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "ForgetPasswordServlet", urlPatterns = {"/forget"})
public class ForgetPasswordServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "recovery.jsp")) {
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

        // Get params
        String email = request.getParameter("email");

        if (email == null || email.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Email is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        // Verify if the email is a valid registered one
        JsonObject verification_payload = SNServer.verifyForgetPassword(email);

        // Not a valid email or server error
        if (!verification_payload.get("status").getAsBoolean()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", verification_payload.get("message").getAsString());
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        // Valid one
        JsonObject responseObj = verification_payload.get("response").getAsJsonObject();
        String key = responseObj.get("key").getAsString();
        String name = responseObj.get("name").getAsString();

        String POST_PARAMS = "email=" + email + "&key=" + key + "&name=" + name;
        POST_PARAMS = POST_PARAMS.replaceAll(" ", "%20");
        SNServer.sendPOST("https://scooter-narcotics.com/ScooterEmailer/resetPass", POST_PARAMS);
//        SNServer.sendPOST("http://128.199.66.178/MailTest/resetPass", POST_PARAMS);
        
        JsonObject success = new JsonObject();
        success.addProperty("status", true);
        success.addProperty("message", "An email is being sent to your email account.");
        response.getWriter().println(new Gson().toJson(success));
    }
    
}
