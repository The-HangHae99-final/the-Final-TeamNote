var Toolbox = require('js-toolbox').Toolbox, 
jQuery = require('js-toolbox')._jQuery,
googleapis = require('googleapis'),
OAuth2Client = googleapis.OAuth2Client;

var GoogleLogin = Toolbox.Base.extend({
	oCreds : null, 
	oauth2Client : null,
	sCode: null,
	constructor : function() {
		try{
			//we are in test
			this.oCreds = require(__dirname + '/../../data/google.json');
		}catch(e){
			try{
				//we are in node_modules and the creds are in data
				this.oCreds = require(__dirname + '/../../../data/google.json');				
			}catch(e){
				//we are in node_modules and the creds are in the cwd
				this.oCreds = require(__dirname + '/../../google.json');				
			}
		}
		return this;
	},
	login : function(req, res) {
		this.sCode = req.query.code;
		if(this.sCode) this.handleCode(req, res);
		else{
			if(this.oauth2Client == null){
				// need to do this in a request so that I can get the URL for callback
				this.oauth2Client = new OAuth2Client(this.oCreds.ClientID, 
						this.oCreds.ClientSecret, req.protocol + "://" + req.get('host')
						+ req.url);
			}
			var url = this.oauth2Client.generateAuthUrl({
				  access_type: 'offline',
				  scope: "https://www.googleapis.com/auth/userinfo.profile "
						+ "https://www.googleapis.com/auth/userinfo.email"
				});
			res.writeHead(302,{
				'Location' : url
			});
			res.end();
			return;
		}
	},
	handleCode: function(req, res){
		//closure for callbacks with request
		var aCallbacks = {
				error: function(err){
					res.send(500, 'Server Error: ' + err.toString());
				},
				getProfile: function(err, oTokens){
					if(err) return aCallbacks.error(err);
					jQuery.ajax({
						type : "GET",
						dataType: "json",
						url : "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="
										+ oTokens.access_token
					})
					.done(aCallbacks.saveProfile)
					.fail(aCallbacks.error);
				},
				saveProfile: function(oProfile){
					if (!oProfile.verified_email) {
						res.send(403, 'Unauthorized.');
						return;
					}
					req.session.profile=oProfile;
					res.writeHead(302,{
						'Location' : "/"
					});
					res.end();					
				}
		};
		// start by getting token
		this.oauth2Client.getToken(this.sCode, aCallbacks.getProfile);
	},
	currentUser: function(req, res){
		if(typeof req.session.profile == 'undefined')
		{
			res.send(403, 'Unauthorized.');
		}
		else{
			res.end('[' + JSON.stringify(req.session.profile) + ']');
		}
		
	},
	logout: function(req, res){
		req.session.profile = null;
		res.writeHead(302,{
			'Location' : "/"
		});
		res.end();							
	}
});

module.exports = GoogleLogin;
