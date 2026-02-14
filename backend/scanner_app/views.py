import os
import cv2
import torch
import numpy as np
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torchvision import models, transforms

# Django & Rest Framework
from django.conf import settings
from django.core.files.storage import default_storage
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Count
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

# Explainable AI (Grad-CAM)
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

# Local Model Import
from .models import ScanResult

# ---------------------------------------------------------
# 1. MODELS & LABELS CONFIGURATION
# ---------------------------------------------------------

CLASS_LABELS = [
    'Apple Scab Leaf', 'Apple leaf', 'Apple rust leaf', 
    'Bell_pepper leaf', 'Bell_pepper leaf spot', 
    'Blueberry leaf', 'Cherry leaf', 
    'Corn Gray leaf spot', 'Corn leaf blight', 'Corn rust leaf', 
    'Peach leaf', 'Potato leaf early blight', 'Potato leaf late blight', 
    'Raspberry leaf', 'Soyabean leaf', 
    'Squash Powdery mildew leaf', 'Strawberry leaf', 
    'Tomato Early blight leaf', 'Tomato Septoria leaf spot', 'Tomato leaf', 
    'Tomato leaf bacterial spot', 'Tomato leaf late blight', 
    'Tomato leaf mosaic virus', 'Tomato leaf yellow virus', 
    'Tomato mold leaf', 'Tomato two spotted spider mites leaf', 
    'grape leaf', 'grape leaf black rot'
]

def load_models():
    # Stage 1: Gatekeeper (Is it a plant?)
    gatekeeper = models.mobilenet_v2(weights=None)
    gatekeeper.classifier[1] = nn.Linear(gatekeeper.last_channel, 2)
    gk_path = os.path.join(os.path.dirname(__file__), 'ml_models', 'gatekeeper.pth')
    if os.path.exists(gk_path):
        gatekeeper.load_state_dict(torch.load(gk_path, map_location=torch.device('cpu')))
    gatekeeper.eval()

    # Stage 2: Diagnostic Model (What disease?)
    plant_model = models.resnet18(weights=None)
    plant_model.fc = nn.Linear(plant_model.fc.in_features, 28)
    pm_path = os.path.join(os.path.dirname(__file__), 'ml_models', 'plant_health_model.pth')
    if os.path.exists(pm_path):
        plant_model.load_state_dict(torch.load(pm_path, map_location=torch.device('cpu')))
    plant_model.eval()

    return gatekeeper, plant_model

gatekeeper_model, diagnostic_model = load_models()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# ---------------------------------------------------------
# 2. STRUCTURED RECOMMENDATION ENGINE
# ---------------------------------------------------------

def get_detailed_recommendation(label, confidence):
    # Professional Agricultural Knowledge Base
    # Expanded to cover critical pathogens from your CLASS_LABELS
    DISEASE_INTEL = {
        "Tomato Septoria leaf spot": {
            "cause": "Septoria lycopersici fungi splashing from soil; thrives in high humidity and leaf wetness.",
            "treatment": "Apply Chlorothalonil or Copper-based fungicides every 7-10 days. Remove lower yellowing leaves.",
            "prognosis": "Highly manageable. Early leaf removal preserves fruit quality and prevents stem infection.",
            "next_step": "Implement stake-and-weave support to keep foliage off the ground and improve airflow.",
            "healthy_img": "tomato_healthy.jpg"
        },
        "Tomato leaf late blight": {
            "cause": "Phytophthora infestans; an aggressive water mold that spreads rapidly in cool, rainy weather.",
            "treatment": "Apply Mancozeb or specialized Oomycete fungicides. Bag and remove all infected plant tissue immediately.",
            "prognosis": "Critical risk. Without intervention, total plant collapse occurs within days. Nearby plants are at high risk.",
            "next_step": "Review your irrigation timing; never water in the evening as leaf wetness overnight fuels this pathogen.",
            "healthy_img": "tomato_healthy.jpg"
        },
        "Tomato leaf yellow virus": {
            "cause": "Begomovirus transmitted by Silverleaf Whiteflies (Bemisia tabaci) feeding on the plant phloem.",
            "treatment": "No chemical cure for the virus. Control the vector (whiteflies) using Neem oil or Yellow Sticky Traps.",
            "prognosis": "Chronic condition. Yield will be reduced. Focus on protecting uninfected newer growth.",
            "next_step": "Install fine mesh netting if in a greenhouse and eliminate weed hosts nearby that harbor whiteflies.",
            "healthy_img": "tomato_healthy.jpg"
        },
        "Corn rust leaf": {
            "cause": "Puccinia sorghi fungi; spores travel long distances via wind currents and infect in high humidity.",
            "treatment": "Apply Pyraclostrobin or Tebuconazole if infection is seen before silking phase.",
            "prognosis": "Good, provided the infection doesn't reach the upper 'ear leaves' which provide grain-fill energy.",
            "next_step": "Switch to resistant hybrids for the next planting cycle to eliminate future chemical costs.",
            "healthy_img": "corn_healthy.jpg"
        },
        "Corn leaf blight": {
            "cause": "Exserohilum turcicum; spores survive in corn residue and infect during heavy dews and moderate temperatures.",
            "treatment": "Foliar fungicides are effective if applied when lesions first appear on lower leaves.",
            "prognosis": "Can cause significant yield loss if lesions merge and destroy active leaf area before maturity.",
            "next_step": "Practice crop rotation with non-host plants (like legumes) to break the pathogen's life cycle in the soil.",
            "healthy_img": "corn_healthy.jpg"
        },
        "grape leaf black rot": {
            "cause": "Guignardia bidwellii; a devastating fungal disease that thrives in warm, humid vineyard environments.",
            "treatment": "Mancozeb or Myclobutanil applications. Prune and destroy all 'mummy' berries left on the vine.",
            "prognosis": "Fruit-critical. If leaf infection is controlled, fruit clusters can be saved for the current season.",
            "next_step": "Increase vine spacing and perform aggressive summer pruning to reduce humidity within the canopy.",
            "healthy_img": "grape_healthy.jpg"
        },
        "Apple rust leaf": {
            "cause": "Gymnosporangium juniperi-virginianae; requires Juniper/Cedar trees nearby to complete its life cycle.",
            "treatment": "Apply fungicides during the 'bud break' to 'petal fall' window. Prune galls from nearby Juniper trees.",
            "prognosis": "Cosmetic on leaves, but can cause fruit drop and reduced tree vigor if left unchecked.",
            "next_step": "If possible, remove host Juniper trees within a 2-mile radius to break the infection chain.",
            "healthy_img": "apple_healthy.jpg"
        },
        "Squash Powdery mildew leaf": {
            "cause": "Podosphaera xanthii; unique fungi that do not require liquid water to infect, only high humidity.",
            "treatment": "Spray a solution of 40% milk and 60% water, or use Sulfur-based organic sprays.",
            "prognosis": "Common and manageable. Does not kill the plant but reduces fruit size and sweetness.",
            "next_step": "Plant in full sun; shade increases humidity and leaf temperature to levels the fungi prefer.",
            "healthy_img": "squash_healthy.jpg"
        }
    }

    # Professional Logic for Automatically handling "Healthy" labels
    is_healthy = "healthy" in label.lower() or (
        "leaf" in label.lower() and 
        not any(word in label.lower() for word in ["scab", "spot", "blight", "rust", "virus", "mildew", "rot", "mold", "mites"])
    )

    if is_healthy:
        return (
            f"Score: {confidence}% | "
            "Cause: Optimal environmental conditions and efficient nutrient uptake. | "
            "Treatment: No chemical intervention required. Continue current fertilization schedule. | "
            "Prognosis: Plant is in a peak physiological state with maximum photosynthetic output. | "
            "Next Step: Perform maintenance pruning on shaded lower leaves to direct energy to new growth. | "
            "Healthy_Img: self"
        )

    # Retrieval and Fallback Logic
    info = DISEASE_INTEL.get(label, {
        "cause": "Environmental pathogen introduction via local air currents or irrigation water.",
        "treatment": f"Isolate affected areas and apply a localized organic fungicide specialized for {label.split()[0]} species.",
        "prognosis": "Recovery is likely if the diagnosis is caught within the first 15% of leaf area infection.",
        "next_step": "Sterilize all pruning tools with 70% ethanol after each cut to prevent secondary spread.",
        "healthy_img": "generic_healthy.jpg"
    })

    return (
        f"Score: {confidence}% | "
        f"Cause: {info['cause']} | "
        f"Treatment: {info['treatment']} | "
        f"Prognosis: {info['prognosis']} | "
        f"Next Step: {info['next_step']} | "
        f"Healthy_Img: {info['healthy_img']}"
    )

# ---------------------------------------------------------
# 3. HEATMAP GENERATOR
# ---------------------------------------------------------

def generate_visual_proof(model, input_tensor, label_idx, original_path):
    target_layers = [model.layer4[-1]] 
    cam = GradCAM(model=model, target_layers=target_layers)
    grayscale_cam = cam(input_tensor=input_tensor, targets=[ClassifierOutputTarget(label_idx)])[0, :]
    img = cv2.imread(original_path)
    img = cv2.resize(img, (224, 224))
    img = np.float32(img) / 255
    visualization = show_cam_on_image(img, grayscale_cam, use_rgb=True)
    heatmap_name = f"heatmap_{os.path.basename(original_path)}"
    heatmap_dir = os.path.join(settings.MEDIA_ROOT, 'heatmaps')
    os.makedirs(heatmap_dir, exist_ok=True)
    heatmap_full_path = os.path.join(heatmap_dir, heatmap_name)
    cv2.imwrite(heatmap_full_path, (visualization * 255).astype(np.uint8))
    return f"heatmaps/{heatmap_name}"

# ---------------------------------------------------------
# 4. DIAGNOSTIC VIEW
# ---------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_scan_upload(request):
    img_file = request.FILES.get('image')
    if not img_file:
        return Response({'error': 'Image required'}, status=400)

    # Save original image temporarily
    path = default_storage.save('temp_scans/' + img_file.name, img_file)
    full_path = os.path.join(settings.MEDIA_ROOT, path)

    try:
        # Load and Transform
        img = Image.open(full_path).convert('RGB')
        img_t = transform(img).unsqueeze(0)

        # Stage 1: Gatekeeper Check
        with torch.no_grad():
            gk_out = gatekeeper_model(img_t)
            conf_gk, pred_gk = torch.max(F.softmax(gk_out, dim=1), 1)

        # If pred_gk == 0 (Assuming 0 is 'Non-Plant'), reject
        if pred_gk.item() == 0 or conf_gk.item() < 0.70:
            return Response({
                'label': 'Invalid Input',
                'diagnosis_report': 'Score: 0% | Cause: Non-plant image detected. | Treatment: Please scan a valid plant leaf. | Prognosis: N/A | Next Step: Retry with clear focus. | Healthy_Img: generic_healthy.jpg'
            })

        # Stage 2: Diagnostic Prediction
        with torch.no_grad():
            diag_out = diagnostic_model(img_t)
            conf, pred = torch.max(F.softmax(diag_out, dim=1), 1)
        
        label = CLASS_LABELS[pred.item()]
        confidence = round(conf.item() * 100, 2)

        # Generate Visual Explainability
        heatmap_url = generate_visual_proof(diagnostic_model, img_t, pred.item(), full_path)
        
        # Generate Structured Recommendation
        detailed_rec = get_detailed_recommendation(label, confidence)

        # Save to Database
        scan = ScanResult.objects.create(
            user=request.user,
            plant_name=label,
            recommendation=detailed_rec,
            image=path,
            heatmap=heatmap_url,
            location=request.data.get('location', 'Sankarnagar'),
            farm_type=request.data.get('farmType', 'Home Garden'),
            status="Completed"
        )

        return Response({
            'label': label,
            'confidence': confidence,
            'original_url': scan.image.url,
            'heatmap': scan.heatmap.url,
            'diagnosis_report': detailed_rec
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)

# ---------------------------------------------------------
# 5. AUTH & ANALYTICS
# ---------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if User.objects.filter(username=username).exists():
        return Response({'error': 'User exists'}, status=400)
    User.objects.create_user(username=username, password=password)
    return Response({'message': 'Registration successful'}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token), 
            'user_id': user.id, 
            'username': user.username
        })
    return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_scan_history(request):
    try:
        history = ScanResult.objects.filter(user=request.user).order_by('-created_at')
        return Response([{
            'id': h.id,
            'plant_name': h.plant_name, 
            'recommendation': h.recommendation, 
            'date': h.created_at.strftime("%B %d, %Y"),
            'original_url': h.image.url if h.image else None,
            'heatmap': h.heatmap.url if h.heatmap else None
        } for h in history])
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admin_metrics(request):
    total_scans = ScanResult.objects.count()
    total_users = User.objects.count()
    user_scans = ScanResult.objects.filter(user=request.user).count()
    
    healthy_count = ScanResult.objects.filter(plant_name__icontains="healthy").count()
    healthy_ratio = round((healthy_count / total_scans * 100), 1) if total_scans > 0 else 0

    return Response({
        'total_scans': total_scans,
        'total_users': total_users,
        'user_scans': user_scans,
        'healthy_ratio': f"{healthy_ratio}%",
        'server_time': timezone.now().strftime("%I:%M %p")
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_scan(request, scan_id):
    try:
        scan = ScanResult.objects.get(id=scan_id, user=request.user)
        scan.delete()
        return Response({'message': 'Record deleted successfully'}, status=200)
    except ScanResult.DoesNotExist:
        return Response({'error': 'Record not found'}, status=404)