const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

const ConnectDB = async ()=>{

    try {
		await mongoose.connect(`mongodb+srv://todo_list:${process.env.password}@cluster0.oa0wn.mongodb.net/TodoListData?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				
				
			}
		)

		console.log('MongoDB connected')
	} catch (error) {
		console.log(error)

	}
}

module.exports = ConnectDB;