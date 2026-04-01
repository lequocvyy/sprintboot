package com.example.inventory_system.auth.controller;

import com.example.inventory_system.auth.dto.ChangePasswordRequest;
import com.example.inventory_system.auth.dto.LoginRequest;
import com.example.inventory_system.auth.dto.LoginResponse;
import com.example.inventory_system.auth.dto.OwnerRegistrationRequest;
import com.example.inventory_system.auth.dto.OwnerRegistrationResponse;
import com.example.inventory_system.auth.dto.SubscriptionPackageResponse;
import com.example.inventory_system.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/public/packages")
    public List<SubscriptionPackageResponse> getPackages() {
        return authService.getPackages();
    }

    @PostMapping("/public/register-owner")
    public OwnerRegistrationResponse registerOwner(@Valid @RequestBody OwnerRegistrationRequest request) {
        return authService.registerOwnerAfterPayment(request);
    }

    @PostMapping("/change-password")
    public String changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return "Password changed successfully";
    }
}