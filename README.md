# selective build
Building only sub-apps that haven't been built since the latest git pull.

## problem
We have a single-spa app with a build command which builds all of the sub-apps. Depending on how many sub-apps we have, this could take a very long time. Since this build is tied to the backend built process, backend developers complain that the frontend build is slowing them down.

## solution
Add a `postbuild` script that records the latest revision hash for each sub-app when it is built - file `.lastbuild`
Add a `prebuild` script that looks at this and checks against the *current* latest revision. If they are different, then a `git pull` has updated the code for this sub-app, and it needs to be re-built. If they are the same, we can skip this build and save time.
