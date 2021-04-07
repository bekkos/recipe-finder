const ingredients = [];
var nameDict = []
var inputField = document.getElementById("valueInput");
jQuery.ajaxSetup({async:false});
$.get("/get-ingredients", (data) => {
    nameDict = data['terms'];
});


function urlRedirect(a) {
    let url = "https://www.google.com/search?q=";
    let query = a.split(' ').join('+');
    url += query;
    window.open(url, '_blank');
}


const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

function addToAppendlist(ingredient) {
    let appendDiv = document.getElementById('appendDiv');
    appendDiv.innerHTML += `
    <div class='item' onclick='deleteElement(this);'><p>${ingredient}</p></div>
    `;
}

function onSearchUpdate(object) {
    let value = object.value;
    let tempArr = [];
    for(let i = 0; i<nameDict.length; i++) {
        if(nameDict[i].indexOf(value.toString()) != -1) {
            tempArr.push(nameDict[i]);
        }

        if(tempArr.length == 10) {
            break;
        }
    }
    let searchResultList = document.getElementById('searchResults');
    searchResultList.innerHTML = "";
    for(let i = 0; i<tempArr.length; i++) {
        searchResultList.innerHTML += `
        <p onclick="addAsValue(this);">${tempArr[i]}</p>
        `;   
    }
    $("#searchResults").css("display", "block");
}

document.onkeypress = function (e) {
    e = e || window.event;
    
    onSearchUpdate(inputField);
};


function onSearchComplete() {
    let input = document.getElementById('valueInput');
    addToAppendlist(input.value);
    ingredients.push(input.value);
    input.value = "";
    console.log(ingredients);
}

function deleteElement (object) {
    const index = ingredients.indexOf(object.firstChild.innerText);
    if (index !== -1) {
        ingredients.splice(index, 1);
    }
    object.remove();

    console.log(ingredients);
}

function addAsValue(object) {
    let value = object.innerText;
    inputField.value = value;
    $("#searchResults").css("display", "none");
}




function getRecipes() {
    $("#hintMsg").css("display", "none");
    let ingString = "";
    let url = "https://api.spoonacular.com/recipes/findByIngredients"
    for(let i in ingredients) {
        ingString += ingredients[i] + ",";
    }
    console.log(ingString);
    let data = {
        'apiKey': 'b7b0165cd55d4472bd339034ff15582a',
        'ingredients': ingString,
        'number': 30
    };
    let rList = {};
    jQuery.ajaxSetup({async:false});
    $.get(url, data, (response) => {
        rList = response;
    });
    console.log(rList);
    let recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = `
        <br>
        <h2 class="text-center">Recipes</h2>
        <hr>
        `;

    for(let i = 0;i<rList.length;i++) {
        recipeList.innerHTML += `
            <div class="recipeItem text-center">
                <h3>${rList[i]['title']}</h3>
                <br>
                <img class="img-thumbnail mx-auto d-block rounded" src="${rList[i]['image']}">
                <br>
                <h4>Ingredients</h4>
                    
        `;
        for(let y = 0; y<rList[i]['usedIngredients'].length;y++) {
            recipeList.innerHTML += `
            <p class="text-center">${capitalize(rList[i]['usedIngredients'][y]['name'])} | ${rList[i]['usedIngredients'][y]['amount']} ${rList[i]['usedIngredients'][y]['unitLong']}</p>    
        `;
        }
        
        if(rList[i]['missedIngredients'].length > 0) {
            recipeList.innerHTML += `<p class="text-center"><b>Missing Ingredients</b></p>`;
        }
        for(let y = 0; y<rList[i]['missedIngredients'].length;y++) {
            recipeList.innerHTML += `
            <p class="text-center">${capitalize(rList[i]['missedIngredients'][y]['name'])} | ${rList[i]['missedIngredients'][y]['amount']} ${rList[i]['missedIngredients'][y]['unitLong']}</p>    
        `;
        }
        recipeList.innerHTML += `
            <button class="btn btn-success text-center mx-auto" onclick="urlRedirect('${rList[i]['title']}');">Read more</button>
            </div>
            <br><br>
        `;
    }
}

