from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient


def test_order_decrements_stock(
    client: TestClient, make_drop
) -> None:
    drop = make_drop(stock=5)

    response = client.post(f"/drops/{drop['id']}/orders")

    assert response.status_code == 201

    updated = client.get(f"/drops/{drop['id']}")

    assert updated.status_code == 200
    assert updated.json()["remaining"] == 4


def test_last_pair_sells_out_drop(
    client: TestClient, make_drop
) -> None:
    drop = make_drop(stock=2)

    # Première commande : il reste une paire.
    first = client.post(f"/drops/{drop['id']}/orders")
    assert first.status_code == 201

    updated = client.get(f"/drops/{drop['id']}").json()
    assert updated["remaining"] == 1
    assert updated["status"] == "live"

    # Deuxième commande : dernière paire vendue.
    second = client.post(f"/drops/{drop['id']}/orders")
    assert second.status_code == 201

    updated = client.get(f"/drops/{drop['id']}").json()
    assert updated["remaining"] == 0
    assert updated["status"] == "sold_out"


def test_cannot_order_sold_out_drop(
    client: TestClient, make_drop
) -> None:
    drop = make_drop(stock=1)

    first = client.post(f"/drops/{drop['id']}/orders")
    assert first.status_code == 201

    second = client.post(f"/drops/{drop['id']}/orders")

    assert second.status_code == 409

    updated = client.get(f"/drops/{drop['id']}").json()
    assert updated["remaining"] == 0


def test_cannot_order_before_drop_opens(
    client: TestClient, make_drop
) -> None:
    future = datetime.now(UTC) + timedelta(hours=1)

    drop = make_drop(
        stock=5,
        opens_at=future.isoformat().replace("+00:00", "Z"),
    )

    response = client.post(f"/drops/{drop['id']}/orders")

    assert response.status_code == 409

    updated = client.get(f"/drops/{drop['id']}").json()
    assert updated["remaining"] == 5


def test_order_unknown_drop_returns_404(
    client: TestClient,
) -> None:
    response = client.post("/drops/999999/orders")

    assert response.status_code == 404