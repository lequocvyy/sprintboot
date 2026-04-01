package com.example.inventory_system.config;

import com.example.inventory_system.role.entity.Role;
import com.example.inventory_system.role.entity.RoleName;
import com.example.inventory_system.role.repository.RoleRepository;
import com.example.inventory_system.user.entity.User;
import com.example.inventory_system.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedPlatformAdmin();
    }

    private void seedRoles() {
        createRoleIfNotExists(RoleName.PLATFORM_ADMIN);
        createRoleIfNotExists(RoleName.SHOP_OWNER);
        createRoleIfNotExists(RoleName.SHOP_MANAGER);
        createRoleIfNotExists(RoleName.SHOP_STAFF);
    }

    private void createRoleIfNotExists(RoleName roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
    }

    private void seedPlatformAdmin() {
        String adminUsername = "platformadmin";

        if (userRepository.findByUsername(adminUsername).isPresent()) {
            return;
        }

        Role platformAdminRole = roleRepository.findByName(RoleName.PLATFORM_ADMIN)
                .orElseThrow(() -> new RuntimeException("PLATFORM_ADMIN role not found"));

        User admin = new User();
        admin.setUsername("platformadmin");
        admin.setEmail("admin@inventorysystem.com");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setFullName("Platform Admin");
        admin.setEnabled(true);
        admin.setPlatformAdmin(true);
        admin.setShop(null);

        Set<Role> roles = new HashSet<>();
        roles.add(platformAdminRole);
        admin.setRoles(roles);

        userRepository.save(admin);
    }
}