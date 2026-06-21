from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Load YOLO models
animal_model = YOLO("animal_best_v3.pt")
injury_model = YOLO("injury_best_v9.pt")


def get_severity(injury, description=""):

    description = description.lower()

    critical_words = [
        "heavy bleeding",
        "too much blood",
        "blood loss",
        "severe bleeding",
        "unconscious",
        "not moving",
        "dying",
        "hit by car",
        "hit by bike",
        "accident",
        "fracture",
        "broken leg",
        "cannot fly",
        "not flying",
        "wing detached",
        "unable to stand",
        "spinal injury"
    ]

    high_words = [
        "deep cut",
        "large cut",
        "open wound",
        "deep wound",
        "severe cut",
        "bone visible",
        "leg broken",
        "swelling",
        "pus",
        "infected",
        "bleeding",
        "maggots",
        "unable to walk",
        "burn",
        "severe pain",
        "wing injury",
        "broken wing",
        "wing fracture",
        "dislocated wing",
        "wing broken",
        "eye injury",
        "eye bleeding",
        "tail fracture",
        "cannot eat",
        "jaw injury"
    ]

    medium_words = [
        "limping",
        "small wound",
        "weak",
        "swelling",
        "skin problem",
        "injured"
    ]

    low_words = [
        "small scratch",
        "minor scratch",
        "small wound",
        "slight injury",
        "hungry",
        "abandoned",
        "minor injury",
        "lost",
        "needs food"
    ]

    # Description gets highest priority

    if any(word in description for word in critical_words):
        return "CRITICAL"

    if any(word in description for word in high_words):
        return "HIGH"

    if any(word in description for word in medium_words):
        return "MEDIUM"

    if any(word in description for word in low_words):
        return "LOW"

    # Fallback to image prediction

    if injury == "bleeding":
        return "CRITICAL"

    elif injury == "fracture":
        return "HIGH"

    elif injury == "infection":
        return "HIGH"

    elif injury == "cut":
        return "MEDIUM"

    return "NONE"


def get_best_prediction(results, model):

    best_label = "Unknown"
    best_conf = 0

    for r in results:

        for box in r.boxes:

            cls_id = int(box.cls[0])
            conf = float(box.conf[0])

            if conf > best_conf:

                best_label = model.names[cls_id]
                best_conf = conf

    return best_label, round(best_conf, 2)


@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Animal Injury Detection API is running",
        "endpoint": "/predict",
        "method": "POST",
        "required_fields": {
            "image": "File",
            "description": "Text optional"
        }
    })


@app.route("/predict", methods=["GET", "POST"])
def predict():

    if request.method == "GET":

        return jsonify({
            "message": "Use POST method with form-data key 'image' and optional key 'description'"
        })

    if "image" not in request.files:

        return jsonify({
            "error": "No image uploaded",
            "required_field": "image"
        }), 400

    image = request.files["image"]

    description = request.form.get(
        "description",
        ""
    )

    if image.filename == "":

        return jsonify({
            "error": "No selected image"
        }), 400

    filename = secure_filename(
        image.filename
    )

    image_path = f"temp_{filename}"

    image.save(image_path)

    try:

        # Animal Detection

        animal_results = animal_model.predict(
            image_path,
            conf=0.25,
            verbose=False
        )

        animal, animal_conf = get_best_prediction(
            animal_results,
            animal_model
        )

        # Injury Detection

        injury_results = injury_model.predict(
            image_path,
            conf=0.25,
            verbose=False
        )

        injury, injury_conf = get_best_prediction(
            injury_results,
            injury_model
        )

        # Severity Calculation
        severity = get_severity(
            injury,
            description
        )

        if injury == "Unknown":
            injury = "No Injury"

        ngo_alert_required = severity in [
            "HIGH",
            "CRITICAL"
        ]

        return jsonify({

            "success": True,

            "animal": animal,
            "animal_confidence": animal_conf,

            "injury": injury,
            "injury_confidence": injury_conf,

            "description": description,

            "severity": severity,

            "ngo_alert_required":
                ngo_alert_required

        })

    finally:

        if os.path.exists(
            image_path
        ):
            os.remove(
                image_path
            )


if __name__ == "__main__":
    print("Starting Animal Injury Detection API...")
    app.run(
        debug=True
    )