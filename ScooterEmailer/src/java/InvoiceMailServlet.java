import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
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

@WebServlet(name = "InvoiceMailServlet", urlPatterns = {"/sendInvoice"})
public class InvoiceMailServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String address = request.getParameter("toAddress");
        String carrier = request.getParameter("carrier");
        String service = request.getParameter("service");
        String cart = request.getParameter("cartObj");
        String additionalInfo = request.getParameter("additionalInfo");
        String noPackage = request.getParameter("noPackage");
        String email = request.getParameter("email");
        String shipCost = request.getParameter("shipCost");
        String paymentType = request.getParameter("paymentType");
        String transId = request.getParameter("transId");
        String clientId = request.getParameter("clientId");        
        
        if (address == null || address.trim().isEmpty() || carrier == null || carrier.trim().isEmpty() ||
                service == null || service.trim().isEmpty() || cart == null || cart.trim().isEmpty() ||
                additionalInfo == null || additionalInfo.trim().isEmpty() || noPackage == null || noPackage.trim().isEmpty() ||
                email == null || email.trim().isEmpty() || shipCost == null || shipCost.trim().isEmpty() ||
                paymentType == null || paymentType.trim().isEmpty() || transId == null || transId.trim().isEmpty() ||
                clientId == null || clientId.trim().isEmpty()) {
            throw new IOException("address, carrier, service, cartObj, additionalInfo, noPackage, email, shipCost, paymentType, transId and clientId are required!");
        }
        
        JsonObject toAddress = new JsonParser().parse(address).getAsJsonObject();
        JsonObject cartObj = new JsonParser().parse(cart).getAsJsonObject();
        
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
            message.setSubject("Scooter Narcotics Customer Invoice");
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            String msg = craftEmail(email, toAddress, shipCost, carrier, service, cartObj, additionalInfo, Integer.parseInt(noPackage), paymentType, transId, clientId);
            message.setText(msg, "utf-8", "html");

            Transport.send(message);
            System.out.println("Done");
            
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    private String craftEmail(String email, JsonObject toAddress, String shipcost, String carrier, String service, JsonObject cartObj, String additionalInfo, int noPackage, String paymentType, String transId, String clientId) throws IOException{
        String name = toAddress.get("name").getAsString();
        String street1 = toAddress.get("street1").getAsString();
        String country = toAddress.get("country").getAsString();
        String postal = toAddress.get("zip").getAsString();
        String phone = toAddress.get("phone").getAsString();
        
        float shippingCost = Float.parseFloat(shipcost);
        String forwarder = carrier + "," + service;
        
        JsonArray cartItemArr = cartObj.getAsJsonArray("cart_items").getAsJsonArray();
        
        String cartItemsInfo = "";
        int i = 0;
        double mValue = 0;
        double totalWeight = 0;
        
        DecimalFormat format = new DecimalFormat("0.00");
        
        for(JsonElement item : cartItemArr){
            JsonObject itemObj = (JsonObject)item;
            int productQty = Integer.parseInt(itemObj.get("qty").getAsString());
            double productWeight = Double.parseDouble(itemObj.get("weight").getAsString());
            double productUprice = Double.parseDouble(itemObj.get("price").getAsString());
            totalWeight += productWeight * productQty;
            double subTotal = productUprice*productQty;
            mValue += subTotal;
            cartItemsInfo += "<tr style='display: table-row;vertical-align: inherit;border-color: inherit;'>";
            cartItemsInfo += "                                      <th style='border-top: 0;border-bottom: 2px solid #f4f4f4;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;display: table-cell;'>" + (++i) + "</th>\n";
            cartItemsInfo += "                                      <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>" + itemObj.get("name").getAsString() + "</td>\n";
            cartItemsInfo += "                                      <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>" + productQty+"</td>\n";
            cartItemsInfo += "                                      <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+productWeight+"</td>\n";
            cartItemsInfo += "                                      <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+productUprice+"</td>\n";
            cartItemsInfo += "                                      <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+format.format(subTotal)+"</td>\n";
            cartItemsInfo += "                                  </tr>\n";
        }
        double total = mValue+shippingCost;
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        String curDate = sdf.format(new Date());
        String info = "<!DOCTYPE html>\n" +
                        "<html>\n" +
                        "    <head>\n" +
                        "        <meta charset='utf-8'>\n" +
                        "        <meta http-equiv='X-UA-Compatible' content='IE=edge'>\n" +
                        "        <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>\n" +
                        "    </head>\n" +
                        "    <body>\n" +
                        "        <div class='wrapper' style='height:100%; position:relative; overflow-x:hidden; overflow-y:auto'>\n" +
                        "            <section class='invoice' style='position: relative;background: #fff;padding:20px;margin:10px 25px'>\n" +
                        "                <div class='row' style='margin-right: -15px;margin-left: -15px;'>\n" +
                        "                    <div class='col-xs-12' style='width: 100%;float: left; position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;'>\n" +
                        "                        <h2 class='page-header' style='margin: 10px 0 20px 0; font-size: 22px; padding-bottom:9px; border-bottom: 1px solid #eee'>\n" +
                        "                            <img src='https://scooter-narcotics.com/img/logo_Black.png' width='350' height='80'/>\n" +
                        "                        </h2>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "                <div class='row invoice-info' style='margin-right: -15px;margin-left: -15px;'>\n" +
                        "                    <div class='col-sm-12 invoice-col' style='width: 100%;float: left;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;'>\n" +
                        "                        <h5>\n" +
                        "                            Customer ID: \n" +
                        "                            <b>" + clientId + "</b>\n" +
                        "                        </h5>\n" +
                        "                        <br>\n" +
                        "                        <small class='pull-right' style='float: right!important;font-size: 65%;font-weight: 400;line-height: 1;'>Date: <span id='tDate'>" + curDate + "</span></small>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "                <div class='row invoice-info' style='margin-right: -15px;margin-left: -15px;'>\n" +
                        "                    <div class='col-sm-4 invoice-col' style='width: 33.33333333%;float: left;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;'>\n" +
                        "                        From:<address style='margin-bottom: 20px;font-style: normal;line-height: 1.42857143;'>\n" +
                        "                        <strong style='font-weight: 700;'>Mark, Scooter Narcotics.</strong><br>\n" +
                        "                        25 Kaki Bukit Road 4<br>\n" +
                        "                        #01-35 (SYNERGY),Singapore (417800)<br>\n" +
                        "                        Phone: (+65) 8687-8551<br>\n" +
                        "                        Email: mark@scooternarcotics.com</address>\n" +
                        "                    </div>\n" +
                        "                    <div class='col-sm-4 invoice-col' style='width: 33.33333333%;float: left;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;'>\n" +
                        "                        To:<address style='margin-bottom: 20px;font-style: normal;line-height: 1.42857143;'>\n" +
                        "                        <strong style='font-weight: 700;'>"+name+"</strong><br>\n" +
                                                    street1+"<br>\n" +
                                                    country + " " + postal + "<br>\n" +
                        "                            Phone:" +phone+"<br>\n" +
                        "                        Email:" +email + "\n" +
                        "                        </address>\";\n" +
                        "                    </div>\n" +
                        "                    <div class='col-sm-4 invoice-col' style='width: 33.33333333%;float: left;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;'>\n" +
                        "                        <b style='font-weight: 700;'>Invoice:</b>"+transId+"<br>\n" +
                        "                        <b style='font-weight: 700;'>Order Type:</b> Online Purchase<br>\n" +
                        "                        <b style='font-weight: 700;'>Merchandise Value:</b>" + format.format(mValue) + "\n" +
                        "                        <br><b style='font-weight: 700;'>Forwarder:</b>"+forwarder + "\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "                <div class='row' style='margin-right: -15px;margin-left: -15px;'>\n" +
                        "                    <div class='col-xs-12 table-responsive' style='width: 100%;float: left; position: relative;padding-right: 15px;padding-left: 15px;min-height: .01%;overflow-x: auto;'>\n" +
                        "                        <table class='table table-striped' style='width: 100%;max-width: 100%;margin-bottom: 20px;background-color:transparent;border-spacing:0;border-collapse:collapse;display: table;'>\n" +
                        "                            <thead style='display: table-header-group;vertical-align: middle;border-color: inherit;'>\n" +
                        "                                <tr style='display: table-row;vertical-align: inherit;border-color: inherit;'>\n" +
                        "                                    <th style='border-top: 0;border-bottom: 2px solid #f4f4f4;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;display: table-cell;'>S/N</th>\n" +
                        "                                    <th style='border-top: 0;border-bottom: 2px solid #f4f4f4;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;display: table-cell;'>Product</th>\n" +
                        "                                    <th style='border-top: 0;border-bottom: 2px solid #f4f4f4;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;display: table-cell;'>Quantity</th>\n" +
                        "                                    <th style='border-top: 0;border-bottom: 2px solid #f4f4f4;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;display: table-cell;'>Product weight</th>\n" +
                        "                                    <th style='border-top: 0;border-bottom: 2px solid #f4f4f4;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;display: table-cell;'>Unit Price</th>\n" +
                        "                                    <th style='border-top: 0;border-bottom: 2px solid #f4f4f4;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;display: table-cell;'>Subtotal</th>\n" +
                        "                                </tr>\n" +
                        "                            </thead>\n" +
                        "                            <tbody style='display: table-row-group;vertical-align: middle;border-color: inherit;'>\n" +
                        "                                " + cartItemsInfo + "\n" +
                        "                                </tbody>\n" +
                        "                        </table>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "                <div class='row' style='margin-right: -15px;margin-left: -15px;'>\n" +
                        "                    <div class='col-xs-6' style='width: 50%;float: left;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;display: block;'>\n" +
                        "                        <span class='lead' style='font-size: 21px;margin-bottom: 20px;font-weight: 300;line-height: 1.4;'>Payment Method:</span>\n" +
                        "                        <span>"+paymentType+"</span>\n" +
                        "                        <p class='text-muted well well-sm no-shadow' style='margin-top: 10px;'>\n" +
                        "                            <strong>Information to be entered here:</strong><br>\n" +
                        "                            <span >"+additionalInfo+"</span>\n" +
                        "                        </p>\n" +
                        "                    </div>\n" +
                        "                    <div class='col-xs-6' style='width: 50%;float: right;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;display: block;'>\n" +
                        "                        <div class='table-responsive' style='min-height: .01%;overflow-x: auto;'>\n" +
                        "                            <table class='table' style='width: 100%;max-width: 100%;margin-bottom: 20px;background-color: transparent;border-spacing: 0;border-collapse: collapse;display: table;'>\n" +
                        "                                <tr style='display: table-row;vertical-align: inherit;border-color: inherit;'>\n" +
                        "                                    <th style='width:50%;border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;text-align: left;font-weight: bold;display: table-cell;'>Total Weight:</th>\n" +
                        "                                    <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+totalWeight+"</td>\n" +
                        "                                </tr>\n" +
                        "                                <tr style='display: table-row;vertical-align: inherit;border-color: inherit;'>\n" +
                        "                                    <th style='width:50%;border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;text-align: left;font-weight: bold;display: table-cell;'>Number of Packages:</th>\n" +
                        "                                    <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+noPackage+"</td>\n" +
                        "                                </tr>\n" +
                        "                                <tr style='display: table-row;vertical-align: inherit;border-color: inherit;'>\n" +
                        "                                    <th style='width:50%;border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;text-align: left;font-weight: bold;display: table-cell;'>Subtotal:</th>\n" +
                        "                                    <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+format.format(mValue)+"</td>\n" +
                        "                                </tr>\n" +
                        "                                <tr style='display: table-row;vertical-align: inherit;border-color: inherit;'>\n" +
                        "                                    <th style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;text-align: left;font-weight: bold;display: table-cell;'>Shipping:</th>\n" +
                        "                                    <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+shippingCost+"</td>\n" +
                        "                                </tr>\n" +
                        "                                <tr style='display: table-row;vertical-align: inherit;border-color: inherit;'>\n" +
                        "                                    <th style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;text-align: left;font-weight: bold;display: table-cell;'>Total:</th>\n" +
                        "                                    <td style='border-top: 1px solid #f4f4f4;padding: 8px;line-height: 1.42857143;vertical-align: top;display: table-cell;'>"+format.format(total)+"</td>\n" +
                        "                                </tr>\n" +
                        "                            </table>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </section>\n" +
                        "        </div>\n" +
                        "    </body>\n" +
                        "</html>";
        return info;
    }
}