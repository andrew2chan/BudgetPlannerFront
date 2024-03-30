/*
This is a helper function that makes a fetch get request
*/
const fetchGet = async (url) => {
    let opt = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        }
    }

    let get = await fetch(url, opt);

    let response = await get.json();
    console.log(response);
    
    return response;
}

/*
This is a helper function that makes a fetch post request
*/
const fetchPost = async (url, body) => {
    let opt = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        }
    }

    if(body !== undefined) opt.body = JSON.stringify(body); //if we have a body passed in then add it to the options

    let post = await fetch(url, opt);

    let response = await post.json();
    
    return response;
}

export { fetchGet, fetchPost };