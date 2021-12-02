let userName = document.getElementById("input-name") ; 
let startBtn = document.querySelector(".control-btn span") ; 
let nameSection = document.querySelector(".name span");
let timer = document.querySelector(".timer span")
let warnSound = document.getElementById("warn") ; 
let tries = document.querySelector(".tries span") ; 
let bestName = document.querySelectorAll(".best-name") ;
let bestScore = document.querySelectorAll(".best-score") ; 
let level = document.getElementsByName("level")
startBtn.onclick = ()=> {
    if(userName.value != "" && isValid(userName.value) && (level[0].checked || level[1].checked || level[2].checked )){
        // play start sound
        for(let i = 0 ; i<level.length ; i++){
            if(level[i].checked){
                timer.innerHTML = level[i].dataset.time
            }
        }
        document.getElementById("start").play()
        // start game and timer
        setTimeout(()=>{
            startBtn.parentElement.classList.add("hide") ; 
            nameSection.innerHTML = userName.value ;
            handler = window.setInterval(()=>{     
                timer.innerHTML--
                if(timer.innerHTML <= 10){
                    // play warn sound
                    warnSound.play() ; 
                    if(timer.innerHTML == 0){
                        //stop timer and sound
                        window.clearInterval(handler)
                        warnSound.pause() 
                        warnSound.currentTime = 0 ; 
                        if(!checkIsWin()){
                            let popUpLose = document.querySelector(".pop-up.lose") ; 
                            popUpLose.classList.remove("hide") ; 
                            if(localStorage.bestScore != undefined){
                                bestName[0].innerHTML = localStorage.bestName ; 
                                bestName[1].innerHTML = localStorage.bestName ; 
                                bestScore[0].innerHTML = localStorage.bestScore ; 
                                bestScore[1].innerHTML = localStorage.bestScore ; 
                            }else{
                                bestName[0].innerHTML = "Loser" ; 
                                bestName[1].innerHTML = "Loser" ; 
                                bestScore[0].innerHTML = 0 ; 
                                bestScore[1].innerHTML = 0 ; 
                            }
                        }
                    }
                }
            },1000)       
        },500) 
        

    }
}

function isValid(userName){
    let allowedChar = "abcdefghijklmnopqrstuvwxyz_"
    return ( userName ==  userName.split("").filter((char)=> allowedChar.indexOf(char.toLowerCase()) != -1 ).join("") ) && (!userName.startsWith("_") && ! userName.endsWith("_"))
}

// Prepare variables 

let duration = 300 ; 
let containerGame= document.querySelector(".game-block") ; 
let boxes = Array.from(containerGame.children) ; 
let orderRange = [...Array(boxes.length).keys()] ; 
// randomArray = [18,15,14,1,5,9,4,3,0,19,11,10,7,8,6,2,12,16,13,17]  
randomArray = generateArray(orderRange)
let cuurentBoxes = []
boxes.forEach((box , i)=>{
    box.style.order = randomArray[i]  ;
    box.onclick = ()=>{
        swapBoxes(box)
        
    } 
})
function generateArray(arr){
    for(let i = 0 ;  i< arr.length ; i++){
        randomIndex = Math.floor(Math.random()*orderRange.length) ;  
        let aux = arr[randomIndex] ; 
        arr[randomIndex] = arr[i] ; 
        arr[i] = aux
    }
    return Array.from(arr)
}
function swapBoxes(box){
    box.classList.add("is-rotated") ; 
    let allRotatedBoxes = document.querySelectorAll(".is-rotated") ; 
    if(allRotatedBoxes.length ==2){
        // stop cliking 
        containerGame.classList.add("stop") ; 

        setTimeout(()=>{
            containerGame.classList.remove("stop")
        },duration)

        // check if matched

        check(allRotatedBoxes[0],allRotatedBoxes[1])
    }
}
function check(firstBox,secondBox){
    if(firstBox.dataset.tech == secondBox.dataset.tech){
        firstBox.classList.remove("is-rotated") ; 
        secondBox.classList.remove("is-rotated") ; 
        firstBox.classList.add("done") ; 
        secondBox.classList.add("done") ; 
        if(checkIsWin()){
            window.clearInterval(handler)
            warnSound.pause() 
            warnSound.currentTime = 0 ; 
            score = calcScore() 
            let popUpWin = document.querySelector(".pop-up.win") ; 
            popUpWin.classList.remove("hide") ; 
            document.querySelector(".score span").innerHTML = score ;
            if(localStorage.bestScore){
                if(score > localStorage.bestScore){
                    localStorage.bestScore = score 
                    localStorage.bestName = userName.value ; 
                }

            }else{
                localStorage.bestScore = score 
                localStorage.bestName = userName.value ;
            }
            bestName[0].innerHTML = localStorage.bestName ; 
            bestName[1].innerHTML = localStorage.bestName ; 
            bestScore[0].innerHTML = localStorage.bestScore ; 
            bestScore[1].innerHTML = localStorage.bestScore ; 
        }else{
            document.getElementById("success").play() 
            timer.innerHTML = +timer.innerHTML +3;
            warnSound.currentTime += 3
            // show +3s 
            timer.parentElement.classList.add("show") ; 
            window.setTimeout(()=>{
                timer.parentElement.classList.remove("show") ; 
            },1200)
        }
    }else{
        tries.innerHTML++ ; 
        window.setTimeout(()=>{
            firstBox.classList.remove("is-rotated") ; 
            secondBox.classList.remove("is-rotated") ; 
        },duration)
        document.getElementById("fail").play()
    }
}

function checkIsWin(){
    let doneBoxes = document.querySelectorAll(".done") ; 
    return doneBoxes.length == boxes.length ;  
}

function calcScore(){
    for(let i = 0 ; i< level.length ; i++){
        if(level[i].checked){
            // return Math.round(( / 10)  - (tries.innerHTML)) * 100
            return  (( timer.innerHTML / level[i].dataset.time ) * 1000   - tries.innerHTML*5 )   
        }
    }
}