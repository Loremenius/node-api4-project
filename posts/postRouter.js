const express = require('express');
const db = require('./postDb');
const router = express.Router();

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

router.get('/:id', validatePostId,(req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  db.remove(req.params.id)
    .then(data=>{
        res.status(200).json({message: "successfully deleted post"});
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem removing post",
        error: error
      });
    })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  db.update(req.params.id, req.body)
    .then(data=>{
      if(data === 1){
        res.status(200).json({message:"successfully updated post"});
      }else{
        res.status(500).json({message:"unable to update post"});
      }
    })
    .catch(error=>{
      res.status(500).json({
        message:" There was a problem updating User",
        error: error
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  db.getById(req.params.id)
  .then(data=>{
    if(data){
      req.post = data
      next();
    }else{
      res.status(400).json({  message: "invalid post id" });
    }
    
  });
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
