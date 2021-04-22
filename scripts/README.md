# Scripts

> A collection of useful scripts.

## [Update app settings](./update-app-settings)

Run `./update-app-settings` from the repo's root directory to update the app
settings for the function app deployed in Azure. You must be logged in for this
to work - `az login`. By default the script will update the settings in the
`production` slot. Other slots can be updated by specifying the name of the
slot when running the script e.g. `./update-app-settings staging`.

There must be a file in the repo's root directory containing the slot settings
including the name of the slot e.g. `app-settings.production.json` contains the
`production` slot app settings. These files likely contain secrets and should
not be checked into source control (they are excluded via `.gitignore`).

## [Run GitHub Super Linter](./run-github-super-linter)

Run `./run-github-super-linter` to run GitHub Super Linter on the repo. This is
run during the CI build to ensure all files adhere to the linting rules.
