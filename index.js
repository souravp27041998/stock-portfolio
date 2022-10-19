const { Console } = require('console');
var express=require('express');
var {engine}=require('express-handlebars');
const { resolve } = require('path');
var path=require('path');
var request=require('request');
var bodyParser=require('body-parser');

const port=process.env.PORT ||8000;
var app=express();

app.engine('handlebars',engine());
app.set('view engine','handlebars');
//app.set('views', './views');
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

const myStuff="This Is My Stuff";
const about="you can use this keyword to get stock market results";

app.get('/', async (req, res) => {
    stockData=await getStockData();
    console.log('stockData : ',stockData);

    res.render('home',{
        stock :stockData
    });
});

app.post('/', async (req, res) => {
    var stock_name=req.body.stock_name;
    console.log('searching result for : '+stock_name);
    var stockData=null;
    getStockData(stock_name).then((value )=>{
        stockData=value;
        res.render('home',{
            stock :stockData
        });
    }).catch((err)=>{
        console.log(err);
        res.render('home',{
            stock :stockData
        });
    });
});

app.get('/about', (req, res) => {
    res.render('about',{
        about
    });
});

function getStockData(stock_name){
    if(!stock_name){
        stock_name='fb';
    }
var apiKey="pk_8fac9dbbf74248f4adf23cf14bb7c51b";
var baseUrl=`https://cloud.iexapis.com/stable/stock/${stock_name}/quote?token=${apiKey}`;
    return new Promise((resolve,reject)=>{
        request(baseUrl,{json:true},(err,res,body)=>{
            if(err){
                reject(err);
            }else if(res.statusCode==200){
                resolve(body);
            }else{
                reject(res);
            }
        });
    });
}

app.listen(port,()=>{console.log(`app running on port ${port}`)})