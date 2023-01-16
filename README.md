# PhotoCaptionContest
## for Codecademy
In this project you will create the backend for a platform for users to participate in a photo caption contest.
Your server will host a few images and you will create endpoints to authenticate and authorize users.
In order for a user to create a caption, they will need to be authenticated (signed-in).
You will need a database design and schema in order to integrate a database layer to store all your users and captions.
You will use PostgreSQL and the ORM, sequelize to communicate between your database and your server.
As you create your endpoints you will be testing them on Postman to ensure that they work correctly.
Once the server is running, you will use a localized cache to optimize the performance of frequently requested data. 

Tasks:
- Plan Your Project
  - Visualize your end result. What is it built with? What can it do?
  - Make sure that it satisfies all of the project objectives.
  - Make a timeline for yourself and avoid the temptation to build things that aren’t required. 
  - Setting firm boundaries and deadlines will keep you on track and prevent scope creep.
- Configure sequelize and create your database
  - Create a .sequelizerc file in your project’s root folder and configure your database(DB) connections.
  - In your terminal, create a PostgreSQL database with a name of your choosing.
- Create your model(s)
  - Using the sequelize-cli package, create your model(s) for your database.
- Add images to your server
  - Add 4-6 images that will be captioned in your server.
- Run migrations
  - Now that the models have been created, use the sequelize db:migrate command to run migrations.
- Create endpoints for images and captions
  1. An endpoint to retrieve all images.
  2. An endpoint to retrieve an image by ID (this should include the images’ captions and other information).
  3. An endpoint to add captions to a specific image.
- Test your endpoints
- Create authentication endpoints
  - Use the library bcrypt and create registration, login, and logout endpoints.
- Add authorization middleware to specific endpoints
  - Only authorized users will be able to add captions to images.
  - Create middleware and add it to the appropriate endpoints in order for signed-in users to add captions to specific images.
- Test your authorization endpoints
- Configure localized caching
  - Add the node-cache package and create a localized cache for the images whenever they’re being retrieved.
- Write up documentation using Swagger
  - Using Swagger, create a documentation for your API. (Might use DBX Paper)
- Deploy your application with ~~Heroku~~ ??? lightsail?
- Next steps?