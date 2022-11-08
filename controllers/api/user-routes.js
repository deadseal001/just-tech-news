const router = require('express').Router();
const {User, Post, Vote}= require("../../models");

//get/api/users
router.get('/',(req,res)=>{
    //Access our User model and run .findAll() method
    console.log('get');
    User.findAll({
        attributes: { exclude: ['password']}//hide password
    })
    .then(dbUserData=> res.json(dbUserData))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

//get /api/users/1
router.get('/:id',(req,res)=>{
    User.findOne({
        attributes: { exclude: ['password']},//hide password
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes:['id', 'title', 'post_url','created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData =>{
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

//post api/users
router.post('/',(req,res)=>{
    //expects {username:'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create ({
        username:req.body.username,
        email:req.body.email,
        password: req.body.password
    })
    .then(dbUserData=> res.json(dbUserData))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login',(req,res)=>{
    //query operation
    //expects { email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where:{
            email: req.body.email
        }
    }).then(dbUserData=>{
        if(!dbUserData){
            res.status(400).json({ message: 'No user with that email address!'});
            return;
        }

        //res.json({user:dbUserData});
        //Verify user
        const validPassword=dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({message: 'Incorrect password!' })
            return;
        }
        res.json({user: dbUserData, message: 'You are now logged in!'});
    });

});

//put /api/users/1
router.put('/:id',(req,res)=>{
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body,{
        where: {
            id:req.params.id
        }
    })
    .then(dbUserData=>{
        if (!dbUserData[0]){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);//what to update
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

//delete /api.users/1
router.delete('/:id',(req,res)=>{
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData=>{
        if (!dbUserData){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports=router;