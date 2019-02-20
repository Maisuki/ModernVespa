package servlets;

import controller.RefererCheckManager;
import controller.SNServer;
import controller.ValidationManager;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "sendFeedbackServlet", urlPatterns = {"/feedbackServlet"})
public class SendFeedbackServlet extends HttpServlet {

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

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String contact = request.getParameter("contact");
        String subject = request.getParameter("subject");
        String brand = request.getParameter("brand");
        String model = request.getParameter("model");
        String message = request.getParameter("message");
        
        if (name == null || name.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || contact == null || contact.trim().isEmpty()
                || subject == null || subject.trim().isEmpty()
                || brand == null || brand.trim().isEmpty()
                || model == null || model.trim().isEmpty()
                || message == null || message.trim().isEmpty()) {
            backToContactPage(request, response, "All fields must be filled!", name, email, contact, subject, brand, model, message);
            return;
        }

        String emailBody = "Name of Sender: " + name;
        emailBody += "<br>";
        emailBody += "Sender Email: " + email;
        emailBody += "<br>";
        emailBody += "Sender Contact: " + email;
        emailBody += "<br>";
        emailBody += "<b><u>Bike Information</u></b>";
        emailBody += "<br>";
        emailBody += "Bike Brand:" + brand;
        emailBody += "<br>";
        emailBody += "Bike Model:" + model;
        emailBody += "<br>";
        emailBody += "Message:<br>" + message;

        boolean validEmail = ValidationManager.validateEmail(email);

        if (!validEmail) {
            backToContactPage(request, response, "Invaild Email", name, email, contact, subject, brand, model, message);
        }
        
        String POST_URL = "https://scooter-narcotics.com/ScooterEmailer/feedback";
//        String POST_URL = "http://128.199.66.178/ScooterEmailer/feedback";
        String POST_PARAMS = "email=" + email + "&name=" + name + "&subject=" + subject + "&emailMessage=" + emailBody;
        SNServer.sendPOST(POST_URL, POST_PARAMS);
    }

    public void backToContactPage(HttpServletRequest request, HttpServletResponse response, String errMsg, 
            String name, String email, String contact, String subject, String brand, String model, 
            String message) throws ServletException, IOException {
        request.setAttribute("message", errMsg);
        request.setAttribute("name", name);
        request.setAttribute("email", email);
        request.setAttribute("contact", contact);
        request.setAttribute("subject", subject);
        request.setAttribute("brand", brand);
        request.setAttribute("model", model);
        request.setAttribute("emailMessage", message);
        RequestDispatcher view = request.getRequestDispatcher("contact.jsp");
        view.forward(request, response);
    }
}
