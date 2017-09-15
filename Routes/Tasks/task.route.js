import express from 'express';
import passport from 'passport';
import { createTask } from './task.service';

/*
- How are we going to load all of these tasks?
	- We are going to pull all of the tasks that belong to one user

- How are we going to make connections betweel all of these tasks?
	- We are going to loop through all of the tasks and associate them
*/

const router = express.Router();

// User should be registered to access this route
router.route('/')
    //POST: api/task- we are creating a task
    /*TODO:
        [] Body of the request should have all necessary elements
        [] We are creating a task and add userId to whom this task belongs to
    */
    .post(passport.authenticate('jwt', { session: false }), (req, res) => {
        console.log('We reached this part here');
        createTask(req.user.id, req.body, (err, task) => {
            if (err) {
                res.status(400).json({ message: 'error' });
            }
            else {
                console.log(task);
                if (task) {
                    res.status(200).json({ message: 'ok', task: task });
                }
                else {
                    res.status(500).json({ message: 'error' });
                }
            }
        })
    });

router.route('/:userId')
    //GET: api/task/:userId - we are returning all of the tasks associated to a userId
    .get((req, res) => {
        /*TODO:
        [] We are going to return all tasks that belong to this user
        */
    });

router.route('/:userId/:taskId')
    //PUT: api/task- we are updating a task
    .put((req, res) => {

    })
    //DELETE: api/task- we are deleting a task
    .delete((req, res) => {

    });

module.exports = router;