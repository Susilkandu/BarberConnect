const path = require("path");
const express = require("express");
const router = require("express").Router();

const {customerRoutes}= require("../modules//customer/index");
const {salonRoutes} = require("../modules/salon/index");
const {staffRoutes} = require('../modules/staff/index');
const {publicRoutes} = require("../modules/public/index");
const { BookingRoutes } = require("../modules/booking/index");
router.use("/customer",customerRoutes);
router.use('/salon',salonRoutes);
router.use('/salon/staff', staffRoutes);
router.use('/public',publicRoutes);
router.use('/booking',BookingRoutes);

// to serve photos
router.use("/photos",express.static(path.join(__dirname, "../../../files")))

module.exports = router;