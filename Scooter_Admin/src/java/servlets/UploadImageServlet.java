package servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
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
import java.util.Collection;
import java.util.List;
import java.util.TreeSet;
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

@MultipartConfig
@WebServlet(name = "UploadImageServlet", urlPatterns = {"/uploadImage"})
public class UploadImageServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        List<Part> list = new ArrayList<>(request.getParts());
        if (!list.isEmpty()) {
            InputStream filecontent = null;
            String[] imageArr = new String[list.size() - 2];
            int i = 0;
            String id = "";
            List<String> imageType = new ArrayList<>();

            String tempName = "temp";
            int index = 0;
            ArrayList<String> tempStorage = new ArrayList<>();

            try {
                for (Part filePart : list) {
                    Collection<String> headerNames = new TreeSet<>(filePart.getHeaderNames());
                    if (filePart.getContentType() == null) {
                        String cd = filePart.getHeader("content-disposition");
                        String fieldName = cd.split("=")[1].replace("\"", "");
                        if (!fieldName.equals("upload")) {
                            if (cd.split("=")[1].replace("\"", "").equals("pid")) {
                                id = request.getParameter(fieldName);
                            }
                        }
                        continue;
                    }

                    filecontent = filePart.getInputStream();
                    String imageContentType = filePart.getContentType();
                    String fileName = tempName + (++index) + "." + (imageContentType.split("/")[1]);
                    tempStorage.add(fileName);

                    processWatermark(fileName, filecontent);

                    String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;;
                    File outputFile = new File(systempath + fileName);

                    InputStream targetStream = new FileInputStream(outputFile);

                    imageType.add(imageContentType.substring(imageContentType.indexOf("/") + 1));
                    byte b[] = IOUtils.toByteArray(targetStream);
                    byte[] encodeBase64 = Base64.encodeBase64(b);
                    String base64DataString = new String(encodeBase64, "UTF-8");
                    String temp = base64DataString.replaceAll("\\+", "%2B");
                    imageArr[i++] = temp;
                }
                int j = 0;
                JsonArray imageJsonArr = new JsonArray();
                for (String img : imageArr) {
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
                String url = "products.jsp";
                response.sendRedirect(url);

            } catch (Exception e) {
                String url = "products.jsp";
                response.sendRedirect(url);
            } finally {
                if (filecontent != null) {
                    filecontent.close();
                }
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

    void removeAllAddedTempFiles(ArrayList<String> fileNames) throws IOException {
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
