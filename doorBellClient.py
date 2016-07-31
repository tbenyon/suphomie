import requests
import base64
from picamera import PiCamera
from time import sleep
import os
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)
camera = PiCamera()
	
def takeNewImage():
	try:
		os.remove('/home/pi/image.jpg')
	except:
		print("No image to remove")

	camera.start_preview()
	sleep(1)

	camera.capture('/home/pi/image.jpg')
	camera.stop_preview()
	
def uploadImage():
	try:
		with open('/home/pi/image.jpg', "rb") as imageFile:
			base64Image = base64.b64encode(imageFile.read())
		response = requests.post(os.environ['API_URL'], data={"image": base64Image})

		print ("The response...")
		print (response)
		
	except:
		print("Failed to upload image.")

print('Starting door camera system.')
while True:
    input_state = GPIO.input(18)
    if input_state == False:
        print('Matt Triggered')
        takeNewImage()
        uploadImage()
        sleep(10)
