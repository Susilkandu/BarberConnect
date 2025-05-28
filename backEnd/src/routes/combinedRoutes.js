const path = require("path");
const express = require("express");
const router = require("express").Router();

const {customerRoutes}= require("../modules//customer/index");
const {businessRoutes} = require("../modules/business/index");
const {publicRoutes} = require("../modules/public/index");
router.use("/customer",customerRoutes);
router.use('/business',businessRoutes);
router.use('/public',publicRoutes);

// to serve photos
router.use("/photos",express.static(path.join(__dirname, "../../../files")))

module.exports = router;