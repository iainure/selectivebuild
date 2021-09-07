const fs = require('fs').promises

const simpleGit = require('simple-git')
const git = simpleGit()

/*

	To be run after a build
	Records the latest git revision that touches this folder in a file ".lastbuilt"
	Later, when we try to build again, another script will:
		- look at the file
		- compare it to the current revision touching this folder
		- if they are the same, we don't need to build again

*/

const go = async () => {

	try {

		let result = await git.log({
			file: '.' // the directory in which this script is run
		})
		
		if(result && result.latest){
			await fs.writeFile('.lastbuilt', result.latest.hash) // creates / overwrites
			console.log(`.lastbuilt written with ${result.latest.hash}`)
		}

	}

	catch (err){

		console.log(err)

	}

}

go()