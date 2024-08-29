#! /bin/bash

if [ -d "public/uploads" ]
then
    echo "📁 public/uploads folder exists."
else
    mkdir -p public/uploads
    echo "✅ public/uploads folder created."
fi
