package com.example.inventory_system.user.service;

import com.example.inventory_system.user.dto.CreateStaffRequest;
import com.example.inventory_system.user.dto.StaffResponse;

import java.util.List;

public interface UserService {

    StaffResponse createStaff(CreateStaffRequest request);

    List<StaffResponse> getStaffs();

    StaffResponse updateStaffStatus(Long userId, Boolean enabled);
}