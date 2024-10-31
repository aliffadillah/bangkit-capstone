# USER API SPEC

## Register User

Endpoint : POST /api/users

Request Body :
```json
{
  "username" : "alifmuhammad",
  "password" : "password",
  "name" : "Muhammad Alif Fadillah"
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
  "password" : "password", 
  "name" : "Muhammad Alif Fadillah" 
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

Response Body (Success/200) :

```json
{
  "data" : true
}
```

