import torch
import numpy as np
import base64
import io
import torch.nn.functional as F
from PIL import Image
from transformers import SegformerImageProcessor, AutoModelForSemanticSegmentation

processor = SegformerImageProcessor.from_pretrained("jonathandinu/face-parsing")
model = AutoModelForSemanticSegmentation.from_pretrained("jonathandinu/face-parsing")
model.eval()
# print("id2label =", model.config.id2label)


def pil_to_b64_png(img: Image.Image):
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def create_binary_mask(segmentation, label_ids):
    mask = np.isin(segmentation, label_ids).astype(np.uint8)  # 0 or 1
    pil_mask = Image.fromarray(mask * 255)                    # display
    return mask, pil_mask


def parse_face(image: Image.Image):
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    # logits: [1, num_classes, h, w]
    logits = outputs.logits

    # Upsample logits to original image size (PIL uses (W, H))
    target_h, target_w = image.size[1], image.size[0]
    logits = F.interpolate(
        logits,
        size=(target_h, target_w),
        mode="bilinear",
        align_corners=False,
    )

    # segmentation map: [H, W]
    segmentation = torch.argmax(logits, dim=1)[0].cpu().numpy()

    skin_mask_arr, skin_mask = create_binary_mask(segmentation, [1])
    hair_mask_arr, hair_mask = create_binary_mask(segmentation, [13])
    lip_mask_arr, lip_mask = create_binary_mask(segmentation, [11, 12])

    return {
    "skin_mask_b64": pil_to_b64_png(skin_mask),
    "hair_mask_b64": pil_to_b64_png(hair_mask),
    "lip_mask_b64": pil_to_b64_png(lip_mask),

    # NEW: raw mask arrays (0/1)
    "skin_mask_array": skin_mask_arr.tolist(),
    "hair_mask_array": hair_mask_arr.tolist(),
    }
