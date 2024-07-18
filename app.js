const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js")
const mongoose= require("mongoose")
const _=require("lodash");

mongoose.connect("mongodb+srv://aravindhSA:Aravindh3008@cluster009.j1o3u36.mongodb.net/todoList",{useNewUrlParser:true});
console.log(date());
const app=express();

const day=date();

const week=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

const itemSchema=({
    name:String
})

const Item= mongoose.model("Item",itemSchema);

const item1= new Item({
    name:"welcome to do list"
})

const item2= new Item({
    name:"hit + button to add new item"
})

const defaultItems=[item1,item2];

const listSchema= {
    name:String,
    items:[itemSchema]
};

const List= new mongoose.model("List",listSchema);

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){

    Item.find({}).then(function(foundItems){
        if(foundItems.length===0)
        {
            Item.insertMany(defaultItems).catch(err => {

                console.log(err);
                
              });
              res.redirect("/");
        }
        else{
            res.render("list",{listTitle:day,todoList:foundItems})
        }
       
    })
});

app.get("/:customListName",function(req,res){
    const newList=_.capitalize(req.params.customListName);

// List.findOne({name:newList}).then(function(err, result) {console.log(result)});

List.findOne({name:newList}).then(function(foundItems){
   if(!foundItems){
    const list=new List({
        name:newList,
        items:defaultItems
    });
    list.save();
    res.redirect("/"+newList);
   }
    else{
       
                res.render("list",{listTitle:newList,todoList:foundItems.items})
            }
        
        
   

}).catch(err => {

        console.log(err);
        
      });
   
})

app.post("/",function(req,res){
    const itemName=req.body.work;
    const routeName=req.body.button;
    const item= new Item({
        name:itemName
    })

    if(routeName===day){
       item.save();
       res.redirect("/");
    }
    else{
        List.findOne({name:routeName}).then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+routeName);
        })
    } 



//    if(req.body.button==="Work List"){
//     let itemName=req.body.work;
//     workItems.push(itemName);
//     res.redirect("/work");
//    }
//    else{
//     items.push(req.body.work);
//     res.redirect("/");
//    }

})

app.post("/delete",function(req,res){
    const id=(req.body.checkbox);
    console.log(id);
    const postTitle= req.body.listTitle;  
    console.log(postTitle); 

    if(postTitle===day){
        Item.findByIdAndRemove(req.body.checkbox).catch(err => {
            console.log(err);
          });
    res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:postTitle},{$pull:{items:{_id:id}}}).catch(err => {

            console.log(err);
            
          });;
        res.redirect("/"+postTitle);
    }
})

// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"Work List",todoList:foundItems})
// });

// app.get("/about",function(req,res){
//     res.render("about",{listTitle:"Work List",todoList:foundItems})
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
  console.log("server started");
}) 


// app.post("/work",function(req,res){
//     let item=req.body.work;
//     workItems.push(item);
//     res.redirect("/work");
// })
