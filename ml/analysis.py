import numpy as np

try:
    from skimage.color import rgb2lab
except Exception as e:
    raise ImportError("Need scikit-image for rgb2lab. pip install scikit-image") from e


def _mask_pixels_rgb(image_array: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    image_array: (H,W,3) uint8 RGB
    mask: (H,W) uint8 or bool; foreground can be 1 or 255
    returns: (N,3) uint8 RGB pixels
    """
    if mask.dtype != bool:
        mask_bool = mask > 0
    else:
        mask_bool = mask
    return image_array[mask_bool]


def compute_metrics(
    image_array: np.ndarray,
    skin_mask: np.ndarray,
    hair_mask: np.ndarray | None = None,
) -> dict:
    """
    Returns:
      value_score   ~ L/100
      chroma_score  ~ chroma/60  (matches your current scale closely)
      undertone_score ~ normalized warmth proxy (0..1) using (b-a)
      lab_median    {L,a,b}
      contrast      abs(L_hair - L_skin)/100  (0..1-ish)
    """

    # --- skin pixels ---
    skin_rgb = _mask_pixels_rgb(image_array, skin_mask)
    if skin_rgb.size == 0:
        raise ValueError("No skin pixels found (skin_mask empty).")

    skin_lab = rgb2lab(skin_rgb.reshape(-1, 1, 3) / 255.0).reshape(-1, 3)

    # Filter out extreme shadows/highlights (stabilizes undertone a TON)
    L = skin_lab[:, 0]
    keep = (L > 25) & (L < 85)
    skin_lab = skin_lab[keep] if np.any(keep) else skin_lab

    L_med = float(np.median(skin_lab[:, 0]))
    a_med = float(np.median(skin_lab[:, 1]))
    b_med = float(np.median(skin_lab[:, 2]))

    value_score = np.clip(L_med / 100.0, 0.0, 1.0)

    chroma = float(np.sqrt(a_med * a_med + b_med * b_med))
    chroma_score = np.clip(chroma / 60.0, 0.0, 1.0)  # << calibrated to your observed numbers

    # warmth proxy from (b-a); squashed to 0..1
    # NOTE: this is NOT "true undertone" scientifically; it's a deterministic heuristic.
    warm_raw = (b_med - a_med)
    undertone_score = 1.0 / (1.0 + np.exp(-(warm_raw / 4.0)))  # steeper = more separation

    # --- contrast (hair vs skin) ---
    contrast = 0.0
    if hair_mask is not None:
        hair_rgb = _mask_pixels_rgb(image_array, hair_mask)
        if hair_rgb.size > 0:
            hair_lab = rgb2lab(hair_rgb.reshape(-1, 1, 3) / 255.0).reshape(-1, 3)
            L_hair = float(np.median(hair_lab[:, 0]))
            contrast = abs(L_hair - L_med) / 100.0  # 0..1

    return {
        "value_score": float(value_score),
        "chroma_score": float(chroma_score),
        "undertone_score": float(undertone_score),
        "contrast": float(contrast),
        "lab_median": {"L": L_med, "a": a_med, "b": b_med},
    }


def classify_season(metrics: dict) -> str:
    """
    Deterministic hard-cutoff classifier tuned to your 4 example labels.
    Uses:
      - value_score
      - chroma_score
      - contrast
      - undertone_score (lightweight helper, but contrast does most of the Winter/Summer separation)
    """

    v = metrics["value_score"]
    c = metrics["chroma_score"]
    u = metrics["undertone_score"]
    k = metrics.get("contrast", 0.0)

    # --- primary “Winter protection” ---
    # Winter = high contrast + reasonably clear
    if (k >= 0.28) and (c >= 0.38):
        return "Winter"

    # --- Spring ---
    # Spring = lighter + clear + lower contrast
    if (v >= 0.62) and (c >= 0.40) and (k <= 0.22):
        return "Spring"

    # --- Summer ---
    # Summer = lighter + softer + not high contrast
    if (v >= 0.62) and (c < 0.40) and (k < 0.28):
        return "Summer"

    # --- Autumn ---
    # Autumn = default warm-ish + softer/medium (this will catch you)
    # (u threshold prevents very cool readings from becoming Autumn)
    if (u >= 0.50) and (c < 0.40):
        return "Autumn"

    # fallback: if not warm, decide by contrast
    return "Winter" if k >= 0.28 else "Summer"