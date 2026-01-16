from app.services.rule_engine import RuleEngine
from app.models.rule import Rule

def test_rule_engine_allows_valid_payload(db_session):
    rule = Rule(
        name="Test Rule",
        version=1,
        is_active=True,
        conditions=[{"field": "amount", "operator": "gt", "value": 1000}],
    )
    db_session.add(rule)
    db_session.commit()

    engine = RuleEngine()
    allowed, reason = engine.evaluate({"amount": 2000}, db_session)

    assert allowed is True
    assert reason == "Rule satisfied"


def test_rule_engine_rejects_invalid_payload(db_session):
    engine = RuleEngine()
    allowed, reason = engine.evaluate({"amount": 100}, db_session)

    assert allowed is False
