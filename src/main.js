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

let temp = "";

window.begin = async function begin(){
    document.getElementById("bd").remove();

    let nBody = document.createElement("body");
    document.documentElement.appendChild(nBody);

    let h1 = document.createElement("H2");
    h1.id="intro";
    h1.textContent="Challenge 1: ";
    nBody.appendChild(h1);

    temp = await readFile("1_Challenge/description.txt");
    document.getElementById("intro").insertAdjacentHTML('beforeend',temp);

    let codeInp = document.createElement("textarea");
    codeInp.id="code";
    codeInp.style.width="700px";
    codeInp.style.height="300px";
    codeInp.style.resize="none";
    nBody.appendChild(codeInp);

    temp = await readFile("1_Challenge/startCode.txt");
    document.getElementById("code").innerHTML = temp;

    let bttn = document.createElement("button");
    bttn.textContent = "Compile and Test";
    bttn.onclick=test;
    nBody.appendChild(bttn);

    let h2 = document.createElement("H2");
    h2.id="info";
    nBody.appendChild(h2);
}

window.test = async function test() {
    document.getElementById("info").innerHTML="";
    let code = document.getElementById("code").value;

    if (code === "") {
        document.getElementById("info").innerHTML = "Please enter code";
        return null;
    }

    let input="";
    let output="";

    input = await readFile("1_Challenge/inputs.txt");
    output = await readFile("1_Challenge/testOutputs.txt");

    input = input.split(/\r?\n/);
    output = output.split(/\r?\n/);

    for(let i = 0; i<5; i++) {
        if(await build(input[i],output[i])){
            document.getElementById("info").insertAdjacentHTML('beforeend', "Test "+(i+1)+" passed\n");
        }
        else
            document.getElementById("info").insertAdjacentHTML('beforeend', "Test "+(i+1)+" failed\n");
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
                'X-RapidAPI-Key': '7f5ebdc991msh779918a8b5d23a9p10d434jsne9e7e4a1586e',
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






