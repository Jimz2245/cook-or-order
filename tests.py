import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_user():
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "testpassword123"
    })
    assert response.status_code == 201
    assert "user_id" in response.json()


def test_login_user():
    # Register first
    client.post("/api/auth/register", json={
        "email": "login_test@example.com",
        "password": "testpassword123"
    })
    # Then login
    response = client.post("/api/auth/login", json={
        "email": "login_test@example.com",
        "password": "testpassword123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_compare_no_ingredients():
    response = client.post("/api/compare", json={"ingredients": []})
    assert response.status_code == 400


def test_compare_too_many_ingredients():
    ingredients = [f"ingredient_{i}" for i in range(25)]
    response = client.post("/api/compare", json={"ingredients": ingredients})
    assert response.status_code == 400
