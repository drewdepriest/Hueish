// detect if mobile browser
var isMobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    isMobile = true;
} else {
    isMobile = false;
}

// if on mobile, hide the 'preview' block, as a user can't mouse over anything
if(isMobile){
    $('div#preview').hide();
}

// hide the "loading" message
$(document).ready( function() {
    $(".ui-loader").hide();
});

// use this to generate every url below
var siteUrl = "http://drewdepriest.com/hueish";

/*
 *  Now begins the fun part. #np - "Haus of Doze: Volume 4" - @thejanedoze #antlersup
 */

// latch if user has selected a color
var colorLatch = false;

// latch if user has selected a department
var depLatch = false;   

// current tie type
var activeType = 0;  

// *** initialize variables to pass to PHP function ***
var searchColor = "";
var searchArticle = "";
var searchDep = "";   

// on ready, hide all of the match swatches
$(function() {
    $('span.black').hide();
	$('span.gray').hide();
	$('span.white').hide();
	$('span.brown').hide();
	$('span.beige').hide();
	$('span.red').hide();
	$('span.pink').hide();
	$('span.orange').hide();
    $('span.yellow').hide();
    $('span.ivory').hide();    
    $('span.green').hide();
    $('span.blue').hide();
    $('span.purple').hide();
	$('span.gold').hide();
	$('span.silver').hide();
});       



//
window.onload=function(){
    document.getElementById('file-input').addEventListener('change', function(event) {
        var myCanvas = document.getElementById('photo');
        var ctx = myCanvas.getContext('2d');
        var img = new Image();
        img.onload = function(){
            //myCanvas.width = img.width;
            //myCanvas.height = img.height;



            // restrict canvas to 400px by 300px portrait or 300px by 400px landscape
            // load portrait orientation
            
            if(img.width <= img.height){
                ctx.drawImage(img, 0, 0, 300, 400);
            } else if(img.width > img.height) {
            // load landscape orientation
                ctx.drawImage(img, 0, 0, 400, 300);
            }
            
            //ctx.drawImage(img, 0, 0);
            
        };
        
        img.src = URL.createObjectURL(event.target.files[0]);
    });



    // define HTML5 canvas
    var photoCanvas = document.getElementById('photo');
    var ctx = photoCanvas.getContext('2d');

    $('#zoom-in').click(function(e) {
        /* do something here to make the image zoom in */ 
    });  

    $('#zoom-out').click(function(e) {
        /* do something here to make the image zoom out */

    }); 

    $('#rotate-left').click(function(e) {
        /* do something here to make the image rotate left */ 
    });  

    $('#rotate-right').click(function(e) {
        /* do something here to make the image rotate right */
    }); 


// get the file once the user clicks the file handler button
/* $(function() {
    $('#file-input').change(function(e) {
       

        var file = e.target.files[0],
           // imageType = /image.*/;
//
 /*       if (!file.type.match(imageType))
            return;
       var reader = new FileReader();
        reader.onload = fileOnload;
        reader.readAsDataURL(file);        
//    });

    var $img = new Image();
    var imgUrl = "";

    function fileOnload(e) {

        $img = $('<img>', { src: e.target.result });
        imgUrl = e.target.result;
        
        //var canvas = $('#photo')[0];
        var canvas = document.getElementById('photo');
        var context = canvas.getContext('2d');

        // clear the canvas before loading an image
        // this takes care of any additional picture loads
        context.clearRect (0,0,400,400);

        //$img.load(function() {
            
            // load portrait orientation
            //if(this.width < this.height){
            context.drawImage(this, 0, 0, 300, 400);
           // } else if(this.width > this.height) {
            // load landscape orientation
            //    context.drawImage(this, 0, 0, 400, 300);
          //  }
            
        //});

        context.save();
    }



    
    // don't release any ajax calls until someone has clicked the canvas and picked a color
    var initFlag = false;

    /* Amazon allows users to search ties by 15 colors (RGB values shown):
        
        Black:  40,40,40 
        Gray:   136,136,136
        White:  255,255,255    
        Brown:  108,75,75      
        Beige:  190,184,150
        Red:    190,0,20             
        Pink:   255,204,206        
        Orange: 255,164,84           
        Yellow: 250,255,150   
        Ivory: 252,255,220        
        Green:  0,191,45            
        Blue:   34,73,118             
        Purple: 166,0,225          
        Gold:   220,228,136
        Silver: 239,239,239 
    */ 

    // build a multi-dimensional array in which to store all color values
    // [name, rVal, gVal, bVal]
    var colorsArr = [];
    colorsArr.push(["black",40,40,40]);
    colorsArr.push(["gray",136,136,136]);
    colorsArr.push(["white",255,255,255]);
    colorsArr.push(["brown",108,75,75]);
    colorsArr.push(["beige",190,184,150]);
    colorsArr.push(["red",190,0,20]);
    colorsArr.push(["pink",255,204,206]);
    colorsArr.push(["orange",255,164,84]);
    colorsArr.push(["yellow",250,255,150]);
    colorsArr.push(["ivory",252,255,220]);
    colorsArr.push(["green",0,191,45]);
    colorsArr.push(["blue",34,73,118]);
    colorsArr.push(["purple",166,0,225]);
    colorsArr.push(["gold",220,228,136]);
    colorsArr.push(["silver",239,239,239]);

        // order of all colors by which to search
    var nameArr = [];

    // Store all R values for the colors
    var rMatchArr = [];

    // Store all G values for the colors
    var gMatchArr = [];

    // Store all B values for the colors
    var bMatchArr = [];

    // flags for 10% matches on R, G, and B values
    // each index corresponds to the colors given in comment above
    var matchFlag = [];

    for(var i=0;i<colorsArr.length;i++){

            nameArr.push(colorsArr[i][0]);
            rMatchArr.push(colorsArr[i][1]);
            gMatchArr.push(colorsArr[i][2]);
            bMatchArr.push(colorsArr[i][3]);
            matchFlag.push("false");
    }

    // get the pixel information based on mouse location over the photo
    $('#photo').mousemove(function(e) { 
    var canvasOffset = $(photoCanvas).offset();
    var canvasX = Math.floor(e.pageX - canvasOffset.left);
    var canvasY = Math.floor(e.pageY - canvasOffset.top);

    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    var pixel = imageData.data;

    var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
    $('#preview').css('backgroundColor', pixelColor);
    });

    // have you already called the Amazon site?
    // if so, let this update the request 
    var reqFlag = false;

    $('#photo').click(function(e) {

        // once someone clicks the canvas, allow the ajax call to execute 
        colorLatch = true;
        getMatchMerch(e);
        if(activeType ==1){
            $('#go-men').addClass('active');
           // updateData();
        } else if(activeType == 2){
            $('#go-women').addClass('active');
           // updateData();
        } else if(activeType == 3){
            $('#go-boys').addClass('active');
           // updateData();
        } else if(activeType == 4){
            $('#go-girls').addClass('active');
           // updateData();
        } else if(activeType == 5){
            $('#go-baby').addClass('active');
           // updateData();
        }

        //if(depLatch){
          //  getMatchMerch(e);
            //updateData(baseURL);
        //}
        
    });  

    /*
        getMatchMerch()
        This function does the heavy lifting for processing the merchandise recommendations.
        It shall be called whenever someone clicks the picture or when someone changes the dropdown state.
    */    
    var tempIndex = 0;  
    
    // find the matching color
    function getMatchMerch(e) { 
        var canvasOffset = $(photoCanvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
 
        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;

        // individual RGB values for clicked color    
        var rVal = pixel[0];
        var gVal = pixel[1];
        var bVal = pixel[2];

        /*
        * Old, simple way of finding complement
        var rValMatch = 255 - rVal;
        var gValMatch = 255 - gVal;
        var bValMatch = 255 - bVal;
        */

        // New way: uconvert RGB to HSV, modify hue angle, convert back to RGB
        // convert from RGB to HSL (from color.js)
        var clickRGB = new Object();
        clickRGB.r = rVal;
        clickRGB.g = gVal;
        clickRGB.b = bVal;

        var clickHSV = RGB2HSV(clickRGB);
        //console.log("original hue: " + clickHSV.hue);

        // modify the hue by 180 degrees (careful of range of 0-360 degrees)
        // this should locate the exact complement of the clicked pixel's color
        clickHSV.hue = clickHSV.hue + 180;
        if(clickHSV.hue >= 360.0){
            clickHSV.hue = clickHSV.hue - 360;
        }
        if(clickHSV.hue < 0.0){
            clickHSV.hue = clickHSV.hue + 360;
        }

        // convert to RGB   
        var matchRGB = HSV2RGB(clickHSV);
        var rValMatch = matchRGB.r;
        var gValMatch = matchRGB.g;
        var bValMatch = matchRGB.b;

        $('#rVal').val(pixel[0]);
        $('#gVal').val(pixel[1]);
        $('#bVal').val(pixel[2]);
 
        $('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2]);
        $('#rgbaVal').val(pixel[0]+','+pixel[1]+','+pixel[2]+','+pixel[3]);
        var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
        $('#hexVal').val( '#' + dColor.toString(16) );

        var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
        $('#preview-lock').css('backgroundColor', pixelColor);

        var pixelColorMatch = "rgba("+rValMatch+", "+gValMatch+", "+bValMatch+", "+pixel[3]+")";
        $('#preview-match').css('backgroundColor', pixelColorMatch);

        // for loop to find matches    
        // call external function to calculate color "distance" between the two
        var tempDistArr = [];

        for(var i=0;i<rMatchArr.length;i++)
        {
            tempDistArr.push(getColorDistance(rValMatch,gValMatch,bValMatch,rMatchArr[i],gMatchArr[i],bMatchArr[i]));
        }

        // get the index of the minimum value of the "distance" array
        tempIndex = tempDistArr.indexOf(Math.min.apply(Math, tempDistArr));
        //console.log("Match color: " + colorsArr[tempIndex]);

        // try providing the top two best matches
        var bestMatch = tempDistArr.indexOf(Math.min.apply(Math, tempDistArr));
        console.log("Best match: " + colorsArr[bestMatch]);

        tempDistArr.splice(tempIndex,1);
        var secondMatch = tempDistArr.indexOf(Math.min.apply(Math, tempDistArr));
        console.log("Second match: " + colorsArr[secondMatch]);

        // now show/hide each matching color based on analysis
        if(tempIndex == 0)
        {
            $('span.black').show();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "black";
        }
        if(tempIndex == 1)
        {
            $('span.black').hide();
			$('span.gray').show();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "gray";
        }   
        if(tempIndex == 2)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').show();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "white";
        }   
        if(tempIndex == 3)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').show();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "brown";
        }   
        if(tempIndex == 4)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').show();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "beige";
        }   
        if(tempIndex == 5)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').show();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "red";
        }   
        if(tempIndex == 6)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').show();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "pink";
        }   
        if(tempIndex == 7)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').show();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "orange";
        }   
        if(tempIndex == 8)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').show();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "yellow";
        }   
        if(tempIndex == 9)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').show();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "ivory";
        }   
        if(tempIndex == 10)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').show();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "green";
        }  
        if(tempIndex == 11)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').show();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "blue";
        }   		
        if(tempIndex == 12)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').show();
			$('span.gold').hide();
			$('span.silver').hide();
            searchColor = "purple";
        }   
		if(tempIndex == 13)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').show();
			$('span.silver').hide();
            searchColor = "gold";
        }
		if(tempIndex == 14)
        {
            $('span.black').hide();
			$('span.gray').hide();
			$('span.white').hide();
			$('span.brown').hide();
			$('span.beige').hide();
			$('span.red').hide();
			$('span.pink').hide();
			$('span.orange').hide();
			$('span.yellow').hide();
			$('span.ivory').hide();    
			$('span.green').hide();
			$('span.blue').hide();
			$('span.purple').hide();
			$('span.gold').hide();
			$('span.silver').show();
            searchColor = "silver";
        }		
    };

    // make the decision based on button click to select department
    $('#go-men').click(function(e) {
        activeType = 1;
        searchDep = "mens";
        setButtonActive("dep",1);
        //updateData();

    });

    $('#go-women').click(function(e) {
        activeType = 2;
        searchDep = "womens";
        setButtonActive("dep",2);
        //updateData();
    });

    $('#go-boys').click(function(e) {
        activeType = 3;
        searchDep = "boys";
        setButtonActive("dep",3);
        //updateData();
    });
	
	$('#go-girls').click(function(e) {
        activeType = 4;
        searchDep = "girls";
        setButtonActive("dep",4);
        //updateData();
    });
	
	$('#go-baby').click(function(e) {
        activeType = 5;
        searchDep = "baby";
        setButtonActive("dep",5);
        //updateData();
    });

    // and now the different kinds of clothes to search
    $('#jacket').click(function(e) {
        $(this).addClass('active');
        searchArticle = "jacket";
        setButtonActive("art",1);
        updateData();

    });

    $('#tie').click(function(e) {
        $(this).addClass('active');
        searchArticle = "tie";
        setButtonActive("art",2);
        updateData();

    });

    $('#shirt').click(function(e) {
        $(this).addClass('active');
        searchArticle = "shirt";
        setButtonActive("art",3);
        updateData();

    });

    $('#dress').click(function(e) {
        $(this).addClass('active');
        searchArticle = "dress";
        setButtonActive("art",4);
        updateData();

    });

    $('#pants').click(function(e) {
        $(this).addClass('active');
        searchArticle = "pants";
        setButtonActive("art",5);
        updateData();

    });

    $('#socks').click(function(e) {
        $(this).addClass('active');
        searchArticle = "socks";
        setButtonActive("art",6);
        updateData();

    });

    // this function goes out to the clothes site, searches by color/department/clothing type, and prints results in the "matches" div
    function updateData(){
        
        if(colorLatch){

            
            // old way, back when Associates API worked without throttling
            /*
            var goUrl = siteUrl + "/scripts/getMatches.php";
            goUrl = goUrl + "?searchColor=" + searchColor + "&searchArticle=" + searchArticle + "&searchDep=" + searchDep;
            console.log(goUrl);
            // pull in the appropriate clothes match lists
            $.ajax({
                url: goUrl,
                type: 'GET',
                dataType: 'html',
                success: function(res) {
                    // append the result from the php call to the "matches" div
                    $('#matches').html(res);
                
                }
            }); */

            // new way - open in a new tab for now until I can figure out the new Associates API
            // 2019.12.30
            var newTab = document.createElement("iframe");
            var newTabUrl = "https://amazon.com/s?k=" + searchArticle + " " + searchColor + "&i=fashion-" + searchDep;
            window.open(newTabUrl,"_blank");

        }
        
    }

    function getColorDistance(r1, g1, b1, r2, g2, b2) {
        
        var rBar = (r1 + r2)/2;
        var rDelta = r1 - r2;
        var gDelta = g1 - g2;
        var bDelta = b1 - b2;
        var cDelta = Math.sqrt(((2+(rBar/256))*(rDelta*rDelta))+((4)*(gDelta*gDelta)) + ((2+((255-rBar)/256))*bDelta*bDelta));

        // convention says JND < 3 will suffice.
        // "JND" = Just Noticeable Difference    
        return cDelta;
    }

//});

function setButtonActive(btnGroup,activeType){

    if(btnGroup == "dep"){

        if(activeType ==1){
            $('#go-men').addClass('active');
            $('#go-women').removeClass('active');
            $('#go-boys').removeClass('active');
            $('#go-girls').removeClass('active');
            $('#go-baby').removeClass('active');
            
        } else if(activeType == 2){
            $('#go-men').removeClass('active');
            $('#go-women').addClass('active');
            $('#go-boys').removeClass('active');
            $('#go-girls').removeClass('active');
            $('#go-baby').removeClass('active');
            
        } else if(activeType == 3){
            $('#go-men').removeClass('active');
            $('#go-women').removeClass('active');
            $('#go-boys').addClass('active');
            $('#go-girls').removeClass('active');
            $('#go-baby').removeClass('active');
            
        } else if(activeType == 4){
            $('#go-men').removeClass('active');
            $('#go-women').removeClass('active');
            $('#go-boys').removeClass('active');
            $('#go-girls').addClass('active');
            $('#go-baby').removeClass('active');
            
        } else if(activeType == 5){
            $('#go-men').removeClass('active');
            $('#go-women').removeClass('active');
            $('#go-boys').removeClass('active');
            $('#go-girls').removeClass('active');
            $('#go-baby').addClass('active');
            
        }
    }   

    if(btnGroup == "art"){
        if(activeType ==1){
            $('#jacket').addClass('active');
            $('#tie').removeClass('active');
            $('#shirt').removeClass('active');
            $('#dress').removeClass('active');
            $('#pants').removeClass('active');
            $('#socks').removeClass('active');
            
        } else if(activeType == 2){
            $('#jacket').removeClass('active');
            $('#tie').addClass('active');
            $('#shirt').removeClass('active');
            $('#dress').removeClass('active');
            $('#pants').removeClass('active');
            $('#socks').removeClass('active');
            
        } else if(activeType == 3){
            $('#jacket').removeClass('active');
            $('#tie').removeClass('active');
            $('#shirt').addClass('active');
            $('#dress').removeClass('active');
            $('#pants').removeClass('active');
            $('#socks').removeClass('active');
            
        } else if(activeType == 4){
            $('#jacket').removeClass('active');
            $('#tie').removeClass('active');
            $('#shirt').removeClass('active');
            $('#dress').addClass('active');
            $('#pants').removeClass('active');
            $('#socks').removeClass('active');
            
        } else if(activeType == 5){
            $('#jacket').removeClass('active');
            $('#tie').removeClass('active');
            $('#shirt').removeClass('active');
            $('#dress').removeClass('active');
            $('#pants').addClass('active');
            $('#socks').removeClass('active');
            
        }else if(activeType == 6){
            $('#jacket').removeClass('active');
            $('#tie').removeClass('active');
            $('#shirt').removeClass('active');
            $('#dress').removeClass('active');
            $('#pants').removeClass('active');
            $('#socks').addClass('active');
        } 
    }
}
}
