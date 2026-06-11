def calculate_risk(
    incident_type: str,
    priority: str,
    location: str,
):
    score = 0

    # Тип инцидента
    type_scores = {
        "утечка": 60,
        "отказ оборудования": 50,
        "коррозия": 35,
        "пожарная опасность": 80,
        "загазованность": 70,
        "сбой автоматики": 45,
        "другое": 20,
    }

    score += type_scores.get(incident_type.lower(), 10)

    # Приоритет
    priority_scores = {
        "низкий": 10,
        "средний": 20,
        "высокий": 40,
        "критический": 60,
    }

    score += priority_scores.get(priority.lower(), 10)

    # Локация
    location_scores = {
        "резервуар": 30,
        "насосная": 20,
        "склад": 10,
    }

    location_lower = location.lower()

    if "упн" in location_lower:
        score += 25
    elif "цех" in location_lower:
        score += 20
    elif "резервуар" in location_lower:
        score += 30
    elif "насос" in location_lower:
        score += 20
    else:
        score += 10

    if score <= 40:
        level = "LOW"
    elif score <= 80:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return score, level
