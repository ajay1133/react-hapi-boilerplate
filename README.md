## Fan Engagement

### Local Environment Setup
* Use Node Version: 10.x.x

* Clone Project: git clone https://github.com/ajay1133/shareCabs.git

* Install Node Packages: npm install

* Copy src/config_bak.js => src/config.js

* Copy config/db_bak.js => config/db.js

* Create MySQL Database:  <your_db_name>

* Change in db file

* Run Migrations:  sequelize db:migrate

* Create Admin User: sequelize db:seed:all

* Run Client App: npm start   

* Run API: npm run dev-api

* Swagger API: http://localhost:5000/documentation

* Admin User Details: admin@simsaw.com/admin123


#### Development process for new tasks:

* Create task specific branch from staging always. For example: git checkout -b FAN-<TASKNO>

* Send Pull Request to staging branch.

* Pull Staging before sending pull request

* Always pull from staging when you start your work



