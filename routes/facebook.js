module.exports = function(app, models) {
	app.get('/facebook/getaccount', function(req, res) {
		if(req.session.user!=undefined)
			if(req.session.user.data!=undefined)
				res.send(req.session.user.data);
    });
}
//res.redirect('https://graph.facebook.com/766091662?access_token=CAAIBFXyhn90BAKuUoBJenlxXA8mkXgDDI0KBdyMIYBDCLyc2h9xJ0H3ImRItFyZCo43TVC3WQ85IbtRFtw4YZAkeIBz80cOGg4pZCXisI7G6srUNr0D5uthFZC4YIuphK4xaPaEa5UxZBFzTIzhj4yZAlVORBPpZCtCRw61YYDZCR6fhkmLZA9fzhhL72hPlNxiZAS7tazuzlo1gZDZD&fields=birthday,email,gender,first_name,last_name,name,picture.type(normal),friends.limit(10).fields(birthday,email,gender,first_name,last_name,name,picture.type(normal))')