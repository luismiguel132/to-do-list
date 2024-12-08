const themeSwitch = document.getElementById('themeSwitch');

themeSwitch.addEventListener('change', function(){
    if(this.checked){
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
});