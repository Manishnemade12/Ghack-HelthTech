# from flask import Flask, render_template, Response, jsonify
# import cv2
# import numpy as np
# import tensorflow as tf
# import requests

# app = Flask(__name__)

# # Load ML Model
# model = tf.keras.models.load_model("model/emotion_model.h5")
# emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# # AI API Configuration
# GEMINI_API_KEY = "AIzaSyAlH6fGlkav2uGJckN3diEO1HGAhzztYME"

# # OpenCV for webcam
# camera = cv2.VideoCapture(0)

# # Function to detect emotion from frame
# def detect_emotion(frame):
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     gray = cv2.resize(gray, (48, 48))
#     gray = np.expand_dims(gray, axis=0).reshape(1, 48, 48, 1) / 255.0
#     prediction = model.predict(gray)
#     return emotion_labels[np.argmax(prediction)]

# # AI-generated response
# def get_solution(emotion):
#     prompt = f"I am feeling {emotion}. What should I do?"
#     url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key={GEMINI_API_KEY}"
    
#     payload = {
#         "contents": [
#             {"parts": [{"text": prompt}]}
#         ]
#     }
    
#     response = requests.post(url, json=payload)
    
#     print("API Response Status Code:", response.status_code)
#     print("API Response Text:", response.text)  # Debugging ke liye print karo
    
#     try:
#         return response.json().get("candidates", [{}])[0].get("content", "No response")
#     except requests.exceptions.JSONDecodeError:
#         return "API did not return valid JSON"

# # Stream video frames
# def generate_frames():
#     while True:
#         success, frame = camera.read()
#         if not success:
#             break
#         else:
#             emotion = detect_emotion(frame)
#             _, buffer = cv2.imencode('.jpg', frame)
#             frame = buffer.tobytes()
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# # Video feed route
# @app.route("/video_feed")
# def video_feed():
#     return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

# # Get emotion & advice
# @app.route("/get_advice")
# def get_advice():
#     success, frame = camera.read()
#     if not success:
#         return jsonify({"error": "Camera not working"})
    
#     emotion = detect_emotion(frame)
#     advice = get_solution(emotion)
#     return jsonify({"emotion": emotion, "advice": advice})

# # Home page
# @app.route("/")
# def home():
#     return render_template("index.html")

# if __name__ == "__main__":
#     app.run(debug=True)

# from flask import Flask, render_template, Response, jsonify
# import cv2
# import numpy as np
# import tensorflow as tf
# import requests
# import base64

# app = Flask(__name__)

# # Load ML Model
# model = tf.keras.models.load_model("model/emotion_model.h5")
# emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# # AI API Configuration
# GEMINI_API_KEY = "AIzaSyAlH6fGlkav2uGJckN3diEO1HGAhzztYME"

# # OpenCV for webcam
# camera = cv2.VideoCapture(0)

# # Function to detect emotion from frame
# def detect_emotion(frame):
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     gray = cv2.resize(gray, (48, 48))
#     gray = np.expand_dims(gray, axis=0).reshape(1, 48, 48, 1) / 255.0
#     prediction = model.predict(gray)
#     return emotion_labels[np.argmax(prediction)]

# # AI-generated response from Gemini
# def get_solution(emotion):
#     prompt = f"I am feeling {emotion}. What should I do?"
#     url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key={GEMINI_API_KEY}"
    
#     payload = {
#         "contents": [
#             {"parts": [{"text": prompt}]}
#         ]
#     }
    
#     headers = {"Content-Type": "application/json"}
    
#     response = requests.post(url, json=payload, headers=headers)
    
#     print("API Response Status Code:", response.status_code)
#     print("API Response Text:", response.text)  # Debugging ke liye print karo
    
#     try:
#         response_json = response.json()
#         if "candidates" in response_json and response_json["candidates"]:
#             return response_json["candidates"][0].get("content", "No response from AI")
#         else:
#             return "No valid response received from AI"
#     except requests.exceptions.JSONDecodeError:
#         return "API did not return valid JSON"

# # Stream video frames
# def generate_frames():
#     while True:
#         success, frame = camera.read()
#         if not success:
#             break
#         else:
#             _, buffer = cv2.imencode('.jpg', frame)
#             frame = buffer.tobytes()
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# # Video feed route
# @app.route("/video_feed")
# def video_feed():
#     return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

# # Auto Emotion Detection & Advice
# @app.route("/get_advice")
# def get_advice():
#     success, frame = camera.read()
#     if not success:
#         return jsonify({"error": "Camera not working"})

#     emotion = detect_emotion(frame)
#     advice = get_solution(emotion)

#     # Convert frame to base64 for displaying in HTML
#     _, buffer = cv2.imencode('.jpg', frame)
#     img_data = base64.b64encode(buffer).decode('utf-8')

#     return render_template("result.html", emotion=emotion, advice=advice, img_data=img_data)

# # Home page
# @app.route("/")
# def home():
#     return render_template("index.html")

# if __name__ == "__main__":
#     app.run(debug=True)

# from flask import Flask, render_template, Response, jsonify
# import cv2
# import numpy as np
# import tensorflow as tf
# import requests
# import base64

# app = Flask(__name__)

# # Load ML Model
# model = tf.keras.models.load_model("model/emotion_model.h5")
# emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# # AI API Configuration
# GEMINI_API_KEY = "AIzaSyAlH6fGlkav2uGJckN3diEO1HGAhzztYME"

# # OpenCV for webcam
# camera = cv2.VideoCapture(0)

# # Function to detect emotion from frame
# def detect_emotion(frame):
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     gray = cv2.resize(gray, (48, 48))
#     gray = np.expand_dims(gray, axis=0).reshape(1, 48, 48, 1) / 255.0
#     prediction = model.predict(gray)
#     return emotion_labels[np.argmax(prediction)]

# # Function to generate AI solution
# # def get_solution(emotion):
# #     prompt = f"I am feeling {emotion}. What should I do?"
# #     url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key={GEMINI_API_KEY}"
    
# #     headers = {"Content-Type": "application/json"}
# #     data = {"contents": [{"parts": [{"text": prompt}]}]}

# #     try:
# #         response = requests.post(url, json=data, headers=headers)
# #         if response.status_code == 200:
# #             response_data = response.json()
# #             # ✅ Correct way to extract text from Gemini API response
# #             return response_data["candidates"][0]["content"]["parts"][0]["text"]
# #         else:
# #             return f"Error: {response.status_code} - {response.text}"
# #     except Exception as e:
# #         return str(e)
# def get_solution(emotion):
#     prompt = f"I am feeling {emotion}. What should I do?"
#     url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key={GEMINI_API_KEY}"
    
#     headers = {"Content-Type": "application/json"}
#     data = {"prompt": {"text": prompt}}  # ✅ Corrected format

#     try:
#         response = requests.post(url, json=data, headers=headers)
#         if response.status_code == 200:
#             response_data = response.json()
#             return response_data["candidates"][0]["output"]  # ✅ Corrected key
#         else:
#             return f"Error: {response.status_code} - {response.text}"
#     except Exception as e:
#         return str(e)

# # Video feed route
# def generate_frames():
#     while True:
#         success, frame = camera.read()
#         if not success:
#             break
#         else:
#             _, buffer = cv2.imencode('.jpg', frame)
#             frame_bytes = buffer.tobytes()
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/get_advice')
# def get_advice():
#     success, frame = camera.read()
#     if not success:
#         return jsonify({"error": "Could not capture frame"}), 500

#     emotion = detect_emotion(frame)
#     advice = get_solution(emotion)

#     _, buffer = cv2.imencode('.jpg', frame)
#     img_data = base64.b64encode(buffer).decode('utf-8')  # ✅ Correct base64 encoding

#     return render_template("result.html", emotion=emotion, advice=advice, img_data=img_data)

# if __name__ == '__main__':
#     app.run(debug=True)





from flask import Flask, render_template, Response, jsonify
import cv2
import numpy as np
import tensorflow as tf
import json

app = Flask(__name__)

# Load ML Model
model = tf.keras.models.load_model("model/emotion_model.h5")
emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# Load JSON Data
with open("data.json", "r") as file:
    emotion_responses = json.load(file)

# OpenCV for webcam
camera = cv2.VideoCapture(0)

# Function to detect emotion from frame
def detect_emotion(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, (48, 48))
    gray = np.expand_dims(gray, axis=0).reshape(1, 48, 48, 1) / 255.0
    prediction = model.predict(gray)
    return emotion_labels[np.argmax(prediction)]

# Function to get response from JSON file
def get_solution(emotion):
    return emotion_responses.get(emotion, "No advice available for this emotion.")

# Video feed route
def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_advice')
def get_advice():
    success, frame = camera.read()
    if not success:
        return jsonify({"error": "Could not capture frame"}), 500

    emotion = detect_emotion(frame)
    advice = get_solution(emotion)

    _, buffer = cv2.imencode('.jpg', frame)
    img_data = buffer.tobytes()

    return render_template("result.html", emotion=emotion, advice=advice, img_data=img_data)

if __name__ == '__main__':
    app.run(debug=True)
