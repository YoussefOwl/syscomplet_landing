@ECHO OFF
cd ./api
start php artisan serve

@REM cd ./webSocketServer
@REM start nodemon server.js

cd ../
cd ./bo
start ng s

"C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:4200/accueil"
cd ..
cls