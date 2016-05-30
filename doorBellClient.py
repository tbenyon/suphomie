import cloudinaryConfig
import cloudinary
import cloudinary.uploader
import cloudinary.api
import requests

cloudinary.config( 
  cloud_name = cloudinaryConfig.configData["cloud_name"],
  api_key = cloudinaryConfig.configData["api_key"],
  api_secret = cloudinaryConfig.configData["api_secret"]
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