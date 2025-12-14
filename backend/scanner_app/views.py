# backend/scanner_app/views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count # Needed for Admin Metrics

from .models import LeafScan, ScanResult, Recommendation
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout # For Auth APIs

import json # To handle incoming JSON data
import random # To generate mock confidence scores
# --- Authentication Views (Mocked for simplicity) ---

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Username or Email already exists'}, status=400)

        # Create the user [cite: 137]
        User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({'message': 'User registered successfully'}, status=201)
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # Authenticate user [cite: 141]
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Optionally use Django's session login
            login(request, user)
            return JsonResponse({'message': 'Login successful', 'user_id': user.id}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

# --- End of Authentication Views ---
# --- Scan and Analysis Views ---

def generate_mock_ml_result():
    # Simulate the CNN prediction [cite: 106-107, 206]
    issues = {
        'Healthy': {'status': 'Healthy', 'type': None, 'remedy': 'Keep up the good work!'},
        'Nitrogen Deficiency': {'status': 'Deficiency', 'type': 'Nitrogen', 'remedy': 'Suggest nitrogen-rich fertilizer or compost.'},
        'Rust Disease': {'status': 'Disease', 'type': 'Rust', 'remedy': 'Apply organic fungicide or remove affected leaves.'},
    }
    
    # Randomly select a result for testing
    result_key = random.choice(list(issues.keys()))
    result_data = issues[result_key]
    
    # Generate mock data for the ScanResult
    mock_result = {
        'status': result_data['status'], # Healthy / Disease / Deficiency [cite: 149]
        'deficiency_type': result_data['type'],
        'confidence_score': round(random.uniform(70.0, 99.9), 2), # Mock confidence [cite: 149]
        'recommendation': result_data['remedy'] # Mock remedy [cite: 153]
    }
    return mock_result

@csrf_exempt
def handle_scan_upload(request):
    if request.method == 'POST':
        # NOTE: In a real app, you would verify the user ID is logged in.
        # For testing, we'll assume a user ID is passed.
        user_id = request.POST.get('user_id', 1)  # Default to User ID 1 for testing
        image_file = request.FILES.get('image') # The uploaded file

        if not image_file:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.objects.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        # 1. Save the scan entry [cite: 143]
        scan = LeafScan.objects.create(user=user, image=image_file)
        
        # 2. Simulate ML Analysis and get mock result [cite: 145-146]
        mock_data = generate_mock_ml_result()
        
        # 3. Save the result
        result = ScanResult.objects.create(
            scan=scan,
            status=mock_data['status'],
            deficiency_type=mock_data['deficiency_type'],
            confidence_score=mock_data['confidence_score']
        )
        
        # 4. Generate and save recommendation [cite: 152-154]
        Recommendation.objects.create(
            result=result,
            solution=mock_data['recommendation'],
            treatment="Placeholder treatment steps...",
            tips="Placeholder preventive tips..."
        )

        # Return the final result to the user
        return JsonResponse({
            'scan_id': scan.id,
            'status': mock_data['status'],
            'type': mock_data['deficiency_type'],
            'confidence': mock_data['confidence_score'],
            'recommendation': mock_data['recommendation']
        }, status=200)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
# --- History View ---

# backend/scanner_app/views.py

# ... (Imports: from .models import LeafScan, ScanResult, Recommendation)
# ... (Other view functions)

# --- User History View ---

@csrf_exempt
def get_scan_history(request):
    if request.method == 'GET':
        try:
            # 1. Get the user_id from the URL query parameters
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'User ID is required.'}, status=400)

            # 2. Filter scans belonging to that user, ordered by date
            # Note: We link LeafScan (the scan entry) to its associated ScanResult
            history_scans = LeafScan.objects.filter(user_id=user_id).order_by('-timestamp')
            
            history_list = []
            for scan in history_scans:
                # Assuming one LeafScan leads to one ScanResult
                try:
                    result = ScanResult.objects.get(scan=scan) 
                    recommendation = Recommendation.objects.get(result=result) 

                    history_list.append({
                        'id': scan.id,
                        'date': scan.timestamp.strftime('%Y-%m-%d %H:%M'), # Formatting the date
                        'status': result.status,
                        'type': result.deficiency_type, # This must match your model field name
                        'confidence': result.confidence_score, # This must match your model field name
                        'recommendation_summary': recommendation.solution, # This must match your model field name
                    })
                except ScanResult.DoesNotExist:
                    # Handle scans without results gracefully
                    history_list.append({
                        'id': scan.id,
                        'date': scan.timestamp.strftime('%Y-%m-%d %H:%M'),
                        'status': 'Pending',
                        'type': 'N/A',
                        'confidence': 0.0,
                        'recommendation_summary': 'Analysis pending.',
                    })

            return JsonResponse({'history': history_list}, status=200)

        except Exception as e:
            # IMPORTANT: Log the error to the console for real debugging
            print(f"Error fetching scan history: {e}")
            return JsonResponse({'error': f'Internal Server Error: {e}'}, status=500)

    return JsonResponse({'error': 'Only GET method allowed'}, status=405)

# --- Admin Views ---

def get_admin_metrics(request):
    # Calculate Total Users
    total_users = User.objects.count() 
    
    # Calculate Total Scans Conducted
    scans_conducted = LeafScan.objects.count()
    
    # Calculate Most Common Diseases/Deficiencies detected [cite: 28]
    common_issues = ScanResult.objects.filter(status__in=['Disease', 'Deficiency']) \
        .values('deficiency_type') \
        .annotate(count=Count('deficiency_type')) \
        .order_by('-count')[:5] # Top 5 issues

    metrics = {
        'total_users': total_users,
        'scans_conducted': scans_conducted,
        'common_issues': list(common_issues),
    }

    # You can add user activity logs here as well (from another source, if available) [cite: 29-30]

    return JsonResponse(metrics, status=200)