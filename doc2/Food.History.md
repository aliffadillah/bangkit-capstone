# Track Food in History API SPEC

### POST FOOD

Endpoint : GET /api/history/{food_id}?username={username}&date={date}

* food_id: ID unik dari makanan (wajib).
* username: Nama pengguna (wajib).
* date: Tanggal untuk riwayat makanan yang diminta dalam format YYYY-MM-DD (opsional). Jika tidak diberikan, data default akan ditampilkan untuk tanggal saat ini.

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
