const fileDropArea = document.querySelector(".file-input-container");
const dropText = document.querySelector(".file-drop-text");
const invalidFileWarning = document.querySelector(".invalid-warning");
let imagePresent = false;
let files;

// deal with hover effect for image drop
fileDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropText.classList.add("hover");
});
  
  fileDropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropText.classList.remove("hover");
});


// executes changes when a file is dropped
fileDropArea.addEventListener("drop", (e) => {
    if(imagePresent){return;}
    
    e.preventDefault();
    files = e.dataTransfer.files;
    if (files[0].type === "image/jpeg") {
        invalidFileWarning.style.display = "none";
        console.log(files[0]);
        dropText.style.display = "none";
        displayImage(files[0]);
        createChangeButton();
        imagePresent = true;
        sendImage();
    } else 
    {
        console.log("Fail");
        invalidFileWarning.style.display = "block";
    }
    dropText.classList.remove("hover");

});

function sendImage() {
    const data = new FormData();
    data.append('file', files[0]);
    data.append('fileName', files[0].name);

    fetch('https://skinanalysis.azurewebsites.net/api/ImageAnalysis1?code=9g-BzxrrTQlcJXa2CbHCHPlZDRPdLL5Qn4XV23iQ0MtOAzFuEFkLiA==', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function displayImage(jpegFile) {
    let img = document.createElement("img");
    img.src = URL.createObjectURL(jpegFile);
    img.alt = "Uploaded Picture of Skin";
    img.classList.add("uploaded-image");
    dropText.style.display = "none";
    fileDropArea.appendChild(img);
}
  
// creates a "change image" button. Called when a JPEG file is dropped. Attaches an event listener that reverts fileDropArea
// to previous state when clicked;

function createChangeButton() {
    let button = document.createElement("button");
    button.innerText = "Change Image";
    button.classList.add("change-image-btn");

    button.addEventListener("click", () => {
      let img = document.querySelector(".uploaded-image");
      fileDropArea.removeChild(img);
      fileDropArea.removeChild(button);
      dropText.style.display = "flex";
      imagePresent = false;
    });

    fileDropArea.appendChild(button);
}