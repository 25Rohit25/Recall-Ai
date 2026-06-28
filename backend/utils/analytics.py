from models import HealthBreakdown

def calculate_meeting_health(breakdown: HealthBreakdown) -> int:
    """
    Calculate the deterministic meeting health score based on the strict weighted formula.
    Final Score = (0.25 * participation) + (0.20 * decision_clarity) + 
                  (0.20 * action_completion) + (0.15 * sentiment) + (0.20 * ownership)
    """
    score = (
        (0.25 * breakdown.participation) +
        (0.20 * breakdown.decision_clarity) +
        (0.20 * breakdown.action_completion) +
        (0.15 * breakdown.sentiment) +
        (0.20 * breakdown.ownership)
    )
    
    return int(round(score))
