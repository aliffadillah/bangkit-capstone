# PROFILE API SPEC

## Post Profile

Endpoint : POST /api/profile?username={username}

## Request Parameters:

username: The username of the profile to be created.

## Headers:
authorization: JWT token to verify the user's identity.

Request Body :
```json
{
  "age" : 19,
  "gender" : "Laki-Laki",
  "height": "173",
  "weight": "60"
}
```

Response Body (Success/200) :

```json
{
  
  "data" : {
    "age" : 19,
    "gender" : "Laki-Laki",
    "height": "173",
    "weight": "60",
    "username": "alifmuhammad",
    "kcal": "1,622",
    "bmi": 20 // Formula: Weight (kg) / (Height (cm) / 100)^2
  }
}

```
Response Body (Failed): 

```json
{
  "errors" : "Username already registered"
}

```

## Get Profile

Endpoint : GET /api/profile?username={username}


## Request Parameters:

username: The username of the profile to retrieve.

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

Endpoint : PATCH /api/profile?username={username}

## Headers :
- authorization: token

Request Body  :

```json
{
  "age" : 21,
  "gender" : "Non-Binary",
  "height": "173",
  "weight": "60"
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
    "bmi": 20 // Formula: Weight (kg) / (Height (cm) / 100)^2
  }
}
```
Response Body (Failed):

```json
{
  "errors" : "Data tidak ditemukan"
}
```
