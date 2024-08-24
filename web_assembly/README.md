# C/C++ to WASM using Emscripten Compiler

finally I can write C code and run it in web browser

## How to install Emscripten
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
emcc -v
```

If you change the location of the SDK, re-run the ```./emsdk activate latest``` and ```source ./emsdk_env.sh``` commands

To find the location of the `emcc` file:
```bash
which emcc
```

Go to your working directory and add the path of emcc:
```bash
echo 'export PATH="<emcc file location>:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```

## Compile C code to wasm

```bash
emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' main.c
```

This will generate two files: `a.out.wasm` and `a.out.js`. The `a.out.js` file acts as a connector between the WASM and the JavaScript in the HTML

## Debugging
[Debugging WebAssembly with Chrome DevTools](https://developer.chrome.com/blog/wasm-debugging-2020/)


## Practicing
[Compiling an Existing C Module to WebAssembly](https://web.dev/articles/emscripting-a-c-library)