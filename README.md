# Purpose and Features

This is the start of a home automation App.
It is being built to teach and secure my understanding of:
<li>Integrating a MySQL DB
<li>Handling image uploads to a server
<li>Promises using Bluebird

It will have clients running on Raspberry Pi Zeros that will communicate to a Node.js server.

## Door Bell Camera
The first aspect is a door bell operated camera. This works like so:
<ol>
	<li>The door bell is pressed
	<li>An image is taken from the Raspberry Pi
	<li>The image is uploaded to to the Node.js server
	<li>The actual image is stored in Cloudinary
	<li>The image URL is stored in the MySQL DB
</ol>

<br>

#Getting Started
The app uses a service called Cloudinary for image and video handling. To allow this to work you will have to set up a free account and define some environment variables when executing. These consist of:
<li>cloud_name
<li>api_key
<li>api_secret