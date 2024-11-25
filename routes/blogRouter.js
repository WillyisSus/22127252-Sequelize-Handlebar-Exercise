const router = require('express').Router();
const { showDetails, showList, init } = require('../controller/blogController');
router.use("/", init)
router.get("/:id", showDetails);
router.get("/", showList)
module.exports  = router;