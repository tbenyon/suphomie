#!/bin/bash
if [ "$server" == "API" ]; then
  node API_Server/app.js
else
  node Front_End_Server/app.js
fi