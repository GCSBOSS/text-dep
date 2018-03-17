# text-dep
This is a dependency based, text file merging server where you wil define on which files a given, say js, file
depends on, so that dependencies will be prepended to the requested file on response.
> Obs.: Shoould not be used for binary files (though it might work).

> Warning: This was only tested in Windows 10.

> Warning: This IS NOT production ready.

## Usage

##### Step 1
In your project directory, create a YAML file with the name you want. I will call mine: `settings.yml` (this one will be used in step 5).

##### Step 2
In `settings.yml`, write the following content:
```yaml
sourceDir: ../res
port: 8001

```
> 1. `sourceDir` must point to where your js/css/txt/etc... files will be.
> 2. This path must be relative to `settings.yml` path.
> 3. `port` defines where the HTTP server will be listening for requests.

##### Step 3
In source directory, create a file named `dependencies.yml` with the following content:
```yaml
my-file.js:
  - parent1.js
  - subdir/parent2.js
```

##### Step 4
In source directory, create the following files:
```js
// my-file.js
alert('my file running!');

// parent1.js
alert('parent1 running!');

// subdir/parent2.js
alert('parent2 running!');
```

##### Step 5
Install the server as a service with the following comands:
```bash
npm install -g text-dep
text-dep-service install my-project "/absolute/path/to/my/settings.yml"
```

##### Step 6
Since we are on Windows, go to Services and search for our newly created service whose name is `text-dep-my-project`. Start the service if it is not alreay running.

##### Step 7
In your browser, get http://127.0.0.1:8001/my-file+js and done!

The url can be composed of multiple entries delimited by `+`. And the last entry must be a file extension (such as `js`).

> Eg.: `example.com/my-file+other-file+css` This will load `my-file.css`, `other-file.css` and all their dependencies (as defined in `dependencies.yml`) concatened in one response.

## Have Questions?
Please, if you have any questions, suggestions, doubts, etc.. Don't hesitate to open issues.

Thanks!
