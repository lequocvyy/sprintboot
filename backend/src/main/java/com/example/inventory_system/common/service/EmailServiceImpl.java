package com.example.inventory_system.common.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendNewAccountEmail(String toEmail, String fullName, String username, String rawPassword) {
        try {
            System.out.println(">>> Sending mail to: " + toEmail);
            System.out.println(">>> From mail: " + fromEmail);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setFrom(fromEmail, "Inventory System");
            helper.setTo(toEmail);
            helper.setSubject("Thong tin tai khoan quan ly kho");

            String html = """
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Xin chao %s,</h2>
                        <p>Tai khoan quan ly kho cua ban da duoc tao thanh cong.</p>
                        <p><strong>Ten dang nhap:</strong> %s</p>
                        <p><strong>Mat khau tam:</strong> %s</p>
                        <p>Vui long dang nhap va doi mat khau som nhat.</p>
                        <p>Tran trong,<br/>Inventory System</p>
                    </div>
                    """.formatted(fullName, username, rawPassword);

            helper.setText(html, true);

            mailSender.send(message);

            System.out.println(">>> Mail sent successfully to: " + toEmail);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new RuntimeException("Khong gui duoc email: " + ex.getMessage(), ex);
        }
    }
}