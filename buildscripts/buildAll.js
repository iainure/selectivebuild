const { readdirSync } = require('fs')
const chalk = require('chalk')
const path = require('path')
const spawn = require('cross-spawn')

const root = path.resolve(__dirname, '../')

// find which directories in which to execute build/serve commands
const exclude = ['.git', 'node_modules', 'buildscripts']

const getAppDirectories = () => {

	return readdirSync(root, { withFileTypes: true })
		.filter(dirEnt => {

			// exclude folders NOT to build in
			if(exclude.includes(dirEnt.name)){
				return false
			}

			// only build in directories (duh)
			return dirEnt.isDirectory()

		})
		.map(dirEnt => dirEnt.name)
}

const verbose = process.argv.includes('verbose')

const run = (app, verbose) => {

	console.log(`Building: ${app}`.padStart(5))

	return new Promise((resolve, reject) => {

		const fail = () => {

			reject(`${app} failed`)

		}

		try {

			const spawned = spawn('npm run build', { stdio: verbose ? 'inherit' : 'ignore', shell: true, cwd: `${root}/${app}`})

			spawned.on('error', () => {})

			spawned.on('close', function (code) {
				
				switch(code){

					case 0:
						console.log(chalk.green(`   ${app} complete`))
						resolve()
						break

					case 9: // using a special exit code to signify exiting without an error. cant use IPC due to windows bug :(
						console.log(chalk.yellow(`   ${app} build not required`))
						resolve()
						break

					case 1:
					default:
						fail()

				}			
				
			})

		}

		catch(err) {

			fail(err)

		}


	})



}


const runAll = (verbose = false) => {

	const appDirs = getAppDirectories()

	return new Promise(async (resolve, reject) => {

		const errors = []

		try {

			await Promise.all(appDirs.map(app => {

				return run(app, verbose)
					.catch(error => errors.push(error))

			}))

			if(errors.length){
				reject(errors)
			}else{
				resolve()
			}

		}

		catch(err){

			reject(err)

		}


	})

}

const init = async () => {

	console.log('Initiating builds:')

	try {

		await runAll(verbose)
		console.log(chalk.bgGreen('Builds complete'))

	}

	catch(err){

		console.log(chalk.bgRed(`Builds failed:`))

		const errors = Array.isArray(err) ? err : [err]
		errors.forEach(error => console.log(chalk.red(`   ${error}`)))

	}

}


init()