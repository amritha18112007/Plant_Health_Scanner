import os
import torch
import torch.nn as nn
import numpy as np
from PIL import Image
from torchvision import models, transforms
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Count

from .models import LeafScan, ScanResult, Recommendation
from .descriptions import DISEASE_KNOWLEDGE

# --- 1. PYTORCH MODEL ARCHITECTURE (ResNet18) ---
def load_resnet_model():
    # Define the same architecture used in Colab
    model = models.resnet18(weights=None) 
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 5) # Updated for your 5 classes
    
    # Load the .pth file weights
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ml_models', 'plant_health_model.pth')
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    model.eval()
    return model

# Initialize the model once when the server starts
model = load_resnet_model()

# --- 2. CLASS LABELS & PREPROCESSING ---
CLASS_LABELS = ['Bacteria', 'Fungi', 'Healthy', 'Pests', 'Virus']

# Standard PyTorch normalization for ResNet
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# --- 3. AUTHENTICATION ---
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User registered successfully', 'user_id': user.id})

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        return Response({'message': 'Login successful', 'user_id': user.id})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# --- 4. SCANNING & AI LOGIC ---
@api_view(['POST'])
def handle_scan_upload(request):
    user_id = request.data.get('user_id')
    img_file = request.FILES.get('image')
    
    # Save scan data to database
    scan = LeafScan.objects.create(user_id=user_id, image=img_file)
    
    # PyTorch Inference
    img = Image.open(scan.image.path).convert('RGB')
    img_t = transform(img).unsqueeze(0) # Add batch dimension

    # --- FIX: Ensure the AI actually thinks before answering ---
with torch.no_grad():
    outputs = model(img_t)
    # This line converts the AI's raw numbers into percentages
    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
    confidence, index = torch.max(probabilities, 0)

diagnosis = CLASS_LABELS[index.item()]
conf_score = float(confidence.item() * 100)

# IMPORTANT: Check this line! If diagnosis is 'Fungi', it shouldn't say 'Healthy'
status_label = "Healthy" if diagnosis == "Healthy" else "Diseased"

    # Save Results
    result_obj = ScanResult.objects.create(
        scan=scan,
        deficiency_type=diagnosis,
        confidence_score=conf_score,
        recommendation=info["cure"]
    )

    Recommendation.objects.create(
        result=result_obj,
        solution=info["desc"],
        treatment=info["cure"],
        tips=info["goal"]
    )

    # Prepare Dynamic URLs
    plant_type = diagnosis.lower() # Matches filenames like 'healthy.jpg' or 'fungi.jpg'
    target_url = f"http://127.0.0.1:8000/media/targets/{plant_type}.jpg"

    return Response({
        "status": status_label,
        "type": diagnosis,
        "confidence": round(conf_score, 2),
        "recommendation": info["cure"],
        "image_url": f"http://127.0.0.1:8000{scan.image.url}",
        "target_image_url": target_url
    })

# --- 5. HISTORY & ADMIN ---
@api_view(['GET'])
def get_scan_history(request):
    user_id = request.query_params.get('user_id')
    results = ScanResult.objects.filter(scan__user_id=user_id).order_by('-scan__timestamp')
    history_data = [{
        "date": r.scan.timestamp,
        "type": r.deficiency_type,
        "confidence": r.confidence_score,
        "status": "Healthy" if r.deficiency_type == "Healthy" else "Diseased",
        "recommendation": r.recommendation
    } for r in results]
    return Response(history_data)

@api_view(['GET'])
def get_admin_metrics(request):
    metrics = ScanResult.objects.values('deficiency_type').annotate(count=Count('id'))
    return Response(list(metrics))