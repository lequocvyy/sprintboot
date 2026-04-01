package com.example.inventory_system.user.controller;

import com.example.inventory_system.user.dto.CreateStaffRequest;
import com.example.inventory_system.user.dto.StaffResponse;
import com.example.inventory_system.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.inventory_system.user.dto.UpdateStaffStatusRequest;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER', 'SHOP_MANAGER')")
@GetMapping("/staff")
public List<StaffResponse> getStaffs() {
    return userService.getStaffs();
}

    @PreAuthorize("hasAuthority('SHOP_OWNER')")
    @PostMapping("/staff")
    public StaffResponse createStaff(@Valid @RequestBody CreateStaffRequest request) {
        return userService.createStaff(request);
    }

    @PreAuthorize("hasAuthority('SHOP_OWNER')")
@PatchMapping("/staff/{id}/status")
public StaffResponse updateStaffStatus(
        @PathVariable Long id,
        @RequestBody UpdateStaffStatusRequest request
) {
    return userService.updateStaffStatus(id, request.getEnabled());
}
}