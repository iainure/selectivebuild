const simpleGit = require('simple-git')
const git = simpleGit()



const go = async () => {

	let result = await git.log({
		file: '.'
	})
	
	console.log(result)

}

go()