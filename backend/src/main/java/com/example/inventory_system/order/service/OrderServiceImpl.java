package com.example.inventory_system.order.service;

import com.example.inventory_system.common.exception.BusinessException;
import com.example.inventory_system.common.exception.ResourceNotFoundException;
import com.example.inventory_system.inventory.entity.Inventory;
import com.example.inventory_system.inventory.repository.InventoryRepository;
import com.example.inventory_system.order.dto.OrderResponse;
import com.example.inventory_system.order.entity.Order;
import com.example.inventory_system.order.entity.OrderItem;
import com.example.inventory_system.order.entity.OrderStatus;
import com.example.inventory_system.order.mapper.OrderMapper;
import com.example.inventory_system.order.repository.OrderRepository;
import com.example.inventory_system.order.request.CreateOrderItemRequest;
import com.example.inventory_system.order.request.CreateOrderRequest;
import com.example.inventory_system.product.entity.Product;
import com.example.inventory_system.product.repository.ProductRepository;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.stocktransaction.dto.StockTransactionRequest;
import com.example.inventory_system.stocktransaction.service.StockTransactionService;
import com.example.inventory_system.warehouse.entity.Warehouse;
import com.example.inventory_system.warehouse.entity.WarehouseStatus;
import com.example.inventory_system.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionService stockTransactionService;
    private final SecurityService securityService;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            InventoryRepository inventoryRepository,
            StockTransactionService stockTransactionService,
            SecurityService securityService
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionService = stockTransactionService;
        this.securityService = securityService;
    }

    @Override
    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        Warehouse warehouse = warehouseRepository.findByIdAndShopId(request.getWarehouseId(), shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found in current shop"));

        if (warehouse.getStatus() != WarehouseStatus.ACTIVE) {
            throw new BusinessException("Cannot create order with inactive warehouse");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BusinessException("Order items must not be empty");
        }

        validateDuplicateProducts(request.getItems());
        validateItemsAgainstWarehouseStock(request.getItems(), warehouse.getId(), shopId);

        Order order = new Order();
        order.setShop(warehouse.getShop());
        order.setOrderCode(generateOrderCode(shopId));
        order.setCustomerName(request.getCustomerName().trim());
        order.setWarehouseId(request.getWarehouseId());
        order.setStatus(OrderStatus.CREATED);

        List<OrderItem> orderItems = new ArrayList<>();

        for (CreateOrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findByIdAndShopId(itemRequest.getProductId(), shopId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found in current shop: " + itemRequest.getProductId()
                    ));

            if (itemRequest.getQuantity() == null || itemRequest.getQuantity() <= 0) {
                throw new BusinessException("Quantity must be greater than 0");
            }

            if (itemRequest.getPrice() == null || itemRequest.getPrice() < 0) {
                throw new BusinessException("Price must be greater than or equal to 0");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(itemRequest.getPrice());

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getAll() {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        return orderRepository.findByShopIdOrderByCreatedAtDesc(shopId)
                .stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse getById(Long id) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        Order order = orderRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found in current shop"));

        return OrderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse confirm(Long id) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        Order order = orderRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found in current shop"));

        if (order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BusinessException("Order already confirmed");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessException("Cancelled order cannot be confirmed");
        }

        Warehouse warehouse = warehouseRepository.findByIdAndShopId(order.getWarehouseId(), shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found in current shop"));

        if (warehouse.getStatus() != WarehouseStatus.ACTIVE) {
            throw new BusinessException("Cannot confirm order with inactive warehouse");
        }

        validateOrderStock(order, shopId);

        for (OrderItem item : order.getItems()) {
            StockTransactionRequest transactionRequest = new StockTransactionRequest();
            transactionRequest.setProductId(item.getProduct().getId());
            transactionRequest.setWarehouseId(order.getWarehouseId());
            transactionRequest.setQuantity(item.getQuantity());
            transactionRequest.setReference(order.getOrderCode());
            transactionRequest.setNote("Stock out for order confirmation");

            stockTransactionService.stockOut(transactionRequest);
        }

        order.setStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toResponse(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse cancel(Long id) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        Order order = orderRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found in current shop"));

        if (order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BusinessException("Confirmed order cannot be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toResponse(savedOrder);
    }

    @Override
    public void delete(Long id) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        Order order = orderRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found in current shop"));

        if (order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BusinessException("Cannot delete confirmed order");
        }

        orderRepository.delete(order);
    }

    private void validateDuplicateProducts(List<CreateOrderItemRequest> items) {
        Set<Long> seen = new HashSet<>();

        for (CreateOrderItemRequest item : items) {
            if (item.getProductId() == null) {
                throw new BusinessException("Product is required");
            }

            if (!seen.add(item.getProductId())) {
                throw new BusinessException("Duplicate product in order items: " + item.getProductId());
            }
        }
    }

    private void validateItemsAgainstWarehouseStock(List<CreateOrderItemRequest> items, Long warehouseId, Long shopId) {
        for (CreateOrderItemRequest item : items) {
            Inventory inventory = inventoryRepository
                    .findByProductIdAndWarehouseIdAndShopId(item.getProductId(), warehouseId, shopId)
                    .orElseThrow(() -> new BusinessException(
                            "Product " + item.getProductId() + " is not available in selected warehouse"
                    ));

            if (inventory.getQuantity() < item.getQuantity()) {
                throw new BusinessException(
                        "Insufficient stock for product " + item.getProductId()
                );
            }
        }
    }

    private void validateOrderStock(Order order, Long shopId) {
        for (OrderItem item : order.getItems()) {
            Inventory inventory = inventoryRepository
                    .findByProductIdAndWarehouseIdAndShopId(
                            item.getProduct().getId(),
                            order.getWarehouseId(),
                            shopId
                    )
                    .orElseThrow(() -> new BusinessException(
                            "Inventory not found for product " + item.getProduct().getId()
                    ));

            if (inventory.getQuantity() < item.getQuantity()) {
                throw new BusinessException(
                        "Not enough stock for product " + item.getProduct().getName()
                );
            }
        }
    }

    private String generateOrderCode(Long shopId) {
        String datePart = LocalDate.now().toString().replace("-", "");
        int sequence = 1;

        while (true) {
            String code = "ORD-" + datePart + "-" + String.format("%03d", sequence);
            if (!orderRepository.existsByOrderCodeAndShopId(code, shopId)) {
                return code;
            }
            sequence++;
        }
    }
}