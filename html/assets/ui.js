
function recipeBox(rcp) {
  if (rcp) {
    const uid = rcp[0];
    const title = rcp[1];
    const descr = rcp[2];
    const tag = rcp[3];
    var img = "";
    if (rcp[4]) {
        img = "<img src='"+prefix+uid+"_thumb.jpg' />";
    }
    box = $('<article class="item">'+img+'<a href="#'+uid+'"><h1>'+title+"</h1><p>"+descr+"</p></a></article>");
    return box;
  }
};


function buildRecipeList(lst) {
    listing = $("<div class='listing'></div>");
    for (i in lst) {
        listing.append( recipeBox(lst[i]) );
    }
    return listing;
}


function showRecipeList() {
    root.empty();
    root.append(listing);
}

function recipeDetail(json) {
    root.empty();
    ret = $('<a href="#">Retour</a>');
    ret.click(showRecipeList);
    root.append(ret);
    root.append("<h1>"+json["title"]+"</h1>")
    ingredients = json["ingredients"];
    if (ingredients) {
        root.append("<h2>Ingredients</h2>")
        lst = $("<ul></ul>");
        for (i in ingredients) {
            lst.append("<li>"+ingredients[i]+"</li>");
        }
        root.append(lst)
    }
    
    root.append("<h2>Instructions</h2>")
    root.append("<pre>"+json["text"]+"</pre>")
}

function loadRecipe(uid) {
    // TODO: check that uid is valid?
    const path_js = prefix+uid+".json";
    const path_frg = prefix+uid+".html";
    fetch(path_js)
    .then(function(response) {
        return response.json()
    }).then(function(json) {
        recipeDetail(json)
    }).catch(function(ex) {
        alert('error loading the recipe detail', ex)
    });
}

function hashChanged() {
    const hash = window.location.hash;
    if (hash) {
        loadRecipe(hash.substring(1));
        return;
    }
    showRecipeList()
}


root = $("#container");
const prefix = "recipes/";
listing = buildRecipeList(recipes);

$(window).on('hashchange', hashChanged);
hashChanged()

