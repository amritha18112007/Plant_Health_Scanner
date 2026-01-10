# D:\plant_health_scanner_project\backend\scanner_app\descriptions.py

DISEASE_KNOWLEDGE = {
    "Bacteria": {
        "desc": "Bacterial infections often appear as water-soaked spots, wilting, or 'ooze' on the leaves and stems.",
        "cure": "Remove infected parts immediately. Avoid overhead watering and use copper-based bactericides if necessary.",
        "goal": "Firm, dry stems and leaves without translucent or 'mushy' dark spots."
    },
    "Fungi": {
        "desc": "Fungal diseases are characterized by powdery coatings, fuzzy molds, or circular spots with distinct rings.",
        "cure": "Improve air circulation and apply organic fungicides like neem oil or sulfur-based sprays.",
        "goal": "Clean leaf surfaces free of white powder, gray fuzz, or dark velvety patches."
    },
    "Healthy": {
        "desc": "The plant shows no active signs of pathogen stress, nutrient deficiency, or pest damage.",
        "cure": "No treatment needed. Maintain consistent watering, proper sunlight, and seasonal mulching.",
        "goal": "This is the target state: vibrant green, sturdy foliage and optimal growth vigor."
    },
    "Pests": {
        "desc": "Visible damage such as holes, curled leaves, or sticky residue (honeydew) caused by insects like aphids or mites.",
        "cure": "Introduce beneficial insects (like ladybugs), use insecticidal soaps, or manually remove larger pests.",
        "goal": "Complete leaf margins with no bite marks, webbing, or yellow speckling from sap-sucking."
    },
    "Virus": {
        "desc": "Viral infections typically cause mosaic patterns (yellow/green streaks), stunted growth, or distorted leaf shapes.",
        "cure": "There is no chemical cure for plant viruses. Remove and destroy the infected plant to prevent spread via insects.",
        "goal": "Uniform green coloration and normal leaf expansion without crinkling or yellow mottling."
    }
}