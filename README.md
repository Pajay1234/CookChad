# CookChad
A website that combines the collaboration of social media and the aid of AI to make cooking cheaper and easier.

## Technologies 
- React
- NodeJS
- Express
- MongoDB
- Tailwind CSS

## Prerequisites
- Install Python3 from [the Python website.](https://www.python.org/) Be sure to include the PATH.
- Install pip from the [pip website](https://pypi.org/project/pip/) if needed. 
- Install NodeJS from [the NodeJS website.](https://nodejs.org/)
- You will need to setup your MongoDB database, and you will need the db username, password, and uri. It is recommended you use [MongoDB's](https://www.mongodb.com/) cloud service, and be sure to whitelist your IP in the database.
- You will need to fetch an API key from [OpenAI's](https://openai.com/) website.
- With pip, install the OpenAI Python library. 
```
pip install openai
```


## Installation and Setup
Clone the CookChad GitHub repository
```
git clone https://github.com/Pajay1234/CookChad.git
```

Setup the .env in the root folder according to the below specifications. 
```
NODE_ENV=development
PORT=5000

DB_USERNAME= 'YOUR USERNAME FOR THE DB GOES HERE'
DB_PASSWORD='YOUR PASSWORD FOR THE DB GOES HERE'
MONGO_URI='THE DATABASE URI GOES HERE'
JWT_SECRET = "CHOOSE A SECRET KEY"
GPT_KEY = "YOUR OPENAI API KEY GOES HERE"
```

### ONLY APPLIES TO MAC / LINUX USERS:
After cloning the repository, go into backend/controllers/PostController.js,
change line 12 to
```
const pythonProcess = spawn('python3', ['backend/scripts/child_process.py', caption, process.env.GPT_KEY]);
```

Then, change line 59 to 
```
const pythonProcess = spawn('python3', ['backend/scripts/adjusted_recipe.py', caption, process.env.GPT_KEY, value]);
```

## Run the Program
Start up the backend by going into the CookChad root directory running the following commands 
```
node backend/Server.js
```

Start up the frontend by going into the CookChad root directory running the following commands 
```
cd frontend 
npm start
```


