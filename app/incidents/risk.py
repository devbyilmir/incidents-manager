def calculate_risk(
    incident_type: str,
    priority: str,
    location: str,
):
    score = 0

    # Тип инцидента
    type_scores = {
        "утечка": 50,
        "отказ оборудования": 40,
        "перегрев": 30,
        "авария": 60,
    }

    score += type_scores.get(incident_type.lower(), 10)

    # Приоритет
    priority_scores = {
        "низкий": 10,
        "средний": 20,
        "высокий": 30,
    }

    score += priority_scores.get(priority.lower(), 10)

    # Локация
    location_scores = {
        "резервуар": 30,
        "насосная": 20,
        "склад": 10,
    }

    score += location_scores.get(location.lower(), 5)

    if score <= 30:
        level = "LOW"
    elif score <= 60:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return score, level