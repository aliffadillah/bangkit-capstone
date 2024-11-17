# Dokumentasi Respons Gagal API

# Struktur Respons Gagal API

````json
{
  "status": "error",
  "code": [HTTP Status Code],
  "message": "[Pesan Error]",
  "details": "[Informasi Tambahan, jika ada]"
}
````
400 Bad Request
````json
{
  "status": "error",
  "code": 400,
  "message": "Invalid request data",
  "details": "The 'email' field must be a valid email address."
}
````
401 Unauthorized
````json
{
  "status": "error",
  "code": 401,
  "message": "Authentication required",
  "details": "A valid authentication token must be provided."
}

````
403 Unauthorized
````json
{
  "status": "error",
  "code": 403,
  "message": "Access denied",
  "details": "You do not have permission to access this resource."
}

````
404 Unauthorized
````json
{
  "status": "error",
  "code": 404,
  "message": "Resource not found",
  "details": "The requested resource could not be found on this server."
}
````
405 Unauthorized
````json
{
  "status": "error",
  "code": 405,
  "message": "Invalid request method",
  "details": "The POST method is not allowed on this endpoint."
}

````
500 Unauthorized
````json
{
  "status": "error",
  "code": 500,
  "message": "Server error",
  "details": "An unexpected error occurred on the server. Please try again later."
}
````
502 Unauthorized
````json
{
  "status": "error",
  "code": 502,
  "message": "Gateway error",
  "details": "The server received an invalid response from the upstream server."
}

````
503 Unauthorized
````json
{
  "status": "error",
  "code": 503,
  "message": "Server temporarily unavailable",
  "details": "The server is temporarily unavailable due to maintenance. Please try again later."
}


````
504 Unauthorized
````json
{
  "status": "error",
  "code": 504,
  "message": "Gateway timeout",
  "details": "The request to the upstream server timed out. Please try again later."
}
````