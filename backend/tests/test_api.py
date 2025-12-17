"""
Test cases cho API endpoints
"""

import pytest
from fastapi.testclient import TestClient
from src.api import app

client = TestClient(app)


def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_predict_year():
    """Test predict year endpoint"""
    response = client.get("/predict-year?year=2026")
    assert response.status_code == 200
    data = response.json()
    assert "year" in data
    assert data["year"] == 2026


def test_feature_importance():
    """Test feature importance endpoint"""
    response = client.get("/feature-importance")
    assert response.status_code == 200
    data = response.json()
    assert "features" in data
    assert "importance_scores" in data


def test_yield_history():
    """Test yield history endpoint"""
    response = client.get("/yield-history")
    assert response.status_code == 200
    data = response.json()
    assert "years" in data
    assert "actual_yields" in data
