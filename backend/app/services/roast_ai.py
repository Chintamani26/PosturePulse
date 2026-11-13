import random

ROAST_POOL = {
    "god_tier": [
        "Bro's posture is straighter than a laser beam. Absolute sovereign alignment.",
        "Spinal column forged in titanium. Certified posture monarch.",
        "Zero slouch detected. The chiropractors have nothing on you.",
    ],
    "mid_tier": [
        "Not terrible, but your lower back is starting to whisper for help.",
        "You're slouching like you're carrying the weight of a failed startup on your C7 vertebra.",
        "Mid-tier spine energy. Room to grow, bestie.",
    ],
    "slouch_lord": [
        "Bro is folding like a cheap lawn chair. Fix that lumbar spine immediately.",
        "Your spine is shaped like a question mark. Ergonomics left the chat.",
        "Absolute shrimp posture. Stand up before your vertebrae file for divorce.",
    ],
}


def generate_gen_z_roast(score: float) -> tuple[int, str]:
    if score >= 85:
        category = "god_tier"
        rank = random.randint(1, 5)
    elif score >= 60:
        category = "mid_tier"
        rank = random.randint(6, 25)
    else:
        category = "slouch_lord"
        rank = random.randint(26, 100)

    roast = random.choice(ROAST_POOL[category])
    return rank, roast
