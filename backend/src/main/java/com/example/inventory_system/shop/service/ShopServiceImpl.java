package com.example.inventory_system.shop.service;

import com.example.inventory_system.role.entity.Role;
import com.example.inventory_system.role.entity.RoleName;
import com.example.inventory_system.role.repository.RoleRepository;
import com.example.inventory_system.shop.dto.CreateShopRequest;
import com.example.inventory_system.shop.entity.Shop;
import com.example.inventory_system.shop.repository.ShopRepository;
import com.example.inventory_system.user.entity.User;
import com.example.inventory_system.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ShopServiceImpl(ShopRepository shopRepository,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Shop createShop(CreateShopRequest request) {

        if (shopRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Shop code already exists");
        }

        if (shopRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Shop slug already exists");
        }

        if (userRepository.existsByUsername(request.getOwnerUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getOwnerEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Shop shop = new Shop();
        shop.setCode(request.getCode());
        shop.setName(request.getName());
        shop.setSlug(request.getSlug());
        shop.setAddress(request.getAddress());
        shop.setActive(true);

        Shop savedShop = shopRepository.save(shop);

        Role ownerRole = roleRepository.findByName(RoleName.SHOP_OWNER)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User owner = new User();
        owner.setUsername(request.getOwnerUsername());
        owner.setEmail(request.getOwnerEmail());
        owner.setPassword(passwordEncoder.encode(request.getOwnerPassword()));
        owner.setFullName(request.getOwnerFullName());
        owner.setEnabled(true);
        owner.setPlatformAdmin(false);
        owner.setShop(savedShop);

        Set<Role> roles = new HashSet<>();
        roles.add(ownerRole);
        owner.setRoles(roles);

        userRepository.save(owner);

        return savedShop;
    }

    @Override
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }
}