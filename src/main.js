/*import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

createApp(App).mount('#app')*/

import {initializeApp} from "firebase/app";
import {getDownloadURL, getStorage, ref} from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDmVtoKgte0L6FQyUH7aLZMfgJTAoAHAvU",
    authDomain: "code-testingdemo.firebaseapp.com",
    projectId: "code-testingdemo",
    storageBucket: "code-testingdemo.appspot.com",
    messagingSenderId: "845610468067",
    appId: "1:845610468067:web:8495cd1f84bdc87ec2fbd6",
    measurementId: "G-Z90BJ93LVW"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

let nBody;
let temp = "";
let chall ="";
let challCompleted = 0;
let challenges = ['1', '2', '3', '4', '5'];

window.begin = async function begin(){
    chall = random();
    document.getElementById("bd").remove();

    nBody = document.createElement("body");
    nBody.id = "bd";
    document.documentElement.appendChild(nBody);

    let h1 = document.createElement("H2");
    h1.id="intro";

    h1.textContent="Challenge "+chall.charAt(0)+": ";

    nBody.appendChild(h1);

    temp = await readFile(chall+"description.txt");

    document.getElementById("intro").insertAdjacentHTML('beforeend',temp);

    let codeInp = document.createElement("textarea");
    codeInp.id="code";
    codeInp.style.width="700px";
    codeInp.style.height="300px";
    codeInp.style.resize="none";
    codeInp.autocomplete="off";
    nBody.appendChild(codeInp);

    temp = await readFile(chall+"startCode.txt");

    document.getElementById("code").innerHTML = temp;

    let bttn = document.createElement("button");
    bttn.textContent = "Compile and Test";
    bttn.id = "btn";
    bttn.onclick=test;
    nBody.appendChild(bttn);

    let h2 = document.createElement("H2");
    h2.id="info";
    nBody.appendChild(h2);

    let h3 = document.createElement("H3");
    h3.id="score";
    h3.textContent = "Score: 0";
    nBody.appendChild(h3);
}

window.test = async function test() {
    document.getElementById("info").innerHTML="";
    let code = document.getElementById("code").value;

    if (code === "") {
        document.getElementById("info").innerHTML = "Please enter code";
        return null;
    }

    let input;
    let output;

    input = await readFile(chall+"inputs.txt");
    output = await readFile(chall+"testOutputs.txt");

    input = input.split(/\r?\n/);
    output = output.split(/\r?\n/);

    let pass = 0

    for(let i = 0; i<5; i++) {
        if(await build(input[i],output[i])){
            document.getElementById("info").insertAdjacentHTML('beforeend', "Test "+(i+1)+" passed\n");
            pass++;
        }
        else
            document.getElementById("info").insertAdjacentHTML('beforeend', "Test " + (i + 1) + " failed\n");

        if(pass===5){
            document.getElementById("info").textContent="All tests passed, next challenge!";
            await next();
        }
    }
    }

    function build(input,output){
    return new Promise((resolve, reject) => {
        const encodedParams = new URLSearchParams();
        let code = document.getElementById("code").value;

        encodedParams.append("code", code);
        encodedParams.append("language", "py");
        encodedParams.append("input", input);

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '',
                'X-RapidAPI-Host': 'codex7.p.rapidapi.com'
            },
            body: encodedParams
        };

        fetch('https://codex7.p.rapidapi.com/', options)
            .then(response => response.json())
            .then(data => {
                let codeOutput = data.output;
                codeOutput = codeOutput.toLowerCase().replace(/(\r\n|\n|\r)/gm, "");
                resolve(codeOutput === output);
            })
            .catch(err => reject(err));
    });
}



window.readFile = function readFile(path) {
    let pathReference = ref(storage, path);
    return getDownloadURL(pathReference)
        .then(function (url) {
            return fetch(url);
        })
        .then(function (response) {
            return response.text();
        })
        .catch(function (error) {
            console.error(error);
        });
}

//Generates a random challenge (1-5)
window.random = function random(){
    //Picks a random challenge number from the global array challenges
    const randomIndex = Math.floor(Math.random() * challenges.length);
    //Store that random challenge number and delete it from the array so no repetition occurs
    const randomChallenge = challenges.splice(randomIndex, 1)[0];
    console.log(challenges);
    return randomChallenge+"_Challenge/";
}

window.next = async function next() {
    challCompleted++;
    document.getElementById("score").textContent="Score: "+challCompleted;
    if (challCompleted === 5) {
        //Resetting play data if user wants to play again
        challCompleted = 0;
        challenges = ['1', '2', '3', '4', '5'];

        //Remove everything from the screen
        document.getElementById("intro").remove();
        document.getElementById("code").remove();
        document.getElementById("btn").remove();
        document.getElementById("info").remove();

        //Generate a congratulations screen and a button to play again.
        let h1 = document.createElement("H1");
        h1.textContent="Congratulations noob, you've passed all the challenges, consider yourself a true MAGA Python pro!"
        nBody.appendChild(h1);

        let bt = document.createElement("button");
        bt.textContent = "Play Again?";
        bt.onclick = begin;
        bt.style.fontSize="50px";

        nBody.style.textAlign="center"
        nBody.appendChild(bt);

    } else {
        chall = random();
        document.getElementById("intro").textContent = "Challenge " + chall.charAt(0) + ": ";

        temp = await readFile(chall + "description.txt");
        document.getElementById("intro").insertAdjacentHTML('beforeend', temp);

        temp = await readFile(chall + "startCode.txt");
        document.getElementById("code").value = temp;
    }
}






