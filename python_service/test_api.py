import requests
import base64
import sys

def test_generate(base_url, prompt):
    print(f"Testing /generate with prompt: {prompt}")
    url = f"{base_url.rstrip('/')}/generate"
    try:
        response = requests.post(url, json={"prompt": prompt})
        if response.status_code == 200:
            print("Success! Received image.")
            # Save first 100 chars of base64 to verify
            print(f"Image Data Preview: {response.json()['image'][:100]}...")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to connect: {e}")

def test_tryon(base_url, prompt, image_url):
    print(f"Testing /tryon with prompt: {prompt}")
    url = f"{base_url.rstrip('/')}/tryon"
    try:
        response = requests.post(url, json={
            "prompt": prompt,
            "image": image_url
        })
        if response.status_code == 200:
            print("Success! Received try-on image.")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to connect: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_api.py <public_url>")
        sys.exit(1)
    
    BASE_URL = sys.argv[1]
    test_generate(BASE_URL, "A high-end fashion model wearing a silk dress")
    # Example URL for testing
    test_tryon(BASE_URL, "Red cotton t-shirt", "https://raw.githubusercontent.com/CompVis/stable-diffusion/main/assets/stable-samples/img2img/sketch-mountains-input.jpg")
