## hapi-async-methods [![Build Status](https://travis-ci.org/raymondsze/hapi-async-methods.svg)](https://travis-ci.org/raymondsze/hapi-async-methods.svg?branch=master)
## Introduction
<p>This plugin is used to solve 2 problems.</p>
<p>1. Use async function as method instead of thunk. Therefore, you can use await/ yield inside and outside your method call.</p>
<p>2. server.method by scanning directory.</p>

## Install
<p>Note: Bluebird is required, the Promise return from the method is instance of Bluebird.</p>
<p><b>npm install --save bluebird</b></p>

<p><b>npm install --save hapi-async-methods</b></p>

<p>The traditional way of method config used by Hapi</p>
<p>The method config</p>
```javascript
{
  name: 'hello',
  method: function (name, next) {
    return next(null, 'Hello, ' + name);
  }
}
```
<p>With this plugin, you can write like this (with babel-register and preset es2015 or es2015-node5).</p>
```javascript
{
  name: 'hello',
  method: async function (name) {
    return 'Hello, ' + name;
  }
}
```
or
```javascript
{
  name: 'hello',
  method: Promise.coroutine(function *(name) {
    return 'Hello, ' + name;
  })
}
```

## Options
<p><b>name</b> (Optional): This is the output name for the async method package. (i.e server.decorate(name, methodsAsync). The default value is 'methodsAsync'.</p>
<p>Example</p>
```javascript
server.method({
  name: 'hello',
  method: async function (name) {
    return 'Hello, ' + name;
  }
})
```
<p>Then you can access the async method by server.methodsAsync</p>
```javascript
function(request, reply) {
  request.server.methodsAsync.hello('Raymond').then((result) => {
    .....
  });
  // you can also access the thunk instead of async function
  request.server.methods.hello('Raymond', (err, result) => {
    .....
  });
}
```
<p>You may interested in <a href="https://github.com/raymondsze/hapi-async-routes">hapi-async-route</a> to make handler also act as async function.</p>
<p><b>methods</b> (Optional): This is the array of dir path you want to scan the method config with method as async function, it is much convenient if you don't want to server.method or write thunk function manually.</p>
<p>The thunk method can be accessed by server.methods[methodName]. The async method can be accessed by server.methodsAsync[methodName].</p>
<p>The file inside the directory should be like that</p>
```javascript
module.exports = [
  {
    name: 'sayHello',
    method: async function (name, gender) {
      return 'Hello World, ' + name + ', you are ' + gender;
    },
    options: {
      cache: {
        expiresIn: 7 * 24 * 60 * 1000,
        generateTimeout: 100
      },
      generateKey: function (name) {
        return name;
      }
    }
  },
  {
    name: 'sayBye',
    method: async function (name) {
      return 'Bye, ' + name;
    }
  }
];
```
<p>Note: all method registered before this plugin will also be considered and expose to server[name](name is the option name, default is methodsAsync), therefore this is an optional option</p>
<p>If this option is not specified, you need to create method as thunk before register this plugin</p>
```javascript
server.method({
  name: 'hello',
  method: function (name, next) {
    return next(null, 'Hello, ' + name);
  }
})
```
<p>Then you can access the async method by server.methodsAsync</p>
```javascript
function(request, reply) {
  request.server.methodsAsync.hello('Raymond').then((result) => {
    .....
  });
}
```

## Drop Cache
<p>You can drop cache with cache.dropAsync instead of cache.drop</p>
```javascript
function(request, reply) {
  request.server.methodsAsync.hello.cache.dropAsync('Raymond').then(() => {
    ......
  });
}
```

## Example
<p>Please visit the test case for example reference. </p>
<a href= "https://github.com/raymondsze/hapi-async-methods/tree/master/test">Example usage</a>


## LICENSE
The MIT License (MIT)

Copyright (c) 2016 Sze Ka Wai Raymond

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.