[![Build Status](https://app.snap-ci.com/tbenyon/suphomie/branch/master/build_image)](https://app.snap-ci.com/tbenyon/suphomie/branch/master)
# Sup Homie

This is the start of a home automation service.
It is built as multiple apps including:
- A main API (this app)
- A front end interface
- An app to monitor the front door
- An app to update and edit the Central Heating timing system
- An app to replace the home thermostat

## Central Heating
This will be controlled from the front end app but will allow for a boost button which is a feature my home is currently missing.

## Door Bell Camera
The first aspect is a door bell operated camera. This works like so:
<ol>
	<li>The pressure matt at the front door is pressed
	<li>An image is taken from the Raspberry Pi
	<li>The image is uploaded to to the Node.js server
	<li>The actual image is stored in Cloudinary
	<li>The image URL is stored in the MySQL DB
</ol>

<br>

#Getting Started
The app uses a service called Cloudinary for image and video handling. To allow this to work you will have to set up a free account and define some environment variables when executing. These consist of:
- cloud_name
- api_key
- api_secret

#Testing
To be able to run the python test scripts python 3 will need installing.

the following two packages will need to be installed.
- cloudinary
- requests

`python3 -m pip install <package>`

Ensure that the test python file is executed as `python3` not just `python`.