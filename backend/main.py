import cv2
import numpy as np
from sklearn.cluster import MiniBatchKMeans
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
from PIL import Image
import time
import random


app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

uploads_dir = os.path.join(app.instance_path, "uploads")
os.makedirs(uploads_dir, exist_ok=True)


def create_bar(height, width, color):
    bar = np.zeros((height, width, 3), np.uint8)
    bar[:] = color
    red, green, blue = int(color[0]), int(color[1]), int(color[2])
    return bar, (red, green, blue)


@app.route("/image", methods=["GET", "POST"])
def main():
    start_time = time.time()
    files = request.files
    file = files.get("image")

    if file:
        file.save(os.path.join(uploads_dir, secure_filename(file.filename)))

    if request.form["clusters"]:
        number_clusters = json.loads(request.form["clusters"])

    if request.form["first"]:
        firstColor = json.loads(request.form["first"])

    if number_clusters == 2:
        if request.form["second"]:
            secondColor = json.loads((request.form["second"]))
    img = cv2.imread(f"instance/uploads/{file.filename}")
    arr = img.reshape((-1, 3))

    kmeans = MiniBatchKMeans(n_clusters=2, random_state=42).fit(arr)

    labels = kmeans.labels_
    centers = kmeans.cluster_centers_
    less_colors = centers[labels].reshape(img.shape).astype("uint8")

    bars = []
    rgb_values = []

    for index, row in enumerate(centers):
        bar, rgb = create_bar(200, 200, row)
        bars.append(bar)
        rgb_values.append(rgb)

    first = list(rgb_values[0])
    if number_clusters == 2:
        second = list(rgb_values[1])

    less_colors[(less_colors[:, :] == first).all(axis=2)] = firstColor
    if number_clusters == 2:
        less_colors[(less_colors[:, :] == second).all(axis=2)] = secondColor

    im = Image.fromarray(less_colors)

    random_number = random.randint(0, 1000)

    uploads_dir_random = os.path.join("uploads", str(random_number))
    os.makedirs(uploads_dir_random, exist_ok=True)
    im.save(f"uploads/{random_number}/result.png")
    filen = f"uploads/{random_number}/result"

    final_time = time.time() - start_time

    return jsonify(
        {
            "file": filen,
            "colors": rgb_values,
            "time": f"{round(final_time, 2)} to run",
        }
    )


@app.route("/uploads/<id>/<filename>", methods=["GET"])
def give(id, filename):
    print(filename)
    filen = f"./uploads/{id}/" + filename + ".png"
    return send_file(filen)


app.run()
