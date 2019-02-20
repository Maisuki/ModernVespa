package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.apache.commons.io.IOUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.http.fileupload.util.Streams;

@MultipartConfig
@WebServlet(name = "AddProductServlet", urlPatterns = {"/addProduct"})
public class AddProductServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "addProduct.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        List<Part> list = new ArrayList<>(request.getParts());
        
        String productName = "";
        String partNo = "";
        String category = "";
        String quantity = "";
        String foreignprice = "";
        String localprice = "";
        String weight = "";
        String sourceOfSupply = "";
        String secSourceOfSupply = "";
        String costOfProduct = "";
        String productBrand = "";
        String checked = "";
        String description = "";
        String gst = "";
        String shippingCosts = "";

        // discountedprice
//        String tier1DiscountedPrice = "";
//        String tier2DiscountedPrice = "";
//        String tier3DiscountedPrice = "";
//        String tier4DiscountedPrice = "";

        // markup percentage
        String tier1MarkupPercentage = "";
        String tier2MarkupPercentage = "";
        String tier3MarkupPercentage = "";
        String tier4MarkupPercentage = "";

        // markup price
//        String tier1MarkupPrice = "";
//        String tier2MarkupPrice = "";
//        String tier3MarkupPrice = "";
//        String tier4MarkupPrice = "";

        ArrayList<Part> imagePartList = new ArrayList<>();

        for (Part filePart : list) {
            if (filePart.getContentType() == null) {
                switch (filePart.getName()) {
                    case "productName":
                        productName = Streams.asString(filePart.getInputStream());
                        break;
                    case "partNumber":
                        partNo = Streams.asString(filePart.getInputStream());
                        break;
                    case "category":
                        category = Streams.asString(filePart.getInputStream());
                        break;
                    case "quantity":
                        quantity = Streams.asString(filePart.getInputStream());
                        break;
                    case "foreignprice":
                        foreignprice = Streams.asString(filePart.getInputStream());
                        break;
                    case "localprice":
                        localprice = Streams.asString(filePart.getInputStream());
                        break;
                    case "weight":
                        weight = Streams.asString(filePart.getInputStream());
                        break;
                    case "sos":
                        sourceOfSupply = Streams.asString(filePart.getInputStream());
                        break;
                    case "ssos":
                        secSourceOfSupply = Streams.asString(filePart.getInputStream());
                        break;
                    case "cop":
                        costOfProduct = Streams.asString(filePart.getInputStream());
                        break;
                    case "pBrand":
                        productBrand = Streams.asString(filePart.getInputStream());
                        break;
                    case "fProduct":
                        checked = Streams.asString(filePart.getInputStream());
                        break;
                    case "desc":
                        description = Streams.asString(filePart.getInputStream());
                        break;
                    case "gst":
                        gst = Streams.asString(filePart.getInputStream());
                        break;
                    case "shippingcosts":
                        shippingCosts = Streams.asString(filePart.getInputStream());
                        break;
//                    case "tier1discountedprice":
//                        tier1DiscountedPrice = Streams.asString(filePart.getInputStream());
//                        break;
//                    case "tier2discountedprice":
//                        tier2DiscountedPrice = Streams.asString(filePart.getInputStream());
//                        break;
//                    case "tier3discountedprice":
//                        tier3DiscountedPrice = Streams.asString(filePart.getInputStream());
//                        break;
//                    case "tier4discountedprice":
//                        tier4DiscountedPrice = Streams.asString(filePart.getInputStream());
//                        break;
                    case "tier1markup":
                        tier1MarkupPercentage = Streams.asString(filePart.getInputStream());
                        break;
                    case "tier2markup":
                        tier2MarkupPercentage = Streams.asString(filePart.getInputStream());
                        break;
                    case "tier3markup":
                        tier3MarkupPercentage = Streams.asString(filePart.getInputStream());
                        break;
                    case "tier4markup":
                        tier4MarkupPercentage = Streams.asString(filePart.getInputStream());
                        break;
//                    case "tier1markupprice":
//                        tier1MarkupPrice = Streams.asString(filePart.getInputStream());
//                        break;
//                    case "tier2markupprice":
//                        tier2MarkupPrice = Streams.asString(filePart.getInputStream());
//                        break;
//                    case "tier3markupprice":
//                        tier3MarkupPrice = Streams.asString(filePart.getInputStream());
//                        break;
//                    case "tier4markupprice":
//                        tier4MarkupPrice = Streams.asString(filePart.getInputStream());
//                        break;
                    default:
                        break;
                }
                continue;
            }
            if (!filePart.getSubmittedFileName().isEmpty()) {
                imagePartList.add(filePart);
            }
        }
        System.out.println("\"" + description + "\"");

        boolean featuredProduct = false;
        if (!checked.equals("")) {
            featuredProduct = true;
        }

        description = description.replace("&", "%26");
        category = category.replace("&", "%26");

        if (productName.equals("")) {
            productName = "Product Name coming soon...";
        }
        if (partNo.equals("")) {
            partNo = "Part Number coming soon...";
        }
        if (quantity.equals("")) {
            quantity = "0";
        }
        if (foreignprice.equals("")) {
            foreignprice = "0.00";
        }
        if (localprice.equals("")) {
            localprice = "0.00";
        }
        if (weight.equals("")) {
            weight = "0.00";
        }
        if (sourceOfSupply.equals("")) {
            sourceOfSupply = "Source of Supply coming soon...";
        }
        if (secSourceOfSupply.equals("")) {
            secSourceOfSupply = "Secondary Source of Supply coming soon...";
        }
        if (costOfProduct.equals("")) {
            costOfProduct = "0.00";
        }
        if (description == null || description.equals("")) {
            description = "The product description for this item is still in progress...";
        }
        if (productBrand.equals("")) {
            productBrand = "Product Brand coming soon...";
        }


//        if (tier1DiscountedPrice.equals("")) {
//            tier1DiscountedPrice = "0.0";
//        }
//        if (tier2DiscountedPrice.equals("")) {
//            tier2DiscountedPrice = "0.0";
//        }
//        if (tier3DiscountedPrice.equals("")) {
//            tier3DiscountedPrice = "0.0";
//        }
//        if (tier4DiscountedPrice.equals("")) {
//            tier4DiscountedPrice = "0.0";
//        }


        if (tier1MarkupPercentage.equals("")) {
            tier1MarkupPercentage = "0.00";
        }
        if (tier2MarkupPercentage.equals("")) {
            tier2MarkupPercentage = "0.00";
        }
        if (tier3MarkupPercentage.equals("")) {
            tier3MarkupPercentage = "0.00";
        }
        if (tier4MarkupPercentage.equals("")) {
            tier4MarkupPercentage = "0.00";
        }
        
        
//        if (tier1MarkupPrice.equals("")) {
//            tier1MarkupPrice = "0.0";
//        }
//        if (tier2MarkupPrice.equals("")) {
//            tier2MarkupPrice = "0.0";
//        }
//        if (tier3MarkupPrice.equals("")) {
//            tier3MarkupPrice = "0.0";
//        }
//        if (tier4MarkupPrice.equals("")) {
//            tier4MarkupPrice = "0.0";
//        }

        if (shippingCosts.equals("")) {
            shippingCosts = "0.0";
        }

        String POST_URL = Global.BASE_URL + "/addProductPhase1";
        String POST_PARAMS = "pName=" + productName + "&partNo=" + partNo
                + "&pCategory=" + category + "&pQty=" + quantity
                + "&pFMPrice=" + foreignprice + "&pLMPrice=" + localprice
                + "&pWeight=" + weight + "&sos=" + sourceOfSupply
                + "&ssos=" + secSourceOfSupply + "&cop=" + costOfProduct
                + "&pDesc=" + description + "&pFeatured=" + featuredProduct
                + "&pBrand=" + productBrand
                + "&tier1markup=" + tier1MarkupPercentage
                + "&tier2markup=" + tier2MarkupPercentage
                + "&tier3markup=" + tier3MarkupPercentage
                + "&tier4markup=" + tier4MarkupPercentage
                + "&gst=" + gst
                + "&shippingcosts=" + shippingCosts;
        System.out.println(POST_PARAMS);
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();
        
        if (!status) {
            String message = obj.get("message").getAsString();
            request.setAttribute("message", message);
            return;
        }
        
        JsonObject dataObj = obj.get("data").getAsJsonObject();
        String id = dataObj.get("_id").getAsString();
        request.getSession().setAttribute("_id", id);
        uploadImage(imagePartList, request, response, id);
    }

    private void uploadImage(ArrayList<Part> imagePartList, HttpServletRequest request,
            HttpServletResponse response, String id) throws IOException {
        ArrayList<String> imgList = new ArrayList<>();
        List<String> tempStorage = new ArrayList<>();
        InputStream filecontent = null;
        try {
            List<String> imageType = new ArrayList<>();
            List<String> imageList = new ArrayList<>();
            int i = 0;
            int index = 0;
            String tempName = "temp";

            for (Part imagePart : imagePartList) {
                filecontent = imagePart.getInputStream();
                String imageContentType = imagePart.getContentType();
                String fileName = tempName + (++index) + "." + (imageContentType.split("/")[1]);
                tempStorage.add(fileName);

                processWatermark(fileName, filecontent);

                String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;
                File outputFile = new File(systempath + fileName);

                InputStream targetStream = new FileInputStream(outputFile);

                imageType.add(imageContentType.substring(imageContentType.indexOf("/") + 1));
                byte b[] = IOUtils.toByteArray(targetStream);
                byte[] encodeBase64 = Base64.encodeBase64(b);
                String base64DataString = new String(encodeBase64, "UTF-8");
                String temp = base64DataString.replaceAll("\\+", "%2B");
                imgList.add(temp);
            }
            int j = 0;
            JsonArray imageJsonArr = new JsonArray();
            for (String img : imgList) {
                String POST_URL = Global.BASE_URL + "/addProductPhase3";
                String POST_PARAMS = "pId=" + id + "&productImage=" + img + "&fileType=" + imageType.get(j++);
                String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
                JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
                boolean status = obj.get("status").getAsBoolean();
                if (!status) {
                    String message = obj.get("message").getAsString();
                    request.setAttribute("message", message);
                    return;
                }
            }
            removeAllAddedTempFiles(tempStorage);
            String url = "selectBNM.jsp?_id=" + id;
            response.sendRedirect(url);
        } catch (JsonSyntaxException | IOException e) {
            String url = "selectBNM.jsp?_id=" + id;
            response.sendRedirect(url);
        } finally {
            if (filecontent != null) {
                filecontent.close();
            }
        }
    }

    void processWatermark(String fileName, InputStream filecontent) throws IOException {
        String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;;

        // Indicate watermark file location
        File overlay = new File(systempath + "SN_Watermark.png");

        File input = new File(systempath + fileName);

        // Create original uploaded file into img folder
        OutputStream outStream = new FileOutputStream(input);
        byte[] buffer = new byte[8 * 1024];
        int bytesRead;
        while ((bytesRead = filecontent.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }

        // Indicate final watermarked included image location
        File outputFile = new File(systempath + fileName);
        addImageWatermark(overlay, input, outputFile);
    }

    void removeAllAddedTempFiles(List<String> fileNames) throws IOException {
        String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;;
        for (String fileName : fileNames) {
            File file = new File(systempath + fileName);
            file.delete();
        }
    }

    void addImageWatermark(File watermarkImageFile, File sourceImageFile, File destImageFile) {
        try {
            BufferedImage sourceImage = ImageIO.read(sourceImageFile);
            BufferedImage watermarkImage = ImageIO.read(watermarkImageFile);

            // initializes necessary graphic properties
            Graphics2D g2d = (Graphics2D) sourceImage.getGraphics();
            AlphaComposite alphaChannel = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f);
            g2d.setComposite(alphaChannel);

            // calculates the coordinate where the image is painted
            int topLeftX = (sourceImage.getWidth() - watermarkImage.getWidth()) / 2;
            int topLeftY = (sourceImage.getHeight() - watermarkImage.getHeight()) / 2;

            // paints the image watermark
            g2d.drawImage(watermarkImage, topLeftX, topLeftY, null);

            ImageIO.write(sourceImage, "png", destImageFile);
            g2d.dispose();

            System.out.println("The image watermark is added to the image.");

        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}