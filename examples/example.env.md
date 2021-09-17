# .env Sample

The `.env` file is used to initialize all enviroment variables in the development evironment. A popular solution to how you can organize and maintain your environment variables is to use a `.env` file. It makes it super easy to have one place where we can quickly read and modify them.

Create the `.env` file in the root of your app and add your variables and values to it. These are all the variables that are needed by WhatsBot. Description about these can be found in [app.json](./app.json).

```env
SESSION = ""
PMPERMIT_ENABLED = ""
MONGODB_URL = ""
YT_DATA_API_KEY = ""
DEFAULT_TR_LANG = ""
ENABLE_DELETE_ALERT = ""
OCR_SPACE_API_KEY = ""
INFOSPACE_API_KEY = ""
```

It is not mandatory to add all the variables in the `.env` file. Most of these have a default fallback value mentioned in [config.js](./config.js) in case it's not initialized in the dev environment.

At the bare minimum, you need to initialize atleast the following variables to make it work in your local environment.

```env
SESSION = ""
MONGODB_URL = ""
YT_DATA_API_KEY = ""
OCR_SPACE_API_KEY = ""
INFOSPACE_API_KEY = ""
```

- SESSION : Puppeteer Session. Get it by running genToken.js. As getToken.js creates a session.json file, this might not be necessary in a local environment as this variable has a fallback to the session.json file. It is mentioned here as it is the most inportant information needed by the bot to work.

- YT_DATA_API_KEY : Youtube DATA API key, grab it from <https:/>/cloud.google.com>.

- OCR_SPACE_API_KEY : Get it from <https://ocr.space/OCRAPI>.

- INFOSPACE_API_KEY : Get it from <https://infospace.club>.

- MONGODB_URL : Get it for free from cloud.mongodb.com. For a local mongodb instance in your system, this would be something like `mongodb://localhost:MONGO_PORT`. If you're using the default port then the url would be `mongodb://localhost:27017`.
