var Profile = require("./profile.js");
var renderer = require("./renderer.js")
var querystring = require("querystring");
var commonHeaders = {'Content-Type': 'text/html'};

//Handle HTTP route GET / and POST i.e. Home
function home(request, response) {
	//if the url == "/" && GET (no username posted)
	if(request.url === "/") {
		if(request.method.toLowerCase() === "get") {
		//show the search field
		response.writeHead(200, commonHeaders);
		renderer.view('header', {}, response);
		renderer.view('search', {}, response);
		renderer.view('footer', {}, response);
		response.end();
	} 	else {
		//if the url == "/" and POST

		//get post data from body
		request.on("data", function(postBody){
			//extract username
			var query = querystring.parse(postBody.toString());

			//redirect to /:username
			response.writeHead(303, {"Location": "/" + query.username});
			response.end()
			});
		}
	}	
}

//Handle HTTP route for GET / :username i.e. .chalkers
function user(request,response) {
	//if the url == "/..."
	var username = request.url.replace('/', ' ');
	if(username.length > 0) {
		response.writeHead(200, commonHeaders);
		renderer.view('header', {}, response);

		//get json from Treehouse
		var studentProfile = new Profile("username");
		//on "end" (when all data comes back)		
		studentProfile.on("end", function(profileJSON){
			//show profile

			//store the values which we need
			var values = {
				avatarUrl: profileJSON.gravatar_url,
				username: profileJSON.profile_name,
				badges: profileJSON.badges.length,
				javascriptPoints: profileJSON.points.JavaScript
			}
			//Simple response
			renderer.view('profile', values, response);
			renderer.view('footer', {}, response);
			response.end();
		});

		//on "error" (if error)
		studentProfile.on("error", function(error){
			//show error
			renderer.view('error', {errorMessage: error.message}, response);
			renderer.view('search', {}, response);
			renderer.view('footer', {}, response);
			response.end();
		});
	}
}

module.exports.home = home;
module.exports.user = user;
