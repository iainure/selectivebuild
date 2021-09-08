const fs = require('fs').promises

const simpleGit = require('simple-git')
const git = simpleGit()

/*

	To be run before an app is built
	Get the latest revision which touches this directory
	Compare it to the one recorded by the post-build script in ".lastbuilt"
	If it's the same, then this directory hasn't been changed by any git pulls
		- Therefore, we can stop the build as not required

*/

const proceed = (message) => {

	console.log(`Proceed with build${message ? ': ' + message : ''}`)

}

const go = async () => {

	
	try {

		let current = await git.log({
			file: '.' // the directory in which this script is run
		})
		
		if(!current || !current.latest || !current.latest.hash){
			proceed('no current revision found')
		}

		try {

			let lastBuilt = await fs.readFile('.lastbuilt', 'binary')

			if(!lastBuilt || current.latest.hash == lastBuilt){
				console.log(`Build not required: revision ${lastBuilt} is current`)
				process.exit(9) // use special exit code to signify exiting without an error. cant use IPC due to windows bug :(
			}else{
				proceed('code has been updated')
			}
			

		}

		catch (err){

			proceed('.lastbuilt does not exist')

		}


	}

	catch (err){

		console.log('Build failed:', err.message)
		process.exit(1)

	}

}

go()