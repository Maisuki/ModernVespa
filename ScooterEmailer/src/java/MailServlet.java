import java.io.IOException;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "MailServlet", urlPatterns = {"/mail"})
public class MailServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String key = request.getParameter("key");
        String name = request.getParameter("name");
        String action = request.getParameter("action");
        String type = request.getParameter("type");
//        String username = request.getParameter("username");
        System.out.println("here");
        if (action == null) {
            throw new IOException("action is required!");
        }
        
        if (action.equals("1") && (email == null || key == null || name == null)) {
            throw new IOException("email, key, name are required!");
        }
        
        if (action.equals("2") && (email == null)) {
            throw new IOException("email, key, name are required!");
        }
        
        final String gMailusername = "info@scooternarcotics.com";
        final String gMailpassword = "wherethefuckismymoney1234";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(gMailusername, gMailpassword);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress("no-reply@scooternarcotics.com", "Scooter Narcotics"));
            String msg = "";
            if (action.equals("1")) {
                message.setSubject("Scooter Narcotics Account Activation");
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
                msg = craftActivateAccountEmail(name, email, type, key);
            }
            else if (action.equals("2")) {
                message.setSubject("Scooter Narcotics Account Approval");
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse("mark@scooternarcotics.com"));
                msg = craftAccountApprovalEmail(name, email);
            }
            else if (action.equals("3")) {
                message.setSubject("Sccoter Narcotics Customer Order to be shipped");
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse("mark@scooternarcotics.com"));
                msg = craftOrderEmail();
            }
            message.setText(msg, "utf-8", "html");
            Transport.send(message);
            System.out.println("Done");

        } catch (MessagingException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public static String craftActivateAccountEmail(String name, String email, String type, String key) {
        String emailContent = "<!DOCTYPE html>\n"
                + "<html>\n"
                + "    <head>\n"
                + "        <meta charset=\"utf-8\">\n"
                + "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n"
                + "        <title>Scooter Narcotics | Account Activation</title>\n"
                + "        <meta content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\" name=\"viewport\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/bootstrap.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/fonts/font-awesome.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/ionicons/ionicons.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/admin.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/skins.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic\">\n"
                + "    </head>\n"
                + "    <body >\n"
                + "        <div class=\"wrapper\">\n"
                + "            <!-- Main content -->\n"
                + "            <section class=\"invoice\">\n"
                + "                <!-- title row -->\n"
                + "                <div class=\"row\">\n"
                + "                    <div class=\"col-xs-12\" align=\"center\">\n"
                + "                        <h2 class=\"page-header\">\n"
                + "                            <img src=\"https://scooter-narcotics.com/img/logo_Black.png\" width=\"40%\" height=\"20%\">\n"
                + "                        </h2>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "                <div class=\"row invoice-info\">\n"
                + "                    <div class=\"col-sm-12 invoice-col\">\n"
                + "                        <h3>Dear <b><span id=\"cid\">" + name + "</span></b>,</h3>\n"
                + "                        <br>\n"
                + "                        <p>Click the link below to activate your account:</p>\n"
                + "                        <u>\n"
                + "                            <a href=\"https://scooter-narcotics.com/activate?type=" + type + "&email=" + email + "&verify=" + key + "\">CLICK HERE</a>\n"
                + "                        </u>\n"
                + "                        <br><br>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "                <div class=\"row invoice-info\">\n"
                + "                    <div class=\"col-sm-4 invoice-col\">\n"
                + "                        Yours Sincerely:\n"
                + "                        <address>\n"
                + "                            <strong>Scooter Narcotics.</strong><br>\n"
                + "                            25 Kaki Bukit Road 4,<br>\n"
                + "                            #01-35 (SYNERGY),Singapore (417800)<br>\n"
                + "                        </address>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "            </section>\n"
                + "        </div>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/jquery.min.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/bootstrap.min.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/fastclick.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/admin.js\"></script>\n"
                + "    </body>\n"
                + "</html>";
        return emailContent;
    }
    
    public static String craftAccountApprovalEmail(String name, String email) {
        String emailContent = "<!DOCTYPE html>\n"
                + "<html>\n"
                + "    <head>\n"
                + "        <meta charset=\"utf-8\">\n"
                + "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n"
                + "        <title>Scooter Narcotics | Account Activation</title>\n"
                + "        <meta content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\" name=\"viewport\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/bootstrap.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/fonts/font-awesome.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/ionicons/ionicons.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/admin.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/skins.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic\">\n"
                + "    </head>\n"
                + "    <body >\n"
                + "        <div class=\"wrapper\">\n"
                + "            <!-- Main content -->\n"
                + "            <section class=\"invoice\">\n"
                + "                <!-- title row -->\n"
                + "                <div class=\"row\">\n"
                + "                    <div class=\"col-xs-12\" align=\"center\">\n"
                + "                        <h2 class=\"page-header\">\n"
                + "                            <img src=\"https://scooter-narcotics.com/img/logo_Black.png\" width=\"40%\" height=\"20%\">\n"
                + "                        </h2>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "                <div class=\"row invoice-info\">\n"
                + "                    <div class=\"col-sm-12 invoice-col\">\n"
                + "                        <h3>Dear <b><span id=\"cid\">Admin</span></b>,</h3>\n"
                + "                        <br>\n"
                + "                        <p>The following dealer requested to join on your platform:</p>\n"
                + "                        <p>\n"
                + "                            Name: " + name + ",<br>\n"
                + "                            Email: " + email + "\n"
                + "                        </p>\n"
                + "                        <br><br>\n"
                + "                        <p>Please login to Scooter Admin Portal to approve this account:\n"
                + "                            <a href='https://scooter-narcotics.com/Scooter_Admin'>LOGIN</a>\n"
                + "                        </p>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "                <div class=\"row invoice-info\">\n"
                + "                    <div class=\"col-sm-4 invoice-col\">\n"
                + "                        Yours Sincerely:\n"
                + "                        <address>\n"
                + "                            <strong>Scooter Narcotics.</strong><br>\n"
                + "                            25 Kaki Bukit Road 4,<br>\n"
                + "                            #01-35 (SYNERGY),Singapore (417800)<br>\n"
                + "                        </address>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "            </section>\n"
                + "        </div>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/jquery.min.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/bootstrap.min.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/fastclick.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/admin.js\"></script>\n"
                + "    </body>\n"
                + "</html>";
        return emailContent;
    }
    
    
    
    public static String craftOrderEmail() {
        String emailContent = "<!DOCTYPE html>\n"
                + "<html>\n"
                + "    <head>\n"
                + "        <meta charset=\"utf-8\">\n"
                + "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n"
                + "        <title>Scooter Narcotics | Account Activation</title>\n"
                + "        <meta content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\" name=\"viewport\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/bootstrap.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/fonts/font-awesome.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/ionicons/ionicons.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/admin.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://scooter-narcotics.com/css/skins.min.css\">\n"
                + "        <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic\">\n"
                + "    </head>\n"
                + "    <body >\n"
                + "        <div class=\"wrapper\">\n"
                + "            <!-- Main content -->\n"
                + "            <section class=\"invoice\">\n"
                + "                <!-- title row -->\n"
                + "                <div class=\"row\">\n"
                + "                    <div class=\"col-xs-12\" align=\"center\">\n"
                + "                        <h2 class=\"page-header\">\n"
                + "                            <img src=\"https://scooter-narcotics.com/img/logo_Black.png\" width=\"40%\" height=\"20%\">\n"
                + "                        </h2>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "                <div class=\"row invoice-info\">\n"
                + "                    <div class=\"col-sm-12 invoice-col\">\n"
                + "                        <h3>Dear <b><span id=\"cid\">Admin</span></b>,</h3>\n"
                + "                        <br>\n"
                + "                        <p>A customer has made a purchase on your site.:</p>\n"
                + "                        <br><br>\n"
                + "                        <p>Please login to Scooter Admin Portal to ship the order:\n"
                + "                            <a href='https://scooter-narcotics.com/Scooter_Admin'>LOGIN</a>\n"
                + "                        </p>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "                <div class=\"row invoice-info\">\n"
                + "                    <div class=\"col-sm-4 invoice-col\">\n"
                + "                        Yours Sincerely:\n"
                + "                        <address>\n"
                + "                            <strong>Scooter Narcotics.</strong><br>\n"
                + "                            25 Kaki Bukit Road 4,<br>\n"
                + "                            #01-35 (SYNERGY),Singapore (417800)<br>\n"
                + "                        </address>\n"
                + "                    </div>\n"
                + "                </div>\n"
                + "            </section>\n"
                + "        </div>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/jquery.min.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/bootstrap.min.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/fastclick.js\"></script>\n"
                + "        <script src=\"https://scooter-narcotics.com/js/admin.js\"></script>\n"
                + "    </body>\n"
                + "</html>";
        return emailContent;
    }
}