const express = require("express");

const bcryptjs = require("bcryptjs");
// jwt helps to create token=========================================
const jwt = require("jsonwebtoken")

const router = new express.Router();
const Customer = require("../models/CustomerModel");
const { verifyCustomer } = require("../auth/auth");
router.post("/customer/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const address = req.body.address;
    const country = req.body.country;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    Customer.findOne({ username: username }).then(function (customerData) {
        if (customerData != null) {
            res.status(401).json({ msg: "Username Already Exists" });
            return;
        }
        bcryptjs.hash(password, 10, function (e, hashed_password) {

            const customerData = new Customer({
                username: username,
                password: hashed_password,
                email: email,
                address: address,
                country: country,
                firstname: firstname,
                lastname: lastname,
            })
            customerData.save().then(customer => {
                res.json({
                    sucess: true,
                    "message": "user registered!"
                }).catch(function (e) {
                    res.json(e)
                })
            });

        })
    })

});

//login route for customer

router.post("/customer/login", function (req, res) {
    const username = req.body.username;
    Customer.findOne({ username: username })
        .then(function (customerData) {
            console.log(customerData);
            if (customerData === null) {
                return res.json({ message: "invalid login credentails!" })
            }
            const password = req.body.password;
            bcryptjs.compare(password, customerData.password, function (err, result) {
                if (result === false) {
                    return res.json({ message: " invalid login credentials!" })
                }
                const token12 = jwt.sign({ customerId: customerData.id }, "mysecretkey");
                res.json({ token: token12, message: "Auth success" })
            })
        }).catch()
})

router.delete("/customer/delete", verifyCustomer, function(req,res){
    res.json({msg: " delete"});
})

module.exports = router;