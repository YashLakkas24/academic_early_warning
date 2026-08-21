import numpy as np


def calculate_trend(test_scores):
    x = np.arange(len(test_scores))

    slope = np.polyfit(x, test_scores, 1)[0]

    if slope < -3:
        trend = "DECLINING"
    elif slope > 3:
        trend = "IMPROVING"
    else:
        trend = "STABLE"

    return slope, trend
