# Dashboard API SPEC

### GET DASHBOARD

Endpoint : GET /api/dashboard/username?date={date}

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
### GET CALORIES WEEKLY

Endpoint : GET /api/dashboard/username/weekly-calories

### Headers:

authorization: Authorization: Bearer <JWT_TOKEN>

Respone Body: :

calories: Total calories consumed for each of the past 7 days.
sugar: Amount of sugar consumed (in grams) for each day.
fat: Total fat consumed (in grams) for each day.
salt: Total salt consumed (in grams) for each day.

```json
{
  "data": {
    "calories": [293, 230, 242, 188, 187, 264, 199],
    "sugar": [10, 20, 15, 18, 17, 16, 19],
    "fat": [5, 10, 7, 9, 8, 6, 11],
    "salt": [1, 2, 1.5, 1.8, 1.7, 1.6, 1.9]
  }
}
```