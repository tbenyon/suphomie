import cloudinary
import cloudinary.uploader
import cloudinary.api
import requests
import base64

userInput = ""
while userInput != "exit":
    try:
        with open("testImages/image.jpg", "rb") as imageFile:
            base64Image = base64.b64encode(imageFile.read())
        response = requests.post('http://localhost:3000/addImageData', data={"image": base64Image})

        print (response)
    except:
        print("Failed to upload image.")

    userInput = input("Press enter to upload again or type exit to close the program.")
