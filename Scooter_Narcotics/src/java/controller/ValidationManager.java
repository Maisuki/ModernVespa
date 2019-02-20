package controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidationManager {

    public static final Pattern VALID_EMAIL_ADDRESS_REGEX
            = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
    public static final Pattern PASSWORD_PATTERN = Pattern.compile("((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=*-_]).{6,20})");

    public static boolean validateEmail(String emailStr) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX.matcher(emailStr);
        return matcher.find();
    }

    public static boolean validatePassword(String passwordStr) {
        Matcher matcher = PASSWORD_PATTERN.matcher(passwordStr);
        return matcher.find();
    }
}
