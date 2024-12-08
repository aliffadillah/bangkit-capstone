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
    "advice": "Asupan kalori Anda sangat tinggi selama seminggu terakhir (2800 kalori). Kurangi konsumsi makanan berkalori tinggi dan tingkatkan aktivitas fisik."
  }
}


```
### GET CALORIES WEEKLY

Endpoint : GET /api/dashboard/username/weekly-calories


Respone Body: :



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


### GET CALORIE : saran calorie untuk hari besok

Endpoint : /api/calorie-prediction/:username
```json
{
  "data": {
    "calories": 293
  }
}
```