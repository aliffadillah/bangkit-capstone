# FOOD API SPEC

### POST FOOD Ml

Endpoint : POST /api/ocr-food/

Request Body: :

```json
{
  "calories": "2000",
  "sugar": "20",
  "fats": "10",
  "salt": "10",
  "date_added": "DateTime"
}
```
Response Body (Success/200) :

```json
{
  "message": "Food item added successfully.",
}
```
Response Body (Failed):

```json
{
  "errors" : "Data tidak ditemukan"
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



