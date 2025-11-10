# tests/test_screening.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") in ["healthy", "ok"]
    print("✅ Health check OK")


def test_screening_success():
    """Test screening dengan data valid"""
    test_data = {
        "jawaban": {f"G{i:02}": "SS" if i % 2 == 0 else "S" for i in range(1, 22)}
    }

    response = client.post("/api/screening", json=test_data)
    assert response.status_code == 200

    data = response.json()
    for disease in ["Depresi", "Kecemasan", "Stres"]:
        assert disease in data
        assert "kategori" in data[disease]
        assert "keterangan" in data[disease]
        assert isinstance(data[disease]["kategori"], str)
        assert isinstance(data[disease]["keterangan"], str)


def test_screening_invalid_code():
    """Test dengan kode gejala tidak valid"""
    test_data = {"jawaban": {"G99": "SS"}}
    response = client.post("/api/screening", json=test_data)
    assert response.status_code == 400
    assert "Kode gejala tidak valid" in response.json()["detail"]


def test_screening_invalid_value():
    """Test dengan nilai severity tidak valid"""
    test_data = {"jawaban": {"G01": "INVALID"}}
    response = client.post("/api/screening", json=test_data)
    assert response.status_code == 400
    assert "Nilai severity tidak valid" in response.json()["detail"]


def test_screening_partial_data():
    """Test dengan sebagian data"""
    test_data = {"jawaban": {"G01": "SS", "G02": "S"}}
    response = client.post("/api/screening", json=test_data)
    assert response.status_code == 200
    data = response.json()
    for disease in ["Depresi", "Kecemasan", "Stres"]:
        assert disease in data


def test_screening_empty_data():
    """Test dengan data kosong"""
    test_data = {"jawaban": {}}
    response = client.post("/api/screening", json=test_data)
    assert response.status_code == 400
    assert "Minimal harus ada 1 gejala" in response.json()["detail"]
