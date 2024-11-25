let controller = {};
const { Op,  where } = require('sequelize');
const models = require('../models')
controller.init = async (req, res, next) => {
    res.locals.categories =  await models.Category.findAll({
        include: [{model: models.Blog}],

    });
    res.locals.tags = await models.Tag.findAll();
    next();
}

controller.showDetails = async (req, res)=> {
    console.log("Trigger this fucking shit")
    let id =  isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    let blog = await models.Blog.findOne({
        where: {id},
        include: [
            {model: models.Comment},
            {model: models.User},
            {model: models.Category},
            {model: models.Tag}
        ]
    }) 
    res.locals.blog = blog;
    console.log(blog)
    res.render('details')
}

controller.showList = async (req, res) => {
    let limit = 2;
    let categoryId = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let tagId = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let keyword = (req.query.keywords || "");
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page);
    let offset = (page - 1) * limit;
    let option = {
        include: [{model: models.Comment}],
        where: {}
    }
    let blogs;
    if (categoryId > 0){
        option.where.categoryId = categoryId;

    }
    if(tagId > 0) {
        option.include.push({model: models.Tag, where:{id: tagId}});
        
    }
    if(keyword != ""){
        option.where = {
            [Op.or]:{
                title: {[Op.iLike]: `%${keyword.trim()}%`},
                summary: {[Op.iLike]: `%${keyword.trim()}`}
            }
        }
    }
    let totalRows =  await models.Blog.count({
        ...option, 
        distinct: true,
        col: "id",
    })
    res.locals.pagination = {
        page,
        limit,
        totalRows,
        queryParams: req.query
    }
    blogs = await models.Blog.findAll({...option, limit, offset})
    res.locals.blogs = blogs;
    res.render('index');
}

module.exports = controller;