const mainButton = document.querySelector('.main-button');

document.querySelector('form').onsubmit = (event) => {
    event.preventDefault();
    const inputValue = document.querySelector('#input-text').value;
    mainButton.textContent = inputValue;
}

const applyStyle = ( listClasses, btnClicked) => {
    mainButton.classList.remove(...listClasses);
    const classNow = Array.from (btnClicked.classList)
    .find (className => listClasses.includes(className));

        if (classNow) {
            mainButton.classList.add(classNow);
        }
}

// Gradients y bg colors estan en la misma funcion
const bgGroup = document.querySelectorAll('#bg-div , #degrade-div button');
const bgGroupBtns = ["bg-col-pink", "bg-col-orange", "bg-col-yellow", "bg-col-green", "bg-col-lightblue", "bg-col-purple", "gradient-1", "gradient-2", "gradient-3", "gradient-4", "gradient-5", "gradient-6"];

bgGroup.forEach(btn => {
    btn.addEventListener('click', () => {
        applyStyle( bgGroupBtns, btn);
    });
});

const fontGroup = document.querySelectorAll('#font-div button');
const fontGroupBtns = ["font-arial", "font-verdana", "font-tahoma", "font-times-new-roman", "font-georgia", "font-courier-new"];

fontGroup.forEach(btn => {
    btn.addEventListener('click', () =>{
        applyStyle( fontGroupBtns, btn);
    });
});

const fontColGroup = document.querySelectorAll('#font-col-div button');
const fontColGroupBtns = ["font-col-pink", "font-col-orange", "font-col-yellow", "font-col-green", "font-col-lightblue", "font-col-purple"];

fontColGroup.forEach(btn => {
    btn.addEventListener('click', () =>{
        applyStyle( fontColGroupBtns, btn);
    });
});

const shadowGroup = document.querySelectorAll('#shadow-div button');
const shadowGroupBtns = ["shadow-none", "shadow-subtle", "shadow-high", "shadow-solid", "shadow-bright", "shadow-inset"];

shadowGroup.forEach(btn => {
    btn.addEventListener('click', () =>{
        applyStyle( shadowGroupBtns, btn);
    });
});

const borderGroup = document.querySelectorAll('#border-div button');
const borderGroupBtns = ["border-none", "border-thin", "border-radius", "border-pill", "border-bottom", "border-double"];

borderGroup.forEach(btn => {
    btn.addEventListener('click', () =>{
        applyStyle( borderGroupBtns, btn);
    });
});
