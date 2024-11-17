# USER API SPEC

## Register User

Endpoint : POST /api/users

Request Body :
```json
{
  "username": "alifmuhammad",
  "email": "alif@gmail.com",
  "password": "password",
  "repeat_password": "password",
}
```

Response Body (Success/200) :

```json
{
  "data" : {
    "username" : "alifmuhammad",
    "name": "Muhammad Alif Fadillah"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username already registered"
}
```
Response Body (Failed) jika username tidak di temukan:

```json
{
  "errors" : "Data tidak ditemukan"
}
```
Response Body (Failed) - Jika username sudah terdaftar:

```json
{
  "errors": "Username already registered"
}
```
Response Body (Failed) - Jika password dan repeat_password tidak cocok:
```json
{
  "errors": "Password and repeat password do not match"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :
```json
{
  "username" : "alifmuhammad",
  "password" : "password"
}
```

Response Body (Success/200) :

```json
{
  "data" : {
    "username" : "alifmuhammad",
    "name": "Muhammad Alif Fadillah",
    "token" : "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :
- authorization: token

Response Body (Success/200) :

```json
{
  "data" : {
    "username" : "alifmuhammad",
    "name": "Muhammad Alif Fadillah"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```

## Update User
Endpoint : PATCH /api/users/current

Headers:
- authorization: token

Request Body :
```json
{
  "name" : "Muhammad Alif Fadillah",
  "password" : "password"
}
```

Response Body (Success/200) :

```json
{
  "data" : {
    "username" : "alifmuhammad",
    "name": "Muhammad Alif Fadillah"
  }
}
```

## Logout User
Endpoint : DELETE /api/users/current

Headers:
- authorization: token

Response Body (Success/200) - Jika Logout Berhasil:

```json
{
  "message": "Logout berhasil. Anda telah keluar dari akun."
}
```
Response Body (Failed) - Jika Logout Gagal (misalnya karena token tidak valid atau sudah kadaluarsa):

```json
{
  "error": "Gagal logout. Token tidak valid atau sudah kadaluarsa."
}
```

