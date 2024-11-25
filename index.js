const express = require('express');
const app = express();
const port = 3000;
const expressHbs = require('express-handlebars');
const router = require('./routes/blogRouter');
const {createPagination} = require('express-handlebars-paginate')

// cấu hình giao thức
app.use(express.static(__dirname + "/html"));
app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir:__dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers:{
        createPagination, 
        formatDate: (data) => {
            return data.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } 
    }
}));




app.set("view engine", "hbs");
app.listen(port, () => console.log(`Example app listening on port ${port}`))


app.use('/blogs', require('./routes/blogRouter'));

app.get("/", (req, res) => res.redirect("/blogs"));
