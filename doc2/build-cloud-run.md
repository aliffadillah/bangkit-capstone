### Login ke akun Google Cloud:
* gcloud auth login

### Set the Active Google Cloud Project
* gcloud config set project <PROJECT_ID>

### Build the Docker Image
* docker build -t gcr.io/<PROJECT_ID>/my-nest-app:latest .

### Authenticate Docker with GCR
* gcloud auth configure-docker

### Push the Image to GCR
* docker push gcr.io/<PROJECT_ID>/my-nest-app:latest

### Deploy the Service (linux)
* gcloud run deploy my-nest-app \
  --image gcr.io/<PROJECT_ID>/my-nest-app:latest \
  --platform managed \
  --region <REGION> \
  --allow-unauthenticated

### Deploy the Service (Windows)
* gcloud run deploy my-nest-app `
    --image gcr.io/<PROJECT_ID>/my-nest-app:latest `
    --platform managed `
    --region <REGION> `
    --allow-unauthenticated
