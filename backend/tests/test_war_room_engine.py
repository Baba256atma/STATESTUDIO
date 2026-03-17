from __future__ import annotations

from backend.engines.system_modeling.system_model_builder import UniversalSystemModelBuilder
from backend.engines.war_room.war_room_engine import StrategyWarRoomEngine
from backend.engines.war_room.war_room_schema import WarRoomActor, WarRoomSimulation


def test_war_room_engine_runs_market_competition_scenario():
    model = UniversalSystemModelBuilder().build(
        "Supply chain delays are increasing costs and reducing customer satisfaction. "
        "Suppliers are unreliable and inventory shortages create panic orders while competitors cut prices."
    )
    result = StrategyWarRoomEngine().run(
        WarRoomSimulation(
            system_model=model,
            actors=[
                WarRoomActor(id="actor_company", type="company"),
                WarRoomActor(id="actor_competitor", type="competitor"),
            ],
            strategies={
                "actor_company": ["expand capacity", "diversify suppliers"],
                "actor_competitor": ["price war", "product innovation"],
            },
            time_steps=8,
        )
    )

    assert len(result.timeline) == 9
    assert result.actor_outcomes
    assert result.dominant_strategy is not None
    assert 0.0 <= result.stability_score <= 1.0


def test_war_room_engine_detects_conflict_events():
    model = UniversalSystemModelBuilder().build(
        "The startup faces intense competition and rising burn. Leadership wants growth, but investors worry about stability."
    )
    result = StrategyWarRoomEngine().run(
        WarRoomSimulation(
            system_model=model,
            actors=[
                WarRoomActor(id="actor_startup", type="company"),
                WarRoomActor(id="actor_rival", type="competitor"),
            ],
            strategies={
                "actor_startup": ["reduce price", "expand capacity"],
                "actor_rival": ["price war", "product innovation"],
            },
            time_steps=6,
        )
    )

    assert any(event.type == "market_share_battle" for event in result.conflict_events)


def test_war_room_engine_tracks_fragility_and_strategy_paths():
    model = UniversalSystemModelBuilder().build(
        "Political instability is increasing protest intensity and reducing legitimacy. Government pressure is rising and economic costs are increasing."
    )
    result = StrategyWarRoomEngine().run(
        WarRoomSimulation(
            system_model=model,
            actors=[
                WarRoomActor(id="actor_government", type="government"),
                WarRoomActor(id="actor_pressure_group", type="pressure_group"),
            ],
            strategies={
                "actor_government": ["policy intervention", "budget freeze"],
                "actor_pressure_group": ["aggressive pressure", "cooperate on reform"],
            },
            time_steps=8,
        )
    )

    assert "event_count" in result.system_fragility
    assert result.strategy_paths
    assert all(item.strategy_history for item in result.actor_outcomes)
