 /*The p5 sound library has been added to this game project which is used to add sound to the game.Enemies in the form of eyes are made that follows the game char, The anti-gravity shelves are made which makes the game char float if it is over them,they are activated when you hit the space bar standing over them.The shadow of the game char is dynamic. The most difficult part for me was sometimes i keep forgetting the draw itself is a loop so if you create a loop there there is a chance of going into infinite loop which can ruin the overall experience of the game and moreover game can become unplayable.the skills i learned/practiced by implementing is calling a function inside a function and in general the use of the functions to reduce the length of overall length of the code.i learned the importance of commenting your code so that when you reread it after sometime you dont stuck understanding your own code.*/


/*declaring global variables*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var scrollPos;
var clouds=[];
var mountains=[];
var trees=[];
var canyons=[];
var collect=[];
var worldx = 0;
var fallen;
var scorecounter=0;
var lives=3;
var gameover=false;
var reached=false;
var sumlives;
var timer=5;
var fr;
var enemy=[];
var backgroundsound;
var shelves=[];
var move=0;
var shelfz={};/*anti gravity shelves*/
function preload(){    /*preloading the soung files*/
    soundFormats('mp3', 'ogg');
    backgroundsound=loadSound('bgsound.mp3');
    backgroundsound.setVolume(5);
    
}
function touchStarted() {    /*declaring gesture context*/
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
function setup(){
    touchStarted();   /*starting the sound after the user gesture*/
    createCanvas(1024,576);
    floorPos_y=height*3/4;
    gameChar_x=width/2;
    gameChar_y=floorPos_y;
    // Boolean variables to control the movement of the game character.
        isLeft = false;
        isRight = false;
        isFalling = false;
        isPlummeting = false;
    // Variable to control the background scrolling.
        scrollPos = 0;
    // Initialise arrays of scenery objects.
for(var i=0; i<90; i++){
         clouds[i]={x:i*200,y:100};/*Using for loop to create multiple    objects*/
                }
    for(var i=0;i<9;i++){
        trees[i]={x:480*i,y:floorPos_y}
    }
    for(var cx=0;cx<9;cx++){
       canyons[cx]={x:650+(cx*500),
                    y:floorPos_y,
                    checklives:1};}
    for(var m=0;m<50;m++){
       mountains[m]={x:m*200,y:height/4,height:random(90,200)};

        }
    for(var clt=0;clt<9;clt++){
        collect[clt]={x:(clt*500+90),y:400,iscollected:false,foradding:0};
        
                }
    
    
    spaceship={xpos:5047,ypos:floorPos_y,isReached:false}
/*  for (var em=0;em<5;em++) {enemy[em]={x:200+(em*750),y:floorPos_y-90,size:50};}* this could be the alternate way to implements the enemies*/
    function fenemies(x,y,size){/*constructor function*/
        this.x=x;
        this.y=y;
        this.size=size;
        
        return this;
    } 
    enemy.push(new fenemies(200,floorPos_y-90,50));
    for (var em=0;em<7;em++){/*for creating /constructing multiple enemies*/
        enemy.push(new fenemies(200+em*750,floorPos_y-90,50))
    }
    
    
    
  backgroundsound.play();  /*playing the music*/
    backgroundsound.loop();  /*looping the music*/
    
}
function draw(){
  /*sheves movement*/
    move=move+1;
 if(move>=50){
     move=move-50;
 }
    
    
    
    if(lives<1){   /*condition for game over*/
            gameover=true;
        }
background(174,176,189); /*fill the sky */
        noStroke();
        fill(0,155,0);
        rect(0,floorPos_y,width,height/4);/*draw some green ground*/
        fill(71,69,3)
        rect(0,floorPos_y+50,width,height/4 + 50);
        fill(255);
    textStyle(BOLD);
        textSize(35);
        
        text("Score"+" -- "+scorecounter,width/2,40);
        text("Lives"+"  -- "+ lives,width/2,75);
    
push();
translate(scrollPos,0);    
//draw cloud
cloud();
//draw mountain
mountain();
//draw tree    
tree();
 /*creating anti-gravity shelves*/
   shelfz.build();
    shelfz.drawing();
    shelfcheck(); 
//draw canyon
drawCanyon();
//draw collectable
drawCollectable();
//draw spaceship
spaceshipx();
    /*draw enemies*/
    enemies();
    
    
pop(); 
//check collectable has been collected or not
 checkCollectable();  
//draw game character
gamecharacter(); 
//check if gamecharacter has fallen in a canyon
 checkCanyon();
    //check if character has touched the enemy
 checkenemyt();
    
    
    
    
/*for gravity and falling*/
                
if(isPlummeting &&(floorPos_y- gameChar_y)<5){
         
        
        gameChar_y=gameChar_y-70; 
       
        
        
    }
    if(shelfcheck()==true){/*checking for anti-gravity*/
           if(isPlummeting && isFalling&&gameChar_y>300  ) {
         
        
        gameChar_y=gameChar_y-50 ; 
       
        
        
    }
            
       }
    if(gameChar_y<floorPos_y && shelfcheck()==false){/*gravity*/
            gameChar_y=gameChar_y+2 ;
        }

    if(isRight==true){
        {
                if(gameChar_x < width * 0.8)
                {
                    gameChar_x  += 5;
                }
                else
                {
                    scrollPos -= 5; // negative for moving against the background
                }

            }
    }  
    if (isLeft==true){
         {
                if(gameChar_x > width * 0.2)
                {
                    gameChar_x -= 5;
                }
                else
                {
                    scrollPos += 5;
                }
            }

    }
 scorecounter=0;
        if (gameover==true){/*for end screen and stoping the music*/
            background(0);
            fill(255);
            text("Game Over,press f5 to play",width/2-90,height/2);
            backgroundsound.stop();

        }
for(var checkcollect=0;checkcollect<collect.length;checkcollect++){      scorecounter=scorecounter+collect[checkcollect].foradding;
        if(collect[checkcollect].iscollected==true){
            collect[checkcollect].foradding=1;
        }/*for score keeping*/

}if(worldx >= 5000){/*when the character reach the spaceship*/
            reached=true;
            backgroundsound.stop();
        }
if(worldx>5000||reached==true){
    background(0);
    fill(255);
    text("Thanks for helping Drop reaching his spaceship ",width/2-500,height/2);
}
        //function to draw clouds
function cloud (){
    for(var fclds=0;fclds<clouds.length;fclds++){
        fill(255);
        ellipse(clouds[fclds].x,100,50,30);
        ellipse(clouds[fclds].x+30,100,30,20);
        ellipse(clouds[fclds].x+50,clouds[fclds].y,20,10);
}}
// Function to draw mountains objects.
function mountain(){
for(var x=0;x<mountains.length; x++){
    fill(50,50,0);
triangle(mountains[x].x,floorPos_y,mountains[x].x+200,floorPos_y,mountains[x].x+100,floorPos_y-mountains[x].height);
                
                  } }
//function to draw trees
    function tree(){
        for(var tr=0;tr<trees.length;tr++){
             fill(100,50,0)
             rect(trees[tr].x-14,trees[tr].y-90,20,95);
             fill(50,200,50);
             ellipse(trees[tr].x-14+9,trees[tr].y-85,50,90);
             ellipse(trees[tr].x-14+9,trees[tr].y-124,50,90)
                }  }
//fuction to create canyons
function drawCanyon(){
 for(var f=0;f<canyons.length;f++){
            fill(50,50,0);
            rect(canyons[f].x,floorPos_y,75,165); 
            fill(0,0,255);
            ellipse(canyons[f].x+38,floorPos_y+140,75,140);
            rect(canyons[f].x,floorPos_y+75,75,140);
        }}/*function to draw the spaceship*/
function spaceshipx(){
        fill(100,100,100);
        ellipse(spaceship.xpos,spaceship.ypos,100,50);
        fill(255,0,0);
        ellipse(spaceship.xpos,spaceship.ypos-10,50,50)
    }
                //function to add game character
    function gamecharacter()
    {
         if(isLeft && isFalling)
        {
             fill(0,99,209)
        ellipse(gameChar_x-4,gameChar_y-37,41,40)
        ellipse(gameChar_x-5,gameChar_y-37,41,40)
        fill(255,248,198)
        ellipse(gameChar_x-14,gameChar_y-48,14,14)
        ellipse(gameChar_x-14,gameChar_y-48,14,14)
    // add your jumping-left code

        }
        else if(isRight && isFalling)
        {fill(0,99,209)
        ellipse(gameChar_x+3,gameChar_y-37,41,40)
        ellipse(gameChar_x+5,gameChar_y-37,41,40)
        fill(255,248,198)
        ellipse(gameChar_x+14,gameChar_y-48,14,14)
        ellipse(gameChar_x+13,gameChar_y-48,14,14)
            // add your jumping-right code

        }
        else if(isLeft)

        {if(gameChar_y==floorPos_y) {fill(32,32,32);
        ellipse(gameChar_x+9,gameChar_y+1,35,5);}
        fill(0,99,209)
        ellipse(gameChar_x-5,gameChar_y-11,40,29)
        ellipse(gameChar_x-4,gameChar_y-11,35,29)
        fill(255,248,198)
        ellipse(gameChar_x-16,gameChar_y-15,14,14)
        ellipse(gameChar_x-15,gameChar_y-15,14,14)

            // add your walking left code

        }
        else if(isRight)
        {if(gameChar_y==floorPos_y) {fill(32,32,32);
        ellipse(gameChar_x-7,gameChar_y+1,35,5);}
        fill(0,99,209)
        ellipse(gameChar_x+5,gameChar_y-11,40,29)
        ellipse(gameChar_x+5,gameChar_y-11,35,29)
        fill(255,248,198)
        ellipse(gameChar_x+13,gameChar_y-17,14,14)
        ellipse(gameChar_x+13,gameChar_y-16,14,14)
            // add your walking right code

        }
        else if(isFalling || isPlummeting)
        {fill(0,99,209)
        ellipse(gameChar_x,gameChar_y-48,40,48)

        fill(255,248,198)
        ellipse(gameChar_x,gameChar_y-60,14,21)
            // add your jumping facing forwards code

        }
        else
        {if(gameChar_y==floorPos_y){
        fill(32,32,32);
        ellipse(gameChar_x,gameChar_y+3,35,5);}
        fill(0,99,209)
        ellipse(gameChar_x,gameChar_y-14,40,35)
        //ellipse(gameChar_x+2,gameChar_y-14,40,35)
        fill(255,248,198)
        //ellipse(gameChar_x+2,gameChar_y-25,14,14)
        ellipse(gameChar_x,gameChar_y-25,14,14)
        }
        // add your standing front facing code
    // update the worldx position which is relative position of gamechar
        worldx=gameChar_x-scrollPos;
    }
//function to check if character is over a canyon
    function checkCanyon(){
        for(var flln=0;flln<canyons.length;flln++){
        if (canyons[flln].x-worldx<=9&&canyons[flln].x+75-worldx<59&&gameChar_y>=floorPos_y&&canyons[flln].x+75-worldx>=0){
            gameChar_y=gameChar_y+5 ;
            canyons[flln].checklives=0;
         lives=lives-1;
        reset();
        
        }
            
           

        }
    }
    
    
    /*for checking for total lives*/
    
    for(var flnl=0;flnl<canyons.length;flnl++){
        sumlives=sumlives+canyons[flnl].checklives
    }
    if (sumlives<6){
        lives=0;
    }
    /*function to check wheather character has touched the enemy*/
    function checkenemyt(){
        for(var ckt=0;ckt<enemy.length;ckt++){
            if(dist(enemy[ckt].x+90,enemy[ckt].y,worldx,gameChar_y)<50){
                 lives=lives-1;
                reset();
            }}
        
    }
    
    
    
    }/*Draw ending bracket*/
//function to drawcollectables
    function drawCollectable(t_collectable)
        {
        for(var fx=0; fx<collect.length; fx++){
            if(collect[fx].iscollected==false){
                 fill(255,248,198);
                 stroke(0,99,209);
                 ellipse(collect[fx].x,400,26,24);
                 fill(0,99,209);
                 rect(collect[fx].x,395,5,9); }}
        }

        // Function to check character has collected an item.


        function checkCollectable()
        {
            for(var collx=0;collx<collect.length;collx++){
             if(dist(collect[collx].x,400,worldx,gameChar_y)<50){
                 collect[collx].iscollected=true;



             }

             }
        }
function enemies(){                      /*function to make enemies*/
  
for(var em=0;em<enemy.length;em++){
    fill(255);
  stroke(0);
      ellipse(enemy[em].x+90,
              enemy[em].y,
              enemy[em].size,
              enemy[em].size);
    fill(0);
ellipse(constrain(worldx,enemy[em].x+78 ,enemy[em].x+99),
        enemy[em].y,
        26,
        26);
      

}

}


shelfz={ /*anti-gravity shelves creating and drawing*/
    build:function(){ for(var i=0;i<9;i++){
        shelves[i]=i*500;
        
    }},
    drawing:function(){
                 
                 
                 
    for(i=0;i<shelves.length;i++)
{      fill(140,172,191)
    ellipse(shelves[i],floorPos_y-move,50,5);
    ellipse(shelves[i],floorPos_y-move-9,50,5);
    ellipse(shelves[i],floorPos_y-move-50,50,5);
    ellipse(shelves[i],floorPos_y-move-35,50,5);
    ellipse(shelves[i],floorPos_y-move-26,50,5);

}}}

function shelfcheck(){/*checking if game char is over anti-gravity shelf*/
    for(i=0;i<shelves.length;i++){
        if((shelves[i]-worldx)<=25 &&(shelves[i]-worldx)>-25&&(floorPos_y-gameChar_y)>0){
            return true;
            
        }
    }
    return false;
    
}






function reset(){           /*function to reset the game*/
    
     fr=second();
    if(fr<second()+9){
        background(0,0,0);
        fill(255);
        text("lives"+lives,width/2,height/2);
    }
    gameChar_x=width/2;
    gameChar_y=floorPos_y;
}





               
               
               
               
//function to key control
    function keyPressed(){
       /*getting the audio context*/
        getAudioContext().resume()
     

           
            if(keyCode==39||keyCode==68){
                isRight=true;
            }

            if(keyCode==37||keyCode==65){
                isLeft=true;
            }
    if(keyCode==32){
        isPlummeting=true;
        isFalling=true;
        }
        }
        function keyReleased()
        {

            
            if(keyCode==39||keyCode==68){
                isRight=false;
            }
            if(keyCode==32){
        isPlummeting=false;
            isFalling=false;}

            if(keyCode==37||keyCode==65){
                isLeft=false;
            }

        }