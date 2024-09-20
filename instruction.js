document.addEventListener("DOMContentLoaded", function () {

const instructionPage=document.querySelector(".instruction-page");
const homePage=document.querySelector(".home-page");

const instructionPageButton=document.querySelector("#start-btn");
// const startQuiz=document.querySelector("#start");
const CancelQuiz=document.querySelector("#cancel");



instructionPageButton.addEventListener("click",function(){
   
const name=document.querySelector('input[name="name"]').value;

if (name.trim() !== "") {
    instructionPageButton.disabled=false;

const welcomeCandidate=document.querySelector(".welcome-name");

    homePage.style.display = "none";
    instructionPage.style.display="block";
    welcomeCandidate.innerHTML=`Welcome ${name.trim()},`
}
   });

// startQuiz.addEventListener("click",function(){

// })

CancelQuiz.addEventListener("click",function(){
 instructionPage.style.display="none";
 homePage.style.display="flex";

const name=document.querySelector('input[name="name"]');
name.value="";

});

});