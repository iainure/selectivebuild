const simpleGit = require('simple-git')
const git = simpleGit()



const go = async () => {

	let result = await git.log({
		file: 'appone'
	})
	
	console.log(result)

}

go()