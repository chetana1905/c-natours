const express = require("express");
const Router = express.Router();
const AuthController = require("../controllers/authController");
const UserController = require("../controllers/userController");


Router.post("/signUp", AuthController.signup);
Router.post("/forget-password", AuthController.forgotPassword);
Router.post("/reset-password/:token", AuthController.resetPassword);
Router.post("/login", AuthController.login);
Router.get("/logout", AuthController.logout);

// Protect middleware
Router.use(AuthController.protect);


Router.get("/me", AuthController.restrict(["admin"]) , (req, res) => {
    res.status(200).json({
        status:"success",
        user : req.user
    })
})
Router.patch("/update-me",
AuthController.uploadMiddleware,
AuthController.resizeMiddleware,
AuthController.filterBody,
AuthController.updateMe);

Router.patch("/update-password", AuthController.updatePassword);

Router.get("/:all" , UserController.getUsers);

Router.use(AuthController.restrict(["admin"]));

Router.route("/:id")
.get(UserController.getUser)
.patch(UserController.updateUser)
.delete(UserController.deleteUser);

module.exports = Router;
