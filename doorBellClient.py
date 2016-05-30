import cloudinary
import cloudinary.uploader
import cloudinary.api
import requests

cloudinary.config( 
  cloud_name = "***REMOVED***", 
  api_key = "***REMOVED***", 
  api_secret = "***REMOVED***" 
)
userInput = ""
while userInput != "exit":
    try:
        imageUploadResult = cloudinary.uploader.upload("testImages/requests.png")

        imageData = {
            "public_id": imageUploadResult["public_id"],
            "version": imageUploadResult["version"],
            "width": imageUploadResult["width"],
            "height": imageUploadResult["height"],
            "format": imageUploadResult["format"],
            "bytes": imageUploadResult["bytes"],
            "url": imageUploadResult["url"],
            "secure_url": imageUploadResult["secure_url"]
            }

        response = requests.post('http://localhost:3000/addImageData', data = imageData)

        print (response)
    except:
        print("Failed to upload image.")

    userInput = input("Press enter to upload again or type exit to close the program.")
