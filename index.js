const simpleGit = require('simple-git')
const git = simpleGit()



const go = async () => {

	let result = await git.log({
		file: 'README.md'
	})
	console.log(result.latest.hash)
	console.log(result)

}

go()