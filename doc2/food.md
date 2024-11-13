# FOOD API SPEC 

### POST FOOD 

Endpoint : POST /api/food/{food_id}?username={username}

### Headers:

authorization: Authorization: Bearer <JWT_TOKEN>

Request Body: :

```json
{
  "nama": "teh pucuk ",
  "category": "mie",
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

Endpoint : GET /api/food/{food_id}?username={username}

### Headers:

authorization: Authorization: Bearer <JWT_TOKEN>

Response Body (Success/200) :

```json
{
  "data": {
    "nama": "teh pucuk ",
    "category": "mie",
    "calories": "2000",
    "sugar": "20",
    "fats": "10",
    "grade" : "A",
    "category": "mie",
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

### Update Food Details

Endpoint : PATCH /api/food/{food_id}?username={username}

### Headers:

authorization: Authorization: Bearer <JWT_TOKEN>

Request Body::

```json
{
  "nama": "teh pucuk ",
  "category": "mie",
  "calories": "2000",
  "sugar": "20",
  "fats": "10",
  "salt": "20",
}
```
Response Body (Success/200) :

```json
{
  "message": "Food item updated successfully."
  "data": {
    "food_id": "1",
    "name": "niko",
    "calories": "2000",
    "sugar": "20",
    "fats": "10",
    "grade" : "A",
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

## Delete Food Item
Endpoint : DELETE /api/food/{food_id}?username={username}

### Headers:

authorization: Authorization: Bearer <JWT_TOKEN>

Response Body (Success/200) :

```json
{
  "message": "Food item deleted successfully."
}
```
Response Body (Failed):

```json
{
  "errors" : "Data tidak ditemukan"
}
```