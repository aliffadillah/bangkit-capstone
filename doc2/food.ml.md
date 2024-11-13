# FOOD API SPEC

### POST FOOD Ml

Endpoint : POST /api/ocr-food/

Request Type: multipart/form-data

Request Body:
Image file (JPG): The image file containing the nutrition information, sent as file in multipart/form-data.
Other Fields: Optional fields for manual input or additional data as needed.

Request Body: :

```json
{
  file: image.jpg
  "date_added": "DateTime"
}
```
Response Body (Success/200) :

```json
{
  "message": "Food item added successfully."
}
```
Response Body (Failed):

```json
{
  "errors": "Data not found or OCR failed."
}
```

### GET FOOD

Endpoint : GET /api/ocr-food/

Response Body (Success/200) :

```json
{
  "data": {
    "calories": "2000",
    "sugar": "20",
    "fats": "10",
    "date_added": "DateTime"
  }
}
```
Response Body (Failed):

```json
{
  "errors" : "Data tidak ditemukan"
}
```



