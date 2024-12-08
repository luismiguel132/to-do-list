function changeBackground(){
    const inputBackground = document.getElementById('backgroundInput');
    if(inputBackground){
        document.body.style.background = `url(${inputBackground.value})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
    } else {
        document.body.style.background = 'url(background1.jpg)';
    }
}

function changeBackgroundRadio(){
    const selectedBackground = document.querySelector('input[name="background"]:checked');
    if(selectedBackground){
        document.body.style.background = `url(${selectedBackground.value})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
    }
}