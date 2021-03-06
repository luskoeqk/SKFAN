var Validator = require('fastest-validator');

const UserModel = require("../models/model.users");
const userValidator = new Validator();


let users = {};
let counter = 0;


let namePattern = /([A-Za-z\-\’])*/;
let zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

const userVSchema = {
		guid: {type: "string", min: 3},
		
		first_name: { type: "string", min: 1, max: 50, pattern: namePattern},
		last_name: { type: "string", min: 1, max: 50, pattern: namePattern},
		email: { type: "email", max: 75 },
		zipcode: { type: "string", max: 5, pattern: zipCodePattern},

		password: { type: "string", min: 2, max: 50, pattern: passwordPattern}
	};

class UserService{

	static create(data){

		var vres = userValidator.validate(data, userVSchema);
		
		/* validation failed */
		if(!(vres === true)){

			let errors = {}, item;

			for(const index in vres){
				item = vres[index];

				errors[item.field] = item.message;
			}
			
			throw {
			    name: "ValidationError",
			    message: errors
			};
		}

		let user = new UserModel(data.first_name, data.last_name, data.email, data.zipcode, data.password);

		user.uid = 'c' + counter++;

		users[user.uid] = user;

		return user;
	}

	static retrieve(uid){
		if(users[uid] != null){
			return users[uid];
		}
		else{
			throw new Error('Unable to retrieve a user by (uid:'+ uid +')');
		}
	}

	static update(uid, data){
		if(users[uid] != null){
			const user = users[uid];
			
			Object.assign(user, data);
		}
		else{
			throw new Error('Unable to retrieve a user by (uid:'+ uid +')');
		}
	}

	static delete(uid){
		if(users[uid] != null){
			delete users[uid];
		}
		else{
			throw new Error('Unable to retrieve a user by (uid:'+ uid +')');
		}
	}
}

module.exports = UserService;