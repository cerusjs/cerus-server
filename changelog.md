# Changelog

## v0.0.1 (2 Nov. 2017)
- (New) Created the module.
- (New) Added the package.json.
- (New) Added the promise class.
- (New) Added the .gitignore.

## v0.0.2 (2 Nov. 2017)
- (Fix) Fixed the package.json.
- (Fix) Fixed an issue with requiring the wrong file.

## v0.0.3 (17 Nov. 2017)
- (New) Added tests.
- (New) Added the functions #event(), #maxheaders(), #maxconnections(), #alive() and #timeout().
- (Enh) #start() will now test if the server is listening and it's arguments.
- (Enh) #start() can now be supplied with a custom port.
- (Enh) #stop(), #connections() and #address will now test if the server is listening.