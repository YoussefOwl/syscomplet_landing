@ECHO OFF
cd ./api
start php artisan serve

@REM cd ./webSocketServer
@REM start nodemon server.js

cd ../
cd ./bo
start ng s

"C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:4200/accueil"
"C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:8000"
cd ..
cls

@REM cls && ng build --configuration production --aot --base-href /demo/ && echo %date% %time%