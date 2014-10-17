## Wiggin
A fullstack web framework

### install
``` sh
$ npm install -g wiggin
```

### scaffold
``` sh
$ mkdir my-app
$ cd !$
$ wiggin create
```

### start your server
``` sh
$ make
```

### CLI
``` sh
$ wiggin build
```
Creates your compiled `jade` views, then bundles your client dependency tree given the `client` input found in `wiggin-conf.json`.

``` sh
$ wiggin ender
```
Builds your ender `package.json` into a single file.
