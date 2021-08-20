## Register API

- method:[post]()
- url: [${apiUrl}/api/news/recent]()
- param:
  ```
  {
      "email":"example@google.com",
      "password":"password",
      "username":"username"
  }
  ```
- response
  ```
  {
      "success": false,
      "message": "email already exist"
  }
  ```
  or
  ```
  {
      "success": true
  }
  ```

## Login API

- method:[post]()
- url: [${apiUrl}/api/news/login]()
- param:
  `{ "email":"example@google.com", "password":"password" }`
- response
  ```
      {
              "success": true,
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGUxQGdvb2dsZS5jb20iLCJpYXQiOjE2MjQ2Nzc4MTIsImV4cCI6MTYyNDc2NDIxMn0.3PBphQMseXnFKZhXqIw_u1xWlOnprtXf-zYBJN8Dm58"
      }
  ```
  or
  ```
  {
          "success": false,
          "message": "email not exists"
  }
  ```
  or
  ```
  {
     "success": false,
     "message": "password mismatch"
  }
  ```

## Google Auth Login API

- method:[post]()
- url: [${apiURL}/api/user/googleAuth]()
- param:
  ```
  {
      token: googleData.tokenId
  }
  ```
- response
  ```
   {
           "success": false,
           "message": "email not exists"
   }
  ```
  or
  ```
  {
          "success": true,
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGUxQGdvb2dsZS5jb20iLCJpYXQiOjE2MjQ2Nzc4MTIsImV4cCI6MTYyNDc2NDIxMn0.3PBphQMseXnFKZhXqIw_u1xWlOnprtXf-zYBJN8Dm58"
  }
  ```

## Get Recent News API

- method:[post]()
- url: [${apiUrl}/api/news/recent]()
- response
  ```
  {
      "success": true,
      "news": [
          {
              "id": 9,
              "name": "game service closed",
              "thumbnail": "/uploads/news3.png",
              "created_at": "2021-06-26T03:03:34.878Z",
              "updated_at": "2021-06-26T03:03:34.878Z"
          },
          {
                         "id": 10,
                         "name": "game new published",
                         "thumbnail": "/uploads/news3.png",
                         "created_at": "2021-06-26T03:03:34.878Z",
                         "updated_at": "2021-06-26T03:03:34.878Z"
          }
      ]
  }
  ```

## Get All News API

- method:[post]()
- url: [${apiUrl}/api/news/all]()
- response
  ```
  {
     "success": true,
     "news": [
         {
             "id": 9,
             "name": "game service closed",
             "thumbnail": "/uploads/news3.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 10,
             "name": "new game added",
             "thumbnail": "/uploads/news1.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 11,
             "name": "dota v2.0 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 12,
             "name": "dota v2.1 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 13,
             "name": "dota v2.2 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 14,
             "name": "dota v2.3 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 15,
             "name": "dota v2.4 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 16,
             "name": "dota v2.5 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 17,
             "name": "dota v2.6 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 18,
             "name": "dota v2.7 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 19,
             "name": "dota v2.8 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 20,
             "name": "dota v2.9 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 21,
             "name": "dota v2.10.0 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 22,
             "name": "dota v2.10.1 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 23,
             "name": "dota v2.11.0 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         },
         {
             "id": 24,
             "name": "dota v2.11.2 updated",
             "thumbnail": "/uploads/news2.png",
             "created_at": "2021-06-26T03:03:34.878Z",
             "updated_at": "2021-06-26T03:03:34.878Z"
         }
     ]
  }
  ```

## Get News API

- method:[post]()
- url: [${apiUrl}/api/news]()
- param: `{id:14}`
- response
  ```
  {
      "success": true,
      "news": {
          "id": 14,
          "name": "dota v2.3 updated",
          "thumbnail": "/uploads/news2.png",
          "created_at": "2021-06-26T03:03:34.878Z",
          "updated_at": "2021-06-26T03:03:34.878Z"
      }
  }
  ```
