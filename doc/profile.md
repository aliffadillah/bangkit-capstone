# PROFILE API SPEC

## Post Profile

Endpoint : POST /api/profile

Request Body :
```json
{
  "age" : 19,
  "gender" : "Laki-Laki",
  "height": "173",
  "weight": "60",
  "username": "alifmuhammad"
}
```

Response Body (Success/200) :

```json
{
  "data" : {
    "age" : 20,
    "gender" : "Laki-Laki",
    "height": "173",
    "weight": "60",
    "username": "alifmuhammad",
    "kcal": "1,622",
    "bmi": 20 //KG : (Tinggi Badan (cm) : 100)^2
  }
}
```

[//]: # (Response Body &#40;Failed&#41; :)

[//]: # ()
[//]: # (```json)

[//]: # ({)

[//]: # (  "errors" : "Username already registered")

[//]: # (})

[//]: # (```)

## Get Profile

Endpoint : GET /api/profile/get

Request Body :
```json
{
  "user_id" : "1",
  "username" : "alifmuhammad"
}
```

Response Body (Success/200) :

```json
{
  "data" : {
    "age" : 20,
    "gender" : "Laki-Laki",
    "height": "173",
    "weight": "60",
    "username": "alifmuhammad",
    "kcal": "1,622", 
    "bmi": "20" KG : (Tinggi Badan (cm) : 100)^2
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Data tidak ditemukan"
}
```

## Update Profile

Endpoint : PATCH /api/profile/current

Headers :
- authorization: token

Request Body  :

```json
{
  "age" : 21,
  "gender" : "Non-Binary",
  "height": "173",
  "weight": "",
}
```

Response Body (200) :

```json
{
  "data" : {
    "age" : 21,
    "gender" : "Non-Binary",
    "height": "173",
    "weight": "60",
    "username": "alifmuhammad",
    "kcal": "1,752",
    "bmi": "20" // Berat Badan (KG) : (Tinggi Badan (cm) : 100)^2
  }
}
```

