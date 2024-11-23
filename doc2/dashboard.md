# Dashboard API SPEC

### GET FOOD

Endpoint : GET /api/dashboard/username&date

### Headers:

authorization: Authorization: Bearer <JWT_TOKEN>

Respone Body: :

```json
{
  "data": {
    "progress": {
      "percentage": 91,
      "date": "2023-10-12",
      "calories": {
        "current": 1350,
        "goal": 1600
      }
    },
    "nutrients": {
      "sugar": "20",
      "fat": "11",
      "salt": "7"
    },
    "bmi": "26.1",
    "advice": "Seimbangkan asupan dengan menambah serat, vitamin, dan mineral dari sayuran, buah, dan biji-bijian. Kurangi lemak jika berasal dari makanan olahan atau gorengan, dan ganti dengan lemak sehat."
  }
}


```