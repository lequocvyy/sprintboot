package com.example.inventory_system.platformdashboard.dto;

public class PlatformChartPointResponse {

    private String label;
    private long value;

    public PlatformChartPointResponse() {
    }

    public PlatformChartPointResponse(String label, long value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public long getValue() {
        return value;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setValue(long value) {
        this.value = value;
    }
}