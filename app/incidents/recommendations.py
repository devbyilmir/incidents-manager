def get_recommendation(risk_score: int):

    if risk_score >= 150:
        return "Рекомендуется немедленная проверка оборудования"

    if risk_score >= 100:
        return "Требуется контроль ответственного специалиста"

    return "Плановый мониторинг состояния объекта"