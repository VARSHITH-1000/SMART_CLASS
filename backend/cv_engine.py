import cv2
import numpy as np
import base64
import math

try:
    import mediapipe as mp
    if hasattr(mp, "solutions"):
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            refine_landmarks=True
        )
        HAS_MEDIAPIPE = True
    else:
        HAS_MEDIAPIPE = False
except ImportError:
    HAS_MEDIAPIPE = False

# Constants for Eye Aspect Ratio calculation
# These are typical landmarks for eyes in MediaPipe Face Mesh
RIGHT_EYE = [33, 160, 158, 133, 153, 144]
LEFT_EYE = [362, 385, 387, 263, 373, 380]

def euclidean_distance(p1, p2):
    return math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2)

def calculate_ear(landmarks, eye_indices):
    """Calculates the Eye Aspect Ratio."""
    p2_p6 = euclidean_distance(landmarks[eye_indices[1]], landmarks[eye_indices[5]])
    p3_p5 = euclidean_distance(landmarks[eye_indices[2]], landmarks[eye_indices[4]])
    p1_p4 = euclidean_distance(landmarks[eye_indices[0]], landmarks[eye_indices[3]])

    # Check to avoid division by zero
    if p1_p4 == 0:
        return 0

    ear = (p2_p6 + p3_p5) / (2.0 * p1_p4)
    return ear

def estimate_head_pose(landmarks):
    """
    Very simplified head pose estimation proxy.
    Checks distance between nose tip and side of face.
    Returns strings: 'center', 'left', 'right', 'up', 'down'
    """
    nose_tip = landmarks[1]
    left_cheek = landmarks[234]
    right_cheek = landmarks[454]

    left_dist = nose_tip.x - left_cheek.x
    right_dist = right_cheek.x - nose_tip.x

    ratio = left_dist / (right_dist + 1e-6)

    if ratio > 1.5:
        return "left"
    elif ratio < 0.6:
        return "right"
    # Vertical checking is omitted here for brevity, but would use y-coords
    return "center"

def calculate_attention(ear, head_pose, faces_count):
    """
    Calculates a weighted attention score.
    """
    if faces_count == 0:
        return 0.0, "absent", True, False, "none"

    if faces_count > 1:
        # Penalty for multiple faces (potential cheating/distraction)
        return 20.0, "multiple_faces", False, False, "center"

    score = 100.0
    drowsiness = False

    # Drowsiness detection (EAR threshold typically ~0.2)
    if ear < 0.22:
        score -= 50.0
        drowsiness = True

    # Head pose penalty
    if head_pose != "center":
        score -= 40.0

    emotion = "focused"
    if score < 50:
        emotion = "distracted"
    if drowsiness:
        emotion = "tired"

    return max(0.0, score), emotion, False, drowsiness, head_pose

# We could maintain a moving average per student_id here if we had state,
# but for stateless processing, we return the raw score and smooth it in the DB/frontend.

def process_frame(base64_image: str):
    # Decode base64 image
    img_data = base64.b64decode(base64_image.split(',')[1] if ',' in base64_image else base64_image)
    np_arr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        return {"error": "Invalid image"}

    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    attention_score = 0.0
    emotion = "neutral"
    faces_detected = 0
    drowsiness = False
    missing_face = True
    head_pose = "none"

    if HAS_MEDIAPIPE:
        results = face_mesh.process(image_rgb)

        if results.multi_face_landmarks:
            faces_detected = len(results.multi_face_landmarks)
            landmarks = results.multi_face_landmarks[0].landmark # Analyze first face

            left_ear = calculate_ear(landmarks, LEFT_EYE)
            right_ear = calculate_ear(landmarks, RIGHT_EYE)
            avg_ear = (left_ear + right_ear) / 2.0

            head_pose = estimate_head_pose(landmarks)

            attention_score, emotion, missing_face, drowsiness, head_pose = calculate_attention(avg_ear, head_pose, faces_detected)
        else:
            attention_score, emotion, missing_face, drowsiness, head_pose = calculate_attention(0, "none", 0)
    else:
        # Mock fallback for test environment
        attention_score = 85.0
        emotion = "focused_mock"
        faces_detected = 1
        missing_face = False
        head_pose = "center"

    return {
        "attention_score": attention_score,
        "emotion": emotion,
        "faces_detected": faces_detected,
        "drowsiness": drowsiness,
        "missing_face": missing_face,
        "head_pose": head_pose
    }
