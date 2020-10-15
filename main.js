const api_key = "1IFGpqoaKfVoePsPksPbc5XA9RTGIkTT";
const api_address = "http://api.giphy.com/v1/gifs";
const load_more_summand = 15;
var limit = 30;
let last_id = 0;
let current_gifs = [];
let rendered_gifs = [];
let search_request = new XMLHttpRequest();

const gifs_div = document.getElementById("gifs-div");
const search_input = document.getElementById("search-input");

function onLoadMore() {
  console.log("loading more");
  limit += load_more_summand;

  for(let i = 0; i < load_more_summand; i++) {
    let gif_object = {
      title: "empty",
      source: "empty",
      id: last_id++
    }
    current_gifs.push(gif_object);
    rendered_gifs.push(gif_object);
    addElement(gif_object);
  }

  onChangeSearch();
}

function onChangeSearch() {
  if (search_input.value == "" || rendered_gifs.length == 0) getTrending();
  else {
    search_request.abort();
    search_request.open("GET", `${api_address}/search?&api_key=${api_key}&q=${search_input.value}&limit=${limit}`, true);
    search_request.responseType = "json";
    search_request.onreadystatechange = () => {
      if (search_request.response != null) {
        current_gifs.length = 0;
        search_request.response.data.map((gif, index) => {
          let gif_object = {
            title: gif.title,
            source: gif.images.original.url,
            id: gif.id
          }
          if (!current_gifs.includes(gif_object)) {
            current_gifs.push(gif_object);
          }
        })
      }
      swapDOM();
    }
    search_request.send();
  }
}

function addElement(gif_object) {
  let container = document.createElement("div");
  container.className = "gif-container";

  let img = document.createElement("img");
  img.className = "gif";
  img.id = gif_object.id;
  img.src = gif_object.source;

  container.appendChild(img);
  gifs_div.appendChild(container);
}

function swapDOM() {
  current_gifs.map((gif_object, index) => {
    if (!rendered_gifs.includes(gif_object)) {
      let img_element = document.getElementById(rendered_gifs[index].id);
      img_element.src = gif_object.source;
      img_element.id = gif_object.id;
      rendered_gifs[index] = gif_object;
    }
  })
}

function updateDOM() {
  current_gifs.map(gif_object => {
    if (!rendered_gifs.includes(gif_object)) {
      rendered_gifs.push(gif_object);
      addElement(gif_object);
    }
  })

  let obsolete_gifs = rendered_gifs.filter(gif_object => !current_gifs.includes(gif_object));
  rendered_gifs = rendered_gifs.filter(gif_object => !obsolete_gifs.includes(gif_object));

  obsolete_gifs.map(gif_object => {
    document.getElementById(gif_object.id).remove();
  })
}

function getTrending() {
  if (rendered_gifs.length == 0) {
    var request = new XMLHttpRequest();
    request.open("GET", `${api_address}/trending?&api_key=${api_key}&limit=${limit}`, true);
    request.responseType = "json";
    request.onreadystatechange = () => {
      if (request.response != null) {
        current_gifs.length = 0;
        request.response.data.map(gif => {
          current_gifs.push({
            title: gif.title,
            source: gif.images.original.url,
            id: gif.id
          })
        })

        updateDOM();
      }
    }

    request.send();
  } else {
    var request = new XMLHttpRequest();
    request.open("GET", `${api_address}/trending?&api_key=${api_key}&limit=${limit}`, true);
    request.responseType = "json";
    request.onreadystatechange = () => {
      if (request.response != null) {
        current_gifs.length = 0;
        request.response.data.map(gif => {
          current_gifs.push({
            title: gif.title,
            source: gif.images.original.url,
            id: gif.id
          })
        })

        swapDOM();
      }
    }

    request.send();
  }
}

function main() {
  onChangeSearch();
}

main();
