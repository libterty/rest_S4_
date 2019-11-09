#~!/bin/bash

if git push heroku master && heroku run npx sequelize db:migrate then
  echo "Site exist.\nBuild passes.\n"
  exit 1
else
  echo "Site does not exist. \nBuild failed.\n"
  exit 0
fi
