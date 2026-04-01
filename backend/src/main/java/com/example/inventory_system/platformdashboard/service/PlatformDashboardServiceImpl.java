package com.example.inventory_system.platformdashboard.service;

import com.example.inventory_system.order.repository.OrderRepository;
import com.example.inventory_system.platformdashboard.dto.PackageSalesItemResponse;
import com.example.inventory_system.platformdashboard.dto.PackageSalesResponse;
import com.example.inventory_system.platformdashboard.dto.PlatformChartPointResponse;
import com.example.inventory_system.platformdashboard.dto.PlatformChartResponse;
import com.example.inventory_system.platformdashboard.dto.PlatformDashboardOverviewResponse;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.shop.repository.ShopRepository;
import com.example.inventory_system.shoprequest.entity.ShopRequestStatus;
import com.example.inventory_system.shoprequest.repository.ShopRequestRepository;
import com.example.inventory_system.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PlatformDashboardServiceImpl implements PlatformDashboardService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ShopRequestRepository shopRequestRepository;
    private final SecurityService securityService;

    public PlatformDashboardServiceImpl(
            ShopRepository shopRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            ShopRequestRepository shopRequestRepository,
            SecurityService securityService
    ) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.shopRequestRepository = shopRequestRepository;
        this.securityService = securityService;
    }

    @Override
    public PlatformDashboardOverviewResponse getOverview() {
        validatePlatformAdminPermission();

        long totalShops = shopRepository.count();
        long activeShops = shopRepository.countByActiveTrue();
        long totalUsers = userRepository.countByPlatformAdminFalse();
        long totalOrders = orderRepository.count();
        long totalPackagesSold = userRepository.countBySubscriptionPackageCodeIsNotNull();
        long activeSubscriptions = userRepository.countBySubscriptionActiveTrue();

        long pendingShopRequests = shopRequestRepository.countByStatus(ShopRequestStatus.PENDING);
        long approvedShopRequests = shopRequestRepository.countByStatus(ShopRequestStatus.APPROVED);
        long rejectedShopRequests = shopRequestRepository.countByStatus(ShopRequestStatus.REJECTED);

        return new PlatformDashboardOverviewResponse(
                totalShops,
                activeShops,
                totalUsers,
                totalOrders,
                totalPackagesSold,
                activeSubscriptions,
                pendingShopRequests,
                approvedShopRequests,
                rejectedShopRequests
        );
    }

    @Override
    public PackageSalesResponse getPackageSales() {
        validatePlatformAdminPermission();

        List<Object[]> rows = userRepository.countPackageSales();
        List<PackageSalesItemResponse> items = new ArrayList<>();

        long total = 0;
        for (Object[] row : rows) {
            String packageCode = row[0] != null ? row[0].toString() : "UNKNOWN";
            long soldCount = row[1] instanceof Number ? ((Number) row[1]).longValue() : 0L;
            total += soldCount;
            items.add(new PackageSalesItemResponse(packageCode, soldCount));
        }

        return new PackageSalesResponse(total, items);
    }

    @Override
    public PlatformChartResponse getSubscriptionChart(int months) {
        validatePlatformAdminPermission();

        if (months <= 0) {
            months = 6;
        }

        LocalDate now = LocalDate.now();
        LocalDate startMonth = now.withDayOfMonth(1).minusMonths(months - 1L);
        LocalDateTime from = startMonth.atStartOfDay();

        List<Object[]> rows = userRepository.countMonthlySubscriptionSales(from);
        Map<String, Long> valueMap = new HashMap<>();

        for (Object[] row : rows) {
            String monthLabel = row[0] != null ? row[0].toString() : "";
            long count = row[1] instanceof Number ? ((Number) row[1]).longValue() : 0L;
            valueMap.put(monthLabel, count);
        }

        List<PlatformChartPointResponse> points = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (int i = 0; i < months; i++) {
            LocalDate month = startMonth.plusMonths(i);
            String label = month.format(formatter);
            long value = valueMap.getOrDefault(label, 0L);
            points.add(new PlatformChartPointResponse(label, value));
        }

        return new PlatformChartResponse(points);
    }

    @Override
    public PlatformChartResponse getOrderChart(int days) {
        validatePlatformAdminPermission();

        if (days <= 0) {
            days = 7;
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1L);
        LocalDateTime from = startDate.atStartOfDay();
        LocalDateTime to = today.plusDays(1).atStartOfDay();

        List<Object[]> rows = orderRepository.countOrdersByDay(from, to);
        Map<String, Long> valueMap = new HashMap<>();

        for (Object[] row : rows) {
            String dayLabel = row[0] != null ? row[0].toString() : "";
            long count = row[1] instanceof Number ? ((Number) row[1]).longValue() : 0L;
            valueMap.put(dayLabel, count);
        }

        List<PlatformChartPointResponse> points = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            String label = date.toString();
            long value = valueMap.getOrDefault(label, 0L);
            points.add(new PlatformChartPointResponse(label, value));
        }

        return new PlatformChartResponse(points);
    }

    private void validatePlatformAdminPermission() {
        if (!Boolean.TRUE.equals(securityService.getCurrentUser().getPlatformAdmin())
                && !securityService.getCurrentUser().getRoleNames().contains("PLATFORM_ADMIN")) {
            throw new RuntimeException("Only platform admin can access platform dashboard");
        }
    }
}