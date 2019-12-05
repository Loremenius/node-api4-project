const express = require('express');

const router = express.Router();

const db = require('./userDb.js');

const postDB = require('../posts/postDb.js');

router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
    .then(data=>{
      res.status(201).json(data);
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem adding the new user",
        error: error
      });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {

  const newPost = {
    ...req.body,
    user_id: req.params.id
  }

  postDB.insert(newPost)
    .then(data=>{
      res.status(201).json(data);
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem retrieving Users",
        error: error
      });
    });
});

router.get('/', (req, res) => {
  // do your magic!
  db.get()
    .then(data=>{
      res.status(200).json(data);
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem retrieving Users",
        error: error
      });
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
    .then(data=>{
      res.status(200).json(data);
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem retrieving Users",
        error: error
      });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  db.remove(req.params.id)
    .then(data=>{
        res.status(200).json({message: "successfully deleted user"});
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem removing User",
        error: error
      });
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  db.update(req.params.id, req.body)
    .then(data=>{
      if(data === 1){
        res.status(200).json({message:"successfully updated user"});
      }else{
        res.status(500).json({message:"unable to update user"});
      }
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem updating User",
        error: error
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  console.log('Checking ID');
  db.getById(req.params.id)
    .then(data=>{
      if(data){
        req.user = data
        next();
      }else{
        res.status(400).json({  message: "invalid user id" });
      }
      
    });
}

function validateUser(req, res, next) {
  console.log('Checking body for user data')
  if(req.body){//IF 1 start
    if(req.body.name){//IF 1 start
      next();
    }else{
      res.status(400).json({ message: "missing required name field" });
    /* IF 2 end */}
  /* IF 1 end */}else{
    res.status(400).json({ message: "missing user data" })
  }

}

function validatePost(req, res, next) {
  console.log('checking body for Post data');
  if(req.body){ //IF 1 start
    if(req.body.text){ // IF 2 start
      next();
    }else{
      res.status(400).json({ message: "missing required text field" });
    /* IF 2 end */}
  /* IF 1 end */}else{
    res.status(400).json({ message: "missing post data" })
  }
}

module.exports = router;
