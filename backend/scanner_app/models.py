# backend/scanner_app/models.py
from django.db import models
from django.contrib.auth.models import User # Use Django's built-in User model for AUTHENTICATION [cite: 138-140]

# Maps to the LEAF_SCAN table [cite: 142-144]
class LeafScan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # Links to a User
    image = models.ImageField(upload_to='scans/') # Stores the image file
    timestamp = models.DateTimeField(auto_now_add=True)

# Maps to the RESULT table [cite: 147-149]
class ScanResult(models.Model):
    scan = models.OneToOneField(LeafScan, on_delete=models.CASCADE)
    status_choices = [
        ('Healthy', 'Healthy'),
        ('Disease', 'Affected by Disease'),
        ('Deficiency', 'Nutrient Deficiency'),
    ]
    status = models.CharField(max_length=20, choices=status_choices)
    deficiency_type = models.CharField(max_length=100, blank=True, null=True)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2) # e.g., 99.50%

# Maps to the RECOMMENDATION table [cite: 152-154]
class Recommendation(models.Model):
    result = models.OneToOneField(ScanResult, on_delete=models.CASCADE)
    solution = models.TextField()
    treatment = models.TextField()
    tips = models.TextField()

# Note: We can use the existing models for HISTORY table [cite: 155-156] by querying the User, LeafScan, and Recommendation tables.