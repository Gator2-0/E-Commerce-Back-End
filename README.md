# E-Commerce-Back-End

## Description

This project represent a bsack-end for a E-commerce company. 

## Table of Contents (Optional)

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Installation](#installation)
- [Usage](#usage)

## Installation

For this app to work you will need to install [mysql](https://coding-boot-camp.github.io/full-stack/mysql/mysql-installation-guide)


first install all npm using 
  ```
  npm i
  ```

Then create the database by opening the mysql terminal
```mysql
mysql -u <USSERNAME> -p
```
type your password when prompted and then type the 2 follwoing commands
```
source ./db/schema.sql;
quit
```
Then seed the database
```
node ./seeds/index.js
```

Once that has been done you can start the server
```
node server.js
```

## Usage

Using Insomnia you can call in the different endpoints of the API.
For the post and put request, follow the structure in the comment of the code.

