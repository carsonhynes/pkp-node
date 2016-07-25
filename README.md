# Steps for further development

* Install NodeJS and npm
 * See <a href='https://nodejs.org/'>nodejs.org</a> for installation instructions
* In your terminal, change directory to project root folder
 * e.g. `cd /var/www/html/PKP-node`
* Install the required node packages by running `npm install` This command will automatically install any packages listed in package.json
* Install any global packages using `npm install <package-name> -g`
* Set up MongoDB
 * See <a href='https://www.mongodb.com/'>mongodb.com</a> for installation instructions
* Populate MongoDB with the brothers database
 * Ensure mongod is running (just run `mongod` from the command line) before issuing the following command:
 * `mongorestore /path-to-mongodb-backup-file`
* **READ THE GUIDE BELOW!!**

# Folder organization

<h4>/bin</h4>
This directory contains a single javascript file, `www`. When a node app is set up with <a href='http://expressjs.com/'>ExpressJS</a>, this file is automatically generated. You should not have to edit this file as it simply acts as a wrapper for `app.js`.


<h4>/custom_modules</h4>
This directory contains two files, `db.js` and `hbs.js`.

`db.js` is a mongodb connection script I wrote which allows for <a href='http://blog.mlab.com/2013/11/deep-dive-into-connection-pooling/'>connection pooling</a> and adds a few custom functions for accessing the brothers database. You should always `require` this script as opposed to connecting to the database directly from your files.

`hbs.js` is a similar script which adds multiple functions to the <a href='http://handlebarsjs.com/'>Handlebars</a> template engine such as case-changing, basic math functions and converting the positions as they are stored in the database to their displayed values (e.g. ass-rush to Assistant Rush Chair).


<h4>/etc</h4>

This directory contains a sample <a href='https://www.nginx.com/resources/wiki/'>Nginx</a> configuration file for hosting the website on a deployed server. It is currently configured to redirect any requests coming in at http://pikappcastle.org or http://pikappcastle.org/news to ports 3000 (Node's default) and 2368 (<a href='https://ghost.org/'>Ghost</a>'s default) on the server, respectively.


<h4>/public</h4>

This directory hosts all of the static files for the website. This includes images, client-side javascript files (e.g. Bootstrap, jQuery) and CSS files. You should NOT edit files inside the javascripts or css directories directly. Instead, you should work in the javascripts-tbc and sass directories. When the site is deployed, the contents of these directories will be compiled into minified javascript and CSS files, respectively. This will overwrite any changes made to the javascripts and css directories.

NOTE: The site will always look in `/public/images/current-composites` for the content displayed on the brothers page. All you have to do is populate this directory with images using the naming scheme `firstname_lastname.jpg` (all lowercase). The `firstname` and `lastname` variables are pulled directly from the database so be sure to match the names exactly to their associated database values.

NOTE2: The site will look in `/public/images/footer` for the circular images displayed in the footer of each page. You do not have to make them circular as this is done client-side using CSS. You should try to create images about 200x200 pixels in size for the best results. These should be friendly pictures pulled from a source such as Facebook rather than the composite photos if possible. Note that the naming scheme here is `lastname_circle.png` (all lowercase). Again, this value is pulled directly from the database based on the current Archon, Vice-Archon and Alumni Secretary so you should match the spelling of their respective names exactly.


<h4>/routes</h4>

This directory contains the routing files for NodeJS. These files are assigned in `app.js` statements like `var routes = require('./routes/index');` and `app.use('/', routes);` (for `/routes/index.js`). In this instance, the two aforementioned lines mean that all traffic coming to the Node server at the root directory (in this case http://pikappcastle.org/) will be handled by `index.js`. `index.js` will then render the page for the user after inserting data from the database for the footer elements.

It is recommended to create a different route for each subdirectory of your site. This means that every page in `/views` should have a route associated with it (with the exception of `layout.js` and `error.js`).


<h4>/views</h4>

The files contained in this directory are to-be-rendered handlebars pages. All of the file extensions are `.hbs`. These files are essentially just HTML with extra markup to allow for content to be "injected" while it's rendering, such as the current Archon for use in the footer. You can specify looping content as well, such as loading brothers' information from the database or creating a carousel of images from a specific folder. I won't go into too much detail here, as the <a href='http://handlebarsjs.com/'>Handlebars Website</a> covers what you can do in a much more elegant manner.

NOTE: `layout.hbs` is the "template" from which all other pages are currently built off of. Contained in this file is the navbar, the footer, and any global script includes (jQuery, Bootstrap, etc.). Be careful when making adjustments to this file as any changes made will cascade throughout the site. Unless it's absolutely imperative to **every** page, it should be placed in a separate `.hbs` file.


<h4>/.gitignore</h4>

This is simply a file which defines what should and should not be added to git. You should **NEVER** commit the node_modules folder. Firstly because it is very large and will quickly bog down future commits. Secondly because it goes against the Node ideals, which I will discuss in more detail in the `package.json` section.


<h4>/app.js</h4>

This is the heart of every Node application. This file contains all of the code which actually puts the other files to use. The top section of the code is `require` statements, which simply include node modules so that they can be used later on in this file. For most intents and purposes, you may assume this "required" code is much like a C++ include statement or a Python import.

The next section of code is the `use` statements. These statements tell Node what engines to use for middleware, or rather the part of the code which actually renders pages from static content. For example, the line `app.use('/', routes);` will direct all requests coming to the root site (pikappcastle.org) to `routes.js`, which then decides what to do with each request.

The next sections of code connect to the mongoDB database, set up 404 and 500 error handling, and start the <a href="https://ghost.org">Ghost</a> blogging platform (hosted at pikappcastle.org/news).


<h4>/gulpfile.js</h4>

This file serves as a directive for <a href="https://gulpjs.com">Gulp</a>. It basically defines functions which are then run whenever the developer runs `gulp <task-name>` from the command line at the root directory. Gulp should not be needed for production purposes. It is simply there to aid in the development process.

Some functions which I already created are `sass`, `compress`, `browser-sync`, and `nodemon`.

The first of these, `sass`, looks at all the `.scss` files in `/public/sass`, generates a minified CSS file from each, and places these new files in `/public/css`.

The second function, `compress`, does a similar minification on files in the `/public/javascripts-tbc` folder. These new files are placed in the `/public/javascripts` folder.

The third function, `browser-sync`, will start an instance of <a href="https://www.browsersync.io/">Browsersync</a>. Browsersync keeps your HTML and CSS in sync with your browser without the need to press refresh constantly. For example, if you change a color in the an SCSS file, Browsersync will recompile it into CSS and asynchronously push the update to your browser window. This is much more streamlined than having to compile the SCSS manually then refresh your browser window.

A similar function is `nodemon`. This will detect changes to the core files in your project and automatically restart the application whenever a change is made. This process, combined with Browsersync, allows the developer to focus on developing rather than tedious tasks such as minification and compilation.

You should also note that the `default` function can be run by simply running the command `gulp` from the root project directory. This should be the only function you need to run as the others are all chain-loaded from it.


<h4>/package.json</h4>

This file contains all of the dependencies and the metadata (name, author, etc.) for the project. When you run `npm install` from the command line in the project's root directory, it will look at the contents of this file and install the node modules necessary to run the project into the folder `/node_modules`.

NOTE: It is vitally important to install modules with the `--save` flag (`npm install <package-name> --save`). If you don't, the module won't be added to `package.json` and will be a missing dependency for someone else trying to develop this project. Part of Node's underlying principle is that every project is modular, and thus you shouldn't have any dependencies on your computer alone. By using `package.json`, you can distribute your project to anyone, running any OS, and they should be able to run it without problem by simply running `npm install` then `node /bin/www` from the command line.


<h4>/README.md</h4>

This file. If you've actually made it this far, congrats! If all you did was scroll to the bottom of this file to see how long it was, I'm ashamed of you. Scroll back up and actually read it. I guarantee you it was more tedious to write than it is to read.
