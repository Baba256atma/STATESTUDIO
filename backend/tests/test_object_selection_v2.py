from __future__ import annotations

import pytest

from app.services.object_selection_v2 import load_object_catalog, select_objects_v2


def test_select_objects_v2_inventory_drop_and_delays():
    catalog = load_object_catalog()
    if len(catalog) < 12:
        pytest.skip("catalog has fewer than 12 objects")

    out = select_objects_v2("inventory drop and delays", "business")
    assert 12 <= len(out.allowed_objects) <= 20

    if "obj_inventory" in catalog:
        assert "obj_inventory" in out.allowed_objects

    assert out.focused_object_id in {"obj_inventory", "obj_delivery"} or out.focused_object_id in out.allowed_objects
