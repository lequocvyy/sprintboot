package com.example.inventory_system.role.repository;

import com.example.inventory_system.role.entity.Role;
import com.example.inventory_system.role.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);
}