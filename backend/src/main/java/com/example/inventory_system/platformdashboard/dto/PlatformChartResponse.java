package com.example.inventory_system.platformdashboard.dto;

import java.util.List;

public class PlatformChartResponse {

    private List<PlatformChartPointResponse> points;

    public PlatformChartResponse() {
    }

    public PlatformChartResponse(List<PlatformChartPointResponse> points) {
        this.points = points;
    }

    public List<PlatformChartPointResponse> getPoints() {
        return points;
    }

    public void setPoints(List<PlatformChartPointResponse> points) {
        this.points = points;
    }
}