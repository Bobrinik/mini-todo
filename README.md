# Motivation
- This is a personal project that was built as a way to practice building applications by using Html, css, js, angularjs, and Nodejs

# Requirements
## What does a typical todo application needs?
- Keep a list of tasks
- Mark tasks as complete or not

## How is this app different?
- It let's you see how you project evolved over time
- Each task can have parent tasks and they are displayed as a graph


## Challenges
- Implement graph logic

## How to run this project?

```
$ npm install
$ sudo service mongod start #it's a mongodb server
$ npm start
```

## What I learnt
- Start designing the UI first and the design your backend
- Design core functionality in the UI first and the design registration and other stuff



## TODO
[X] Move tasks list to the left
[X] Add graph to the right of the task list
[] I need to connect tasks together
    - I need to figure out how to connect tasks together
[] Remove tasks
[] Make the app somewhat beautiful
[] Profit out of the basic layout

## Graph
- For some reason I can't see edges being drawn
- When later, I'm going to be doing linking. I should create a map where, I'm going to map ids of the tasks to their position inside of the array so that I can do linking pretty fast.