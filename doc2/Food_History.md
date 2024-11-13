# Track Food in History API SPEC

### POST FOOD

Endpoint : GET /api/history/{food_id}?username={username}

### Headers:

authorization: Authorization: Bearer <JWT_TOKEN>

Request Body: :

```json
{
  "date": "2024-11-13T14:30:00Z"
}
```
Response Body (Success/200) :

```json
{
  "foods": [
    {
      "food_id": "01",
      "nama": "teh pucuk",
      "category": "minuman",
      "grade": "A",
      "date": "2024-11-13T14:30:00Z"
    },
    {
      "food_id": "02",
      "nama": "nasi goreng",
      "category": "makanan utama",
      "grade": "B",
      "date": "2024-11-13T14:30:00Z"
    },
    {
      "food_id": "03",
      "nama": "roti bakar",
      "category": "snack",
      "grade": "C",
      "date": "2024-11-13T14:30:00Z"
    }
  ]
}

```
