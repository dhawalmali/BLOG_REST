# BLOG_REST
A REST API for blog app with real-time features implemented using sockets in nodejs.

Steps for using:

1.npm install 
2.npm start ##starts server on port 8080

REST documentation for Auth:

Signup:

endpoint: POST /auth/signup

request payload:

{
  "email" : <valid_email>,
  "name":  <username>,
  "password": <min_length_5>
 }
 
 response:
 
 code: 201
 {
  "message" "User_created",
  "userId": <created UserId>
 }
 
 
 Login:
 
 endpoint:  POST /auth/login
 
 request payload:
 
 {
  "email" : <valid_email>,
  "password": <min_length_5>
 }
 response:
 
 code: 200
 {
  "token": <JWT_Token expiring in 1 hour>
  "userId": <userId>
 }
 
 JWT token should be sent for validation of user with each subsequent request in the following format:
 
 In request headers
 
 {
  "Authorization": `Bearer ${jwt_token}`
 }
 
 
 




