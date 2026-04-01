package com.example.inventory_system.user.repository;

import com.example.inventory_system.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByShopId(Long shopId);

    List<User> findByShopIdAndPlatformAdminFalse(Long shopId);

    long countByPlatformAdminFalse();

    long countBySubscriptionPackageCodeIsNotNull();

    long countBySubscriptionActiveTrue();

    @Query("""
            select u.subscriptionPackageCode, count(u)
            from User u
            where u.platformAdmin = false
              and u.subscriptionPackageCode is not null
            group by u.subscriptionPackageCode
            order by count(u) desc
            """)
    List<Object[]> countPackageSales();

    @Query("""
            select function('date_format', u.subscriptionStartAt, '%Y-%m'), count(u)
            from User u
            where u.platformAdmin = false
              and u.subscriptionPackageCode is not null
              and u.subscriptionStartAt is not null
              and u.subscriptionStartAt >= :from
            group by function('date_format', u.subscriptionStartAt, '%Y-%m')
            order by function('date_format', u.subscriptionStartAt, '%Y-%m')
            """)
    List<Object[]> countMonthlySubscriptionSales(@Param("from") LocalDateTime from);
}