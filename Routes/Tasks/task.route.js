import express from 'express';
import passport from 'passport';
import * as service from './task.service';

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
    .post(passport.authenticate('jwt', { session: false }), (req, res) => {
        console.log("Reached");
        service.createTask(req.user.id, req.body, (err, task) => {
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
        });
    });

router.route('/')
    //GET: api/task/:userId - we are returning all of the tasks associated to a userId
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        service.getMyTasks(req.user.id, (err, task) => {
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
        });
    });

//FIXME: Make sure that req.body contains allowable keys
router.route('/:taskId')
    //PUT: api/task- we are updating a task
    .put(passport.authenticate('jwt', { session: false }), (req, res) => {
        service.updateTask(req.user.id, req.params.taskId, req.body, (err, data) => {
            if (err) {
                res.status(400).send({ message: err });
            } else {
                res.status(200).send({ message: data })
            }
        });
    })
    //DELETE: api/task- we are deleting a task
    .delete(passport.authenticate('jwt', { session: false }), (req, res) => {
        console.log(req.params.taskId);
        service.deleteMyTask(req.user.id, req.params.taskId, (err, data) => {
            if (err) {
                res.status(400).send({ message: err });
            } else {
                res.status(200).send({ message: data })
            }
        });
    });

module.exports = router;