const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
// const Student  = require('./studentSchema')
const csvtojson = require('csvtojson')
const fs=require('fs')
const path=require('path')
const app = express()
const cors=require('cors')
app.use(cors());

const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost:27017/MongoExcelDemo').then(() => {     // MongoDB connection
    console.log('database connected')
});


app.use(express.static('public'))    // static folder
app.set('view engine','ejs')             // set the template engine








const studentSchema = mongoose.Schema({
        
        id : {type: String, required : true},
        title : {type : String, required : true},
        price : {type: String, required : true},
        seller : {type: String, required : true},
        img:{type: String, required : true}
})



Student= mongoose.model('Student', studentSchema)
var excelStorage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
         cb(null,__dirname+'/excelUploads');      // file added to the public folder of the root directory
    },  
    filename:(req,file,cb)=>{  
         cb(null,file.originalname);  
    }  
});  
var excelUploads = multer({storage:excelStorage}); 
app.get('/',(req,res) => {
       res.render('welcome');
      
       
})
app.post('/',(req,res) => {
       res.render('welcome');
      
       
})
app.post('/c',(req,res)=>{
    res.render('index')
})
// upload excel file and import in mongodb
app.post('/uploadExcelFile', excelUploads.single("uploadfile"), (req, res) =>{  
       importFile(__dirname+'/excelUploads/' + req.file.filename);
            
       function importFile(filePath){
              //  Read Excel File to Json Data
                var arrayToInsert = [];
                csvtojson().fromFile(filePath).then(source => {
              // Fetching the all data from each row
              //obj={data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),contentType: 'image/png'}
                for (var i = 0; i < source.length; i++) {
                    console.log(source[i]["name"])
                    var singleRow = {
                        id: source[i]["id"],
                        title: source[i]["title"],
                        price: source[i]["price"],
                        seller: source[i]["seller"],
                        img: source[i] ["img"]
                        
                    };
                    arrayToInsert.push(singleRow);
                }
             //inserting into the table student
             Student.insertMany(arrayToInsert, (err, result) => {
                    if (err) console.log(err);
                        if(result){
                            console.log("File imported successfully.");
                            res.render("success")
                        }
                    });
                });
           }
})



app.listen(3000, () => {
    console.log('server started at port 3000')
})

app.post('/post',(req,res)=>{
    var id=req.body.search
    
    Student.find({id},(err,data)=>{
        
            res.render('post',{
                data:data
          
    })
})
})
app.post('/Delete',(req,res)=>{
    Student.deleteMany({ }).then(function(){
        console.log("Data deleted"); // Success
        res.render("Delete")
    }).catch(function(error){
        console.log(error); // Failure
    });
})
app.get('/products',(req,res)=>{
    try{
Student.find({},(err,data)=>{
    // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
    res.send(data)

        // return res.data;
        
          
    })
    }
    catch(err){
        console.log(err)
    }
})