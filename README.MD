Music-Controller-Web-App-Tutorial
The code for Tech With Tim's "Django & React Full Stack Web App Tutorial" series.

Setup Instructions
Install Required Python Modules
pip install -r requirements.txt
Start Web Server
To start the web server you need to run the following sequence of commands.

First cd into your desired tutorial folder (replace x with tutorial number).

cd "Tutorial x"
Next run the django web server.

python manage.py runserver
Install Node.js
Install Node Modules
First cd into the frontend folder.

cd frontend
Next install all dependicies.

npm i
Compile the Front-End
Run the production compile script

npm run build
or for development:

npm run dev
