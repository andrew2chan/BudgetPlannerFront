const serverErrorMessage = { "Error": "Server error: Please try again later" };

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

    let get = await fetch(url, opt).catch((err) => console.log(err));

    if(get) {
        let response = await get.json();
        
        return response;
    }

    return serverErrorMessage
}

/*
This is a helper function that makes a fetch post request
*/
const fetchPost = async (url, body) => {
    let opt = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    }

    if(body !== undefined) opt.body = JSON.stringify(body); //if we have a body passed in then add it to the options

    let post = await fetch(url, opt).catch((err) => console.log(err));

    if(post) {
        if(parseInt(post.headers.get("content-length")) === 0 || post.status === 204) return { "status": "registered successfully" }; //return if we don't have any content or if we return no content
        let response = await post.json();
        
        return response;
    }

    return serverErrorMessage
}

export { fetchGet, fetchPost };