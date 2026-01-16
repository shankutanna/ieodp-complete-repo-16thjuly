from sqlalchemy.orm import Session
from app.models.rule import Rule
from typing import Any, Tuple


class RuleEngine:
    """
    Enterprise Rule Engine
    - Config-driven
    - Versioned
    - Auditable
    """

    def evaluate(self, payload: dict, db: Session) -> Tuple[bool, str, int, str]:
        rule = (
            db.query(Rule)
            .filter(
                Rule.is_active.is_(True),
                Rule.workflow_type == payload["workflow_type"],
            )
            .order_by(Rule.version.desc())
            .first()
        )

        if not rule:
            return False, "NO_ACTIVE_RULE", -1, "REJECTED"

        for condition in rule.conditions:
            field = condition["field"]
            operator = condition["operator"]
            expected = condition["value"]

            actual = self._resolve_field(payload, field)

            if actual is None:
                return False, f"MISSING_FIELD:{field}", rule.version, "REJECTED"

            if not self._compare(actual, operator, expected):
                return (
                    False,
                    f"RULE_FAILED:{field}",
                    rule.version,
                    rule.outcome,
                )

        return True, "RULE_PASSED", rule.version, rule.outcome

    def _resolve_field(self, payload: dict, field: str):
        parts = field.split(".")
        value = payload
        for p in parts:
            value = value.get(p)
            if value is None:
                return None
        return value

    def _compare(self, actual: Any, operator: str, expected: Any) -> bool:
        if operator == "gt":
            return actual > expected
        if operator == "gte":
            return actual >= expected
        if operator == "lt":
            return actual < expected
        if operator == "lte":
            return actual <= expected
        if operator == "eq":
            return actual == expected
        if operator == "neq":
            return actual != expected
        raise ValueError(f"Unsupported operator: {operator}")
