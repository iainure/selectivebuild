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

const go = async () => {

	try {

		let current = await git.log({
			file: '.' // the directory in which this script is run
		})
		
		if(!current || !current.latest || !current.latest.hash){
			throw new Error('no current revision found')
		}

		let lastBuilt

		try {

			lastBuilt = await fs.readFile('.lastbuilt', 'binary')
			
		}

		catch (err){

			throw new Error('.lastbuilt does not exist')

		}

		if(!lastBuilt || current.latest.hash == lastBuilt){
			console.log(`Build not required: revision ${lastBuilt} is current`)
			process.exit(1)
		}else{
			throw new Error('code has been updated')
		}

	}

	catch (err){

		console.log('Proceed with build:', err.message)

	}

}

go()