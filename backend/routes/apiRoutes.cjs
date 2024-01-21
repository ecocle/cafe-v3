const express = require("express");

const { getDataCoffee } = require("../controllers/dataCoffeeController.cjs");
const {
    getDataNonCaffeinated,
} = require("../controllers/dataNonCaffeinatedController.cjs");
const {
    getDataBreakfast,
} = require("../controllers/dataBreakfastController.cjs");
const { signUp } = require("../controllers/signUpController.cjs");
const { signIn } = require("../controllers/signInController.cjs");
const { userData } = require("../controllers/userDataController.cjs");
const { itemData } = require("../controllers/itemDataController.cjs");
const { orders } = require("../controllers/ordersController.cjs");

const router = express.Router();

router.get("/dataCoffee", (req, res) => getDataCoffee(req, res));
router.get("/dataNonCaffeinated", (req, res) =>
    getDataNonCaffeinated(req, res),
);
router.get("/dataBreakfast", (req, res) => getDataBreakfast(req, res));
router.post("/signUp", (req, res) => signUp(req, res));
router.post("/signIn", (req, res) => signIn(req, res));
router.get("/userData", (req, res) => userData(req, res));
router.get("/itemData/:itemType/:itemName", (req, res) => itemData(req, res));
router.get("/orders", (req, res) => orders(req, res));

module.exports = router;
