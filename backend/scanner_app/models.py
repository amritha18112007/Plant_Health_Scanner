from django.db import models
from django.contrib.auth.models import User

class LeafScan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='scans/')
    timestamp = models.DateTimeField(auto_now_add=True)

class ScanResult(models.Model):
    scan = models.ForeignKey(LeafScan, on_delete=models.CASCADE)
    deficiency_type = models.CharField(max_length=255)
    confidence_score = models.FloatField()
    # This is the simple text summary
    recommendation = models.TextField() 

class Recommendation(models.Model):
    # FIX: Add related_name='detailed_recommendation' to stop the name clash
    result = models.OneToOneField(
        ScanResult, 
        on_delete=models.CASCADE, 
        related_name='detailed_recommendation'
    )
    solution = models.TextField()
    treatment = models.TextField()
    tips = models.TextField()