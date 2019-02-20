package servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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
import controller.ValidationManager;

@WebServlet(name = "RegisterServlet", urlPatterns = {"/register"})
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "registration.jsp")) {
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

        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String cfmPassword = request.getParameter("cfmpassword");
        String fname = request.getParameter("fname");
        String lname = request.getParameter("lname");
        String contact = request.getParameter("contact");
        String street = request.getParameter("street");
        String city = request.getParameter("city");
        String zip = request.getParameter("zip");
        String state = request.getParameter("state");
        String country = request.getParameter("country");
        String role = request.getParameter("role");

        if (username == null || username.trim().isEmpty()
                || password == null || password.trim().isEmpty()
                || cfmPassword == null || cfmPassword.trim().isEmpty()
                || fname == null || fname.trim().isEmpty()
                || lname == null || lname.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || city == null || city.trim().isEmpty()
                || state == null || state.trim().isEmpty()
                || street == null || street.trim().isEmpty()
                || zip == null || zip.trim().isEmpty()
                || country == null || country.trim().isEmpty()
                || contact == null || contact.trim().isEmpty()
                || role == null || role.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Username, Password, Confirm Password, First Name, Last Name, Email, City, State, Street, Zip, Country, Contact and Role values are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        boolean validEmail = ValidationManager.validateEmail(request.getParameter("email"));

        if (!validEmail) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Invaild Email!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        boolean validPassword = ValidationManager.validatePassword(request.getParameter("password"));
        if (!validPassword) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Password does not meet the requirements!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        boolean validCfmPassword = request.getParameter("cfmpassword").equals(request.getParameter("password"));
        if (!validCfmPassword) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Password does not matchs!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        JsonObject addressObj = new JsonObject();
        addressObj.addProperty("city", city);
        addressObj.addProperty("country", country);
        addressObj.addProperty("street", street);
        addressObj.addProperty("zip", zip);
        addressObj.addProperty("state", state);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String addressJson = gson.toJson(addressObj);

        String POST_URL = Global.BASE_URL + "/register";
        String POST_PARAMS = "username=" + request.getParameter("username") + "&password=" + request.getParameter("password") + "&fname=" + request.getParameter("fname")
                + "&lname=" + request.getParameter("lname") + "&email=" + request.getParameter("email") + "&billAddress=" + addressJson
                + "&contact=" + request.getParameter("contact") + "&role=" + request.getParameterValues("role")[0];

        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        boolean status = obj.get("status").getAsBoolean();

        if (status) {
            String key = obj.get("key").getAsString();
            String username1 = username.replaceAll(" ", "%20");
            String fname1 = fname.replaceAll(" ", "%20");
            
            if (role.equals("Dealer")) {
                String sendEmail = "https://scooter-narcotics.com/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&type=sn&action=2";
//                String sendEmail = "http://128.199.66.178/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&action=2";
                SNServer.sendGET(sendEmail);
            }
            String sendEmail = "https://scooter-narcotics.com/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&type=sn&action=1";
//            String sendEmail = "http://128.199.66.178/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&type=sn&action=1";
            SNServer.sendGET(sendEmail);
        }
        
        response.getWriter().println(new Gson().toJson(obj));
        
//        if (!status) {
//            String message = obj.get("message").getAsString();
//            request.setAttribute("message", result);
//            returnToRegisterPage(request, response);
//            return;
//        } else {
//            String toEmail = request.getParameter("email");
//            String key = obj.get("key").getAsString();
//
//            String username1 = username.replaceAll(" ", "%20");
//
//            if (role.equals("Dealer")) {
//                String sendEmail = "https://scooter-narcotics.com/ScooterEmailer/mail?email=" + email + "&key=" + key + "&username=" + username1 + "&action=2";
////                String sendEmail = "http://167.99.86.156/MailTest/mail?email="+email+"&key="+key+"&username="+username1+"&action=2";
//                URL url = new URL(sendEmail);
//                HttpURLConnection con = (HttpURLConnection) url.openConnection();
//
//                // optional default is GET
//                con.setRequestMethod("GET");
//
//                int responseCode = con.getResponseCode();
//            }
//            String fname1 = fname.replaceAll(" ", "%20");
//            String sendEmail = "https://scooter-narcotics.com/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&action=1";
////            String sendEmail = "http://167.99.86.156/MailTest/mail?email="+email+"&key="+key+"&name="+fname1+"&action=1";
//            URL url = new URL(sendEmail);
//            HttpURLConnection con = (HttpURLConnection) url.openConnection();
//
//            // optional default is GET
//            con.setRequestMethod("GET");
//
//            int responseCode = con.getResponseCode();
//        }

//        request.setAttribute("successMsg", "You have successfully registered to Scooter Narcotics. You may proceed to login.");
//        RequestDispatcher homepage = request.getRequestDispatcher("login.jsp");
//        homepage.forward(request, response);
    }

//    private void returnToRegisterPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        RequestDispatcher dispacter = request.getRequestDispatcher("registration.jsp");
//        request.setAttribute("username", request.getParameter("username"));
//        request.setAttribute("password", request.getParameter("password"));
//        request.setAttribute("cfmpassword", request.getParameter("cfmpassword"));
//        request.setAttribute("fname", request.getParameter("fname"));
//        request.setAttribute("lname", request.getParameter("lname"));
//        request.setAttribute("email", request.getParameter("email"));
//        request.setAttribute("city", request.getParameter("city"));
//        request.setAttribute("zip", request.getParameter("zip"));
//        request.setAttribute("street", request.getParameter("street"));
//        request.setAttribute("state", request.getParameter("state"));
//        request.setAttribute("country", request.getParameter("country"));
//        request.setAttribute("contact", request.getParameter("contact"));
//        request.setAttribute("role", request.getParameter("role"));
//        dispacter.forward(request, response);
//    }

}
