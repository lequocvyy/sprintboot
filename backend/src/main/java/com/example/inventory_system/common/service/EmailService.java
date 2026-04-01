package com.example.inventory_system.common.service;

public interface EmailService {
    void sendNewAccountEmail(String toEmail, String fullName, String username, String rawPassword);
}