# Use the official Python image as a base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
  gcc \
  g++ \
  make \
  cmake \
  libboost-all-dev \
  libmarisa-dev

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

RUN huggingface-cli login --token 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

# Copy the rest of the application code into the container at /app
COPY . /app/

# Expose port 5000 to the outside world
EXPOSE 5001

# Command to run the application
CMD ["python", "main.py"]

