      var colors={pink:"rgb(181,42,142)", black:"black",         ivory1:"rgb(244,255,173)", red_light:"rgb(227,102,79)", blue1:"rgb(42,40,143)",
	              blue2:"rgb(0,173,147)",   red1:"rgb(222,33,49)",violet1:"rgb(90,24,120)",     ivory2:"rgb(247,194,119)", 
				  violet_light:"rgb(122,135,191)", blue3:"rgb(79,168,219)", ivory3:"rgb(250,147,95)", blue4:"rgb(39,105,176)",
				  brown:"rgb(135,26,35)", sea:"rgb(0,110,110)"};
	  var colorsArr=[colors.pink,colors.pink,colors.pink,colors.black, colors.black, colors.ivory1, colors.ivory1, colors.ivory1, colors.red_light, colors.red_light,
	                 colors.blue1, colors.blue1, colors.blue1, colors.blue2, colors.blue2, colors.blue2, colors.sea, colors.sea, colors.brown, colors.brown, 
					 colors.violet1, colors.violet1, colors.violet1, colors.ivory3, colors.ivory3, colors.violet_light, colors.violet_light, colors.violet_light, colors.blue3,  colors.blue3,
					 colors.ivory2, colors.ivory2, colors.blue4, colors.blue4, colors.red1, colors.red1];			 
	  var score=0;
	  var moves_score=0;
	  var Quadr;
	  var dragHoldX;
	  var dragHoldY;	
	  var canvas = document.getElementById('myCanvas');
	  var ctx = canvas.getContext('2d');
	  
	  var direction=null;
	  var rc=-1; //row or column
	  var moves_num=10;
	  var count_moves=0;
	  var timer;
	  var count;
	  var delta;
	  
      var best=window.localStorage.getItem("best-vasarely");
	  if(!best)
		  best=0;
	  document.getElementById('best-container').innerHTML=best;
	  
	  var cells=6;   //cells x cells in game table

	  var table=CreateTable();
	  var shapes_in= CreateShapes();
	  
	  StartGame();
      
function CreateTable()
{
	  var ColorsUsed=new Array(colorsArr.length);
	  for (var i=0; i<ColorsUsed.length; i++)
		  ColorsUsed[i]=0;
	  
      var Table=[cells];
	  for (var i=0; i<cells; i++)
		  Table[i]=[cells];
	  for (var i=0; i<cells; i++)
		  for (var j=0;j<cells; j++)		 			  
		    Table[i][j]=new Object();
		 

 return Table;		
}

function CreateShapes()
{
  var Shapes =[cells];
  for (var i=0; i<cells; i++)  
	  Shapes[i]=[cells];
  for (var i=0; i<cells; i++)
	  for (var j=0; j<cells; j++)
		  Shapes[i][j]=new Object();

return Shapes;		
} 

function Init()
{
	colors.pink="rgb(181,42,142)";
	  colors.black="black",
	  colors.ivory1="rgb(244,255,173)";
      colors.red_light="rgb(227,102,79)";
      colors.blue1="rgb(42,40,143)";
	  colors.blue2="rgb(0,173,147)";
      colors.red1="rgb(222,33,49)";
      colors.violet1="rgb(90,24,120)";
      colors.ivory2="rgb(247,194,119)";
	  colors.violet_light="rgb(122,135,191)";
      colors.blue3="rgb(79,168,219)";
      colors.ivory3="rgb(250,147,95)";
      colors.blue4="rgb(39,105,176)";
	  colors.brown="rgb(135,26,35)";
      colors.sea="rgb(0,110,110)"

	  
	var ColorsUsed=new Array(colorsArr.length);
	var found=false;  
	for(loop=0; loop <10 && found==false; loop++)
	{
	    for (var i=0; i<ColorsUsed.length; i++)
		  ColorsUsed[i]=0;
	  
	    for (var i=0; i<cells; i++)
		  for (var j=0;j<cells; j++)
		  {	
	  
			var ind = Math.floor(Math.random() * colorsArr.length);
			found=false;
			for (var count=0; count<colorsArr.length; count++)
			{
			 if(ColorsUsed[ind]==0 && (i==0 || i>0&& table[i-1][j].clr!=colorsArr[ind]) 
           				           && (j==0 || j>0&& table[i][j-1].clr!=colorsArr[ind]) )
								   {
									  found=true;
				                      break;
			                       }
			 ind=(ind+1)%ColorsUsed.length;
		    }
			table[i][j].clr=colorsArr[ind];
			ColorsUsed[ind]=1;
		  }
	}
	var found=false;  
	for(loop=0; loop <8 && found==false; loop++)
	{
	for (var i=0; i<ColorsUsed.length; i++)
		  ColorsUsed[i]=0;
	  
	for (var i=0; i<cells; i++)
	  for (var j=0; j<cells; j++)	
	  {
		  shapes_in[i][j].fixed=false;
		  var ind = Math.floor(Math.random() * colorsArr.length);
		  var found=false;
		  for (var count=0; count<cells*cells; count++)
		  {
		    if(ColorsUsed[ind]==0 && colorsArr[ind]!==table[i][j].clr) 
			{		
                found=true;		
				break;
			}
			ind=(ind+1)%ColorsUsed.length;
		  }
		  
		  shapes_in[i][j].clr=colorsArr[ind];
		  ColorsUsed[ind]=1;
      }
	}
	  
}

	  

 	 function StartGame()
	 {
	  RemoveMessage();
	  	  
	  score=0;
	  moves_score=0;
	  level=1;
	  document.getElementById('best-container').innerHTML=best;
	  document.getElementById('score-container').innerHTML=0;
      	
	  Init();
	  draw();

	  canvas.addEventListener("mousedown", mouseDownListener, false);
	  canvas.addEventListener("touchstart", touchStartListener, false);
	}
  
	  function draw()
	  {   
      var size= canvas.width/cells;		 
      var r=size/2 *.75;
	  var q_size=r-2;

      for (var i=0;i<cells;i++)	
	  {
		for (var j=0;j<cells;j++)
		{	
		    ctx.beginPath();			
            ctx.fillStyle = table[i][j].clr;
			ctx.fillRect(j*size,i*size,size,size);
		}
	  }
	  for (var i=0;i<cells;i++)	
	  {
		for (var j=0;j<cells;j++)
		{	
	        if(shapes_in[i][j].fixed===true)
				continue;
			var ct_x;
			var ct_y;
			if(rc===i && (direction==="right" || direction==="left") )
				ct_x=shapes_in[i][j].ct_x;
			else
				ct_x=(j+.5)*size;
			
			if(rc===j && (direction==="up" || direction==="down") )
				ct_y=shapes_in[i][j].ct_y;
			else
				ct_y=(i+.5)*size;
			ctx.beginPath();
			ctx.arc(ct_x, ct_y, r, 0, 2 * Math.PI, false);	
    	    ctx.fillStyle = shapes_in[i][j].clr;
			ctx.fill(); 
		}
	  }	

     }

function touchStartListener(evt){
	
	return mouseDownListener(evt);
}
function mouseDownListener(evt) {
		
		//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
		var bRect = canvas.getBoundingClientRect();
		var clientX= evt.type=="mousedown"? evt.clientX:evt.changedTouches[0].clientX;
		var clientY= evt.type=="mousedown"? evt.clientY:evt.changedTouches[0].clientY;
		mouseX = (clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (clientY - bRect.top)*(canvas.height/bRect.height);
//		document.getElementById('score-container').innerHTML=evt.changedTouches[0].clientX;

		Quadr = whatQuadrant(mouseX,mouseY);
        if( Quadr!=null)
		{
               dragHoldX = clientX;
			   dragHoldY = clientY;				   
		}
		else
			return false;
		
		window.addEventListener("mousemove", mouseMoveListener, false);
		window.addEventListener("touchmove", touchMoveListener, false);
		evt.preventDefault();

		canvas.removeEventListener("mousedown", mouseDownListener, false);
		canvas.removeEventListener("touchstart", touchStartListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		window.addEventListener("touchend", touchEndListener, false);

		return false;
	}

	function touchEndListener(evt){
		return mouseUpListener(evt);  
	}
	
	function mouseUpListener(evt){
		
	    window.removeEventListener("mousemove", mouseMoveListener, false);
		window.removeEventListener("touchmove", touchMoveListener, false);
        canvas.addEventListener("mousedown", mouseDownListener, false);
		canvas.addEventListener("touchstart", touchStartListener, false);		
	}
	
    function touchMoveListener(evt){
		return mouseMoveListener(evt);
	}
	
	function mouseMoveListener(evt) {
		evt.preventDefault();

		//getting mouse position correctly 
		var bRect = canvas.getBoundingClientRect();
		var clientX= evt.type=="mousemove"? evt.clientX:evt.changedTouches[0].clientX;
		var clientY= evt.type=="mousemove"? evt.clientY:evt.changedTouches[0].clientY;
		
		var dif_x=clientX - dragHoldX;
		var dif_y=clientY - dragHoldY;

		if(Math.abs(Math.abs(dif_x)-Math.abs(dif_y))<=3)   // we don't know direction		
			return;
	      
        
		window.removeEventListener("mousemove", mouseMoveListener, false);
		window.removeEventListener("touchmove", touchMoveListener, false);
		
		if( Math.abs(dif_x) > Math.abs(dif_y))                // horisonatl direction
		{
			rc=Quadr[0];
			if( dif_x<0 )
				direction="left";
			else
				direction="right";
		}
		else                                             //vertical direction
		{
			rc=Quadr[1];
			if( dif_y<0 )
				direction="up";
			else
				direction="down";
		}

        if(direction)
		{
			if(count_moves)
				return;
			var sign=1;	 
			if(direction==="up" ||direction==="left")
			sign=-1;
			count_moves=0;
			delta=sign*canvas.width/cells/moves_num;
			timer = setInterval(onTimerTick, 1000/30 );
		}

	}
	

function onTimerTick()
{
	if(count_moves==moves_num)
	{
		count_moves=0;
		clearInterval(timer);
		Move(direction,rc);
		direction=null;
		rc=-1;
		draw();
		return;
	}
	for( var i=0; i<cells; i++ )
	{
	   if( (direction=="right" || direction=="left") && i!= rc)
			continue;
			
		for( var j=0; j<cells; j++ )
		{
			 if((direction=="up" || direction=="down") && j!= rc)
				 continue;
			 
			 var size=canvas.width/cells;
			 if (direction=="right" || direction=="left")
			 {
				if(count_moves===0)			 
					shapes_in[i][j].ct_x=(j+.5)*size;
				else
				    shapes_in[i][j].ct_x+=delta;
			 }
			 else if (j===rc && (direction=="up" || direction=="down"))
             {
				 
				if(count_moves===0)			 
					shapes_in[i][j].ct_y=(i+.5)*size;
				else
				    shapes_in[i][j].ct_y+=delta;
			 }
		}
	}
	count_moves++;
	draw();	
}
	
function Move (direction, rc)   // rc- row or colomn
{
	moves_score++;
	var shapes_cp =[cells];
    for (var i=0; i<cells; i++)  
	  shapes_cp[i]=[cells];
  
	for( var i=0; i<cells; i++ )
		   for( var j=0; j<cells; j++ )
		   {
			   shapes_cp[i][j]=new Object();
               shapes_cp[i][j].clr=shapes_in[i][j].clr;
			   shapes_cp[i][j].fixed=shapes_in[i][j].fixed;
           }

 
    for( var i=0; i<cells; i++ )
	{
		if( (direction=="right" || direction=="left") && i!= rc)
			continue;
		for( var j=0; j<cells; j++ )
		{
			 if(shapes_in[i][j].fixed==true || (direction=="up" || direction=="down") && j!= rc)
				 continue;
			 for(var k=0;k<cells; k++)
		     {
		         var i1,j1;
		        if(direction=="up") 
		        {
		        	i1=(i+k+1)%cells;
		        	j1=j;  
		        }
 		        else if(direction=="right")
		        {
		        	i1=i;
		            j1=(j-k-1+cells)%cells;			    
		        }
		        else if(direction=="down")
		        {
		        	i1= (i-k-1+cells)%cells;
		        	j1=j; 
		        }
				else  // left
				{
					i1=i;
					j1=(j+k+1)%cells;
				}
		        if(shapes_cp[i1][j1].fixed==false)
		        {
		        	shapes_in[i][j].clr=shapes_cp[i1][j1].clr; 
		        	break;
		        }
			 }

			 if( shapes_in[i][j].clr==table[i][j].clr)
			 {
				 shapes_in[i][j].fixed=true;
				 score++;
				 document.getElementById('score-container').innerHTML=score;
	 
	             if(score > best)
	             {
	               best=score;
	               document.getElementById('best-container').innerHTML= best;
	              window.localStorage.setItem("best-vasarely", best)
	             }
				 
				if(EndOfGame()==true)
				{
					messageContainer = document.querySelector(".game-message");
					messageContainer.classList.add("game-over");
					var mes;
					if(score==36)
						mes="Congratulation! You finished with " + moves_score +" moves";
					else
						mes="Out of moves"
					messageContainer.getElementsByTagName("p")[0].textContent =mes;
//					ShareScore();
				} 
		     }
		}

	    }
}

function whatQuadrant(X, Y){
		
	var q=[0,0];
	q[1]=Math.floor(X/canvas.width*cells);
	q[0]=Math.floor(Y/canvas.width*cells);
	if(q[0]>cells-1)
		return null;
	return q;
}
	
function EndOfGame()
{
	for(var i=0;i<cells; i++)
		for(var j=0;j<cells; j++)
		{
			if(!shapes_in[i][j].fixed && CanMeetWithShape(i,j))  	
				return false;
		}
	return true;
}

function CanMeetWithShape(i, j)  //Breadth-first search
{
	/* A Queue object for queue-like functionality over JavaScript arrays. */
	var Queue = function() 
	{
		this.items = [];
	}
	Queue.prototype.enqueue = function(obj)
	{
		this.items.push(obj);
	}
	Queue.prototype.dequeue = function() 
	{
		return this.items.shift();
	}
	Queue.prototype.isEmpty = function()
	{
		return this.items.length === 0;
	}
	
	function Node(i,j)
	{
		this.i=i;
		this.j=j;
	}
	
	var color=table[i][j].clr;
	
	var root=new Node(i,j);
	
	for (var r=0; r<cells; r++)
		for (var c=0; c<cells; c++)
			shapes_in[r][c].visited=false;
		
	shapes_in[i][j].visited=true;	
	
	var queue=new Queue();
	queue.enqueue(root);
	
	while(!queue.isEmpty())
	{
		var current=queue.dequeue();	
		for (var row=0; row<cells; row++)
			if(!shapes_in[row][current.j].fixed && !shapes_in[row][current.j].visited)
			{
				if(shapes_in[row][current.j].clr===color)
			       return true;
				queue.enqueue(new Node(row,current.j));
				shapes_in[row][current.j].visited=true;
			}
		
		for (var col=0; col<cells; col++)
			if(!shapes_in[current.i][col].fixed && !shapes_in[current.i][col].visited)
			{
				if(shapes_in[current.i][col].clr===color)
			        return true;
				queue.enqueue(new Node(current.i,col));
				shapes_in[current.i][col].visited=true;
			}
		
	}	
	return false;	
	
}
function RemoveMessage()
{
		
	  messageContainer = document.querySelector(".game-message");
	  messageContainer.classList.remove("game-over");
      messageContainer.classList.remove("game-continue");  
		
}
	
