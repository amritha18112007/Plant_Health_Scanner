from django.db import models
from django.contrib.auth.models import User

class ScanResult(models.Model):
    # Connects the scan to the user who uploaded it
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    
    # Stores the AI prediction (e.g., "Tomato Septoria leaf spot")
    plant_name = models.CharField(max_length=100) 
    
    # Stores the treatment advice (Treatment | Prognosis | Next Step)
    recommendation = models.TextField(null=True, blank=True)
    
    # NEW: Store the actual images
    image = models.ImageField(upload_to='scans/', null=True, blank=True)
    heatmap = models.ImageField(upload_to='heatmaps/', null=True, blank=True)
    
    # NEW: Store the user's context from registration
    location = models.CharField(max_length=255, default="Sankarnagar")
    farm_type = models.CharField(max_length=255, default="Home Garden")
    
    # Status and timestamps
    status = models.CharField(max_length=50, default="Completed")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plant_name} ({self.created_at})"