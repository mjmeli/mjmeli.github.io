---
layout: post
title:  Deploying a Rails 5 + Vue.js 2 App to Heroku
date:   2017-09-11
author: Michael Meli
categories: deployment
tags: [ruby-on-rails, rails, vuejs, deployment, heroku, whodecidesfood]
---

After you've finished your Ruby on Rails application locally, you may think that the hard part of the process is over. However, the next big step of putting it online in a production deployment can be just as tricky, especially for a typical software developer without much experience in this space. Thankfully, Heroku provides a platform that significantly streamlines this process and allows developers to quickly get an application up-and-running online. This option is particularly great for hobby developers as they offer a free tier. While there are plenty of guides online for how to do this with a Rails app, there is a distinct lack of information of how to deploy a Vue.js front-end in conjunction on Heroku.

This tutorial assumes you have a back-end and a front-end in separate folders/repos. The only pre-reqs for this tutorial are `node` and `git`. The back-end should be configured to use PostgreSQL.

### Introduction
My application [WhoDecidesFood?](https://www.whodecidesfood.com/#/) is developed as a single-page application where the front-end code (Vue.js) is completely separate from the back-end Rails API code. In fact, the two parts are two individual `git` repositories (see [whodecidesfood-app](https://github.com/mjmeli/whodecidesfood-app) and [whodecidesfood-api](https://github.com/mjmeli/whodecidesfood-api)).

This is the general approach being taken by many people now because it provides various benefits. One big benefit that I identified for this is, as a hobby project, it would allow me to easily create new front-ends accessing the same back-end, i.e. if I were to create a phone app or use a different framework like Angular or React, by just swapping out the front-end. De-intertwining the front-end from the back-end here makes this much easier. In theory, this would also allow me to deploy both applications separately (i.e. for load balancing purposes), but I negate that benefit in this tutorial by deploying them together - you may want to consider a different approach if this is more than a hobby project or you have a dedicated team that can manage this.

### (Optional) Getting the Applications
Hopefully you have your own back-end and front-end developed, but to allow you to use something else for demo purposes, this section will detail how to use my own back-end and front-end.

Begin by cloning the repos into separate locations. I will rename the cloned folder to a generic name to make the rest of the tutorial generic.

    $ git clone https://github.com/mjmeli/whodecidesfood-app.git frontend
    $ git clone https://github.com/mjmeli/whodecidesfood-api.git backend

Now install the Node packages for the front-end. These are needed as you will have to build the front-end locally. This obviously requires you to have Node installed.

    $ cd frontend
    $ npm install

That's all.

### Getting Ready for Heroku
The first step in deploying to Heroku is to [create a Heroku account at this link](https://signup.heroku.com/devcenter).

Next, to be able to integrate with Heroku easily, you will need to make sure you have the Heroku command-line client. Installation depends on your operating system but there are good instructions [on the Heroku Dev Center](https://devcenter.heroku.com/articles/heroku-cli).

Finally, you will want to use the Heroku CLI to login.

    $ heroku login
    Enter your Heroku credentials.
    Email: <ENTER EMAIL>
    Password: <ENTER PASSWORD>
    Could not find an existing public key.
    Would you like to generate one? [Yn]
    Generating new SSH public key.
    Uploading ssh public key /Users/you/.ssh/id_rsa.pub

If prompted, press enter to generate a new SSH public key.

### Creating the Heroku App
Navigate to your back-end repo and use the Heroku CLI to create the application:

    $ cd backend
    $ heroku create
    Creating app... done, ⬢ <app-name>
    https://<app-name>.herokuapp.com/ | https://git.heroku.com/<app-name>.git

You will notice that Heroku adds a remote `git` repo to handle deployment. When you wish to deploy to Heroku, you will simply push to this `git` repo's `master` branch. Easy!

If you now navigate to your [Heroku Dashboard](https://dashboard.heroku.com/apps), you will see this newly created app. You can also navigate to it by using the URL given, but right now there is nothing there.

### Adding Front-End Content
Rails comes configured to use the `puma` web server by default. This is what runs when you do `rails server` locally and it can also be used easily and well in production. In the default configuration, `puma` will look into the `public` folder of your Rails application and it will serve everything in there as static content.

This is extremely useful because our front-end is static content! So all we have to do it put our front-end build there and `puma` will automatically handle it.

So let's do that. Begin by ensuring the `public` folder is empty except for `.gitkeep` (when you generate the Rails app, it will contain some files).

    $ cd backend
    $ rm -rf *

Next, navigate to your front-end and create a minified production build.

    $ cd ../frontend/public
    $ npm run build
    > whodecidesfood-app@1.0.0 build /home/me/frontend
    > node build/build.js
    ...
    ⠴ building for production...
    ...

    Build complete.

    Tip: built files are meant to be served over an HTTP server.
    Opening index.html over file:// won't work.

This will generate a folder in your front-end called `dist`. Inside this folder will be a file, `index.html`, and a folder, `static`. This is your front-end.

    $ ls dist
    index.html  static

You want to copy these files to your back-end `public` folder.

    $ cp -r dist/* ../backend/public

### Deploying to Heroku
You have a couple of options now. Remember that Heroku works as a `git` repo. That means that any files you wish to deploy (including your front-end) must be commited to the repo. So you can do this if you want and just use the `git push heroku master` command to deploy, but I think this is a bad idea because you don't want front-end builds in your back-end `git` repo or history.

However, Heroku's decision to use `git` was not necessarily one for version-control management. Since you already have a back-end repo, you don't care about the Heroku repo's history or state as much. As such, I suggest the following alternative approach, which is the one I use.

Navigate to your back-end and create a new branch.

    $ cd ../backend
    $ git checkout -b heroku-deploy

Now, commit the front-end files in this new branch.

    $ git add --all
    $ git commit -m "deploy"

We are going to now do a push to Heroku to kick off the deployment process. Note that we must do a couple of modifications to our `git push` command to make this work. First of all, we want to use the `-f` flag to force push to the repo. If we didn't do this, then this process would not work as we are not committing the front-end files to the actual repo; this would cause the `git` history of the two repos to diverge and cause a whole bunch of problems, so we just obliterate the Heroku repo each time as we do not care about its history. Next, we want to push to the Heroku `master` branch, but we are not on the `master` branch ourselves; as such, we will need to explicitly map this branch to the remote `master` branch. All in all, this command will suffice:

    $ git push -f heroku heroku-deploy:master

Now the deployment process will kick off. You will see the progress of it in your terminal. When it is complete, assuming it ran with no errors, be sure to run a database migrate.

    $ heroku run rake db:migrate

While we are "technically" done, we just did a bunch of hacky `git` things and will want to clean that up. That is easy by just deleting our branch.

    $ git checkout master
    $ git branch -D heroku-deploy

Awesome! That's it! You can now navigate to your application and everything should be up and running.

    $ heroku open

Just run through this process again to deploy subsequent times.

### Scripting the Deployment
This process have a bunch of commands to type out to its a prime candidate for scripting. I wrote a script to do so in my front-end repo. You can see it [here](https://github.com/mjmeli/whodecidesfood-app/blob/master/heroku-deploy.sh). You'll notice it follows the same flow as this tutorial.

### Additional Resources
If you have any problems deploying the Rails app to Heroku, please see the [official documentation](https://devcenter.heroku.com/articles/getting-started-with-rails5) for more detailed instructions.

If you have any aspect of your website that requires submitting sensitive information (i.e. login), I highly recommend enabling SSL. This is *extremely* easy with Heroku if you are in a paid tier (Hobby or higher). Follow [these instructions](https://devcenter.heroku.com/articles/automated-certificate-management) to automatically generate a certificate through Heroku and then pick up from [Step 4 of these instructions](https://readysteadycode.com/howto-setup-ssl-with-rails-and-heroku) to configure the Rails app. You can also provide your own certificates if you are on the free tier - simply follow the second link from the beginning and skip the first link.
