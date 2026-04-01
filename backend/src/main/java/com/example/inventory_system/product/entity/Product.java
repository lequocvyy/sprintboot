package com.example.inventory_system.product.entity;
import com.example.inventory_system.shop.entity.Shop;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @ManyToOne(optional = false)
@JoinColumn(name = "shop_id")
private Shop shop;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String sku;

    private Double price;

    public Product() {
    }

    public Product(Long id, String name, String sku, Double price) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public Double getPrice() {
        return price;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
    public Shop getShop() {
    return shop;
}

public void setShop(Shop shop) {
    this.shop = shop;
}
}