
exports.login = (req, res , next) => {
    res.status(200).render("login" , {
        title : "Login"
    });
}


exports.signup = (req, res, next) => {
    res.status(200).render('signup',{
        title:'Sign Up'
    })
}

exports.forgotPw = (req, res, next) =>{
    res.status(200).render('forget-pw',{
        title:'Forget Password'
    })
}

exports.redirects = (req, res, next) =>{
    if(req.user == undefined){
        res.redirect('/login');
    }
    else next();
}