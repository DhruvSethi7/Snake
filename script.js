

let lastTime=0
let speed=5
let snakeVelocity={x:0,y:0}
let gameStarted=false
let scoreMilestone=5
const backGroundAudio=new Audio('background.wav')
const eatAudio=new Audio('eat.wav')
const lost=new Audio('lost.wav')
let highestScore=localStorage.getItem('snakeHighestScore')
if (highestScore==null) {
  highestScore=0
}
document.getElementById('highestRecord').innerHTML=`Record: ${highestScore}`

let score=0
let snakeBody=[
    {
    x:8,y:16
}
]
let gameOver=false


let food={
    x:14,
    y:12
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main(ctime) {
    
    if(gameOver)return
    window.requestAnimationFrame(main)
    if(((ctime-lastTime)/1000<(1/speed))){
      
      return
    }
    else{
        lastTime=ctime
        gameEngine()
    }
}

function gameEngine() {
    //generate food and display food
    if (snakeBody[0].x==food.x && snakeBody[0].y==food.y) {
        score++
        document.getElementById('score').innerHTML=`Score: ${score}`
        if (score>0 && score%scoreMilestone==0) {
          speed+=2
           document.getElementById('speed').innerHTML=`Speed: ${speed}`
        }
        eatAudio.play()
        generateFood()
        increaseLength()
    }
    generateSnake()
}

// generateSnake()

function increaseLength() {
    let bodyLength = snakeBody.length;
  
    if (bodyLength === 0) {
      // If for some reason the snake has no body parts, we cannot increase it.
      return;
    }
  
    const lastSegment = snakeBody[bodyLength - 1];
  
    // Default new segment coordinates are set to match the last segment
    let newSegment = { x: lastSegment.x, y: lastSegment.y };
  
    if (bodyLength === 1) {
      // If the snake has only one part, use the snake's velocity to determine where the new segment should be
      newSegment.x -= snakeVelocity.x;
      newSegment.y -= snakeVelocity.y;
    } else {
      const secondLastSegment = snakeBody[bodyLength - 2];
  
      // Determine if the last segment is aligned vertically or horizontally with the second-last segment
      if (lastSegment.x === secondLastSegment.x) {
        // Vertical alignment: change y-coordinate to extend in the opposite direction of movement
        if (lastSegment.y < secondLastSegment.y) {
          newSegment.y -= 1; // Extend upwards
        } else {
          newSegment.y += 1; // Extend downwards
        }
      } else {
        // Horizontal alignment: change x-coordinate to extend in the opposite direction of movement
        if (lastSegment.x < secondLastSegment.x) {
          newSegment.x -= 1; // Extend to the left
        } else {
          newSegment.x += 1; // Extend to the right
        }
      }
    }
  
    snakeBody.push(newSegment);
  
    console.log(snakeBody);
    console.log('Body increased');
  }
  

function generateSnake(){
    const playGround=document.getElementById('playGround')
    if (snakeBody[0].x+snakeVelocity.x==41 || snakeBody[0].x+snakeVelocity.x==-1 || snakeBody[0].y+snakeVelocity.y==-1 || snakeBody[0].y+snakeVelocity.y==26 ) {
      gameLost()
      return
    }
    //removing previous snake
    for (let i = 0; i < playGround.children.length; i++) {
        const element = playGround.children[i];
        if (element.classList.contains('bg-orange-500') ||element.classList.contains('bg-black')) {
           playGround.removeChild(element)
        }
    }
    
    //updating new snakebody and inserting into the playground
    for(let i=snakeBody.length-1;i>=1;i--){
        const element=document.createElement('div')
        element.classList.add('bg-orange-500',`row-start-${snakeBody[i-1].y}`,`col-start-${snakeBody[i-1].x}`)
        playGround.appendChild(element)
        snakeBody[i]={...snakeBody[i-1]}
    }
   
    snakeBody[0].x+=snakeVelocity.x
    snakeBody[0].y+=snakeVelocity.y
    // console.log(snakeBody);
    
    const head=document.createElement('div')
    head.classList.add('bg-black',`row-start-${snakeBody[0].y}`,`col-start-${snakeBody[0].x}`)
    playGround.appendChild(head)
}

function itselfCollide() {
  for (let i = 1; i < snakeBody.length; i++) {
   if (snakeBody[0].x==snakeBody[i].x && snakeBody[0].y==snakeBody[i].y) {
    return true
   }
  }
  return false
}

async function gameLost(){
  gameOver=true
  gameStarted=false
  if (highestScore==null || score>highestScore) {
    highestScore=score
    localStorage.setItem('snakeHighestScore',String(score))
    document.getElementById('highestRecord').innerHTML=`Record: ${highestScore}`
  }
   backGroundAudio.pause()
   snakeBody=[{
    x:8,y:16
}]
speed=5
score=0
snakeVelocity={
  x:0,
  y:0
}
   lost.play()
  //  makeAlert()
}
const foodElement=document.getElementById('foodItem')

function generateFood(){
    foodElement.classList.remove(`row-start-${food.y}`,`col-start-${food.x}`)
    food.x=getRandomNumber(1,40)
    food.y=getRandomNumber(1,25)
    foodElement.classList.add(`row-start-${food.y}`,`col-start-${food.x}`)
}

window.addEventListener('keydown',(e)=>{
   if(!gameStarted){
    for (let i = 0; i < playGround.children.length; i++) {
      const element = playGround.children[i];
      if (element.classList.contains('bg-orange-500') ||element.classList.contains('bg-black')) {
         playGround.removeChild(element)
      }
     }
    document.getElementById('speed').innerHTML=`Speed: ${speed}`
    document.getElementById('score').innerHTML=`Score: ${score}`
    playAudio()
    gameStarted=true
    gameOver=false
    window.requestAnimationFrame(main)
    
   }
   else{

   }
    switch (e.key) {
        case 'ArrowUp':
            snakeVelocity.x=0;
            snakeVelocity.y=-1;
            break;
        case 'ArrowDown':
            snakeVelocity.x=0;
            snakeVelocity.y=1;
            break;
        case 'ArrowLeft':
            snakeVelocity.x=-1;
            snakeVelocity.y=0;
            break;
        case 'ArrowRight':
            snakeVelocity.x=1;
            snakeVelocity.y=0;
            break;
    
        default:
            break;
    }
})



async function playAudio(){
  await backGroundAudio.play()
  if (gameStarted) {
    playAudio()
  }
}
// window.requestAnimationFrame(main)