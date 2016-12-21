## Hexalator

This is a small utility for quickly showing the different forms of a given
binary sequence. It simultaneously shows the decimal (signed and unsigned),
binary, hexidecimal and utf-8 forms of a given value. The conversions are
done using with a CLI tool with an embedded web server written in Go, the
front-end is written in javascript using electron and React.

## Usage

This package is currently under development, and has not been packaged for
use without the development environment

## Development

1. Install the latest Golang and node.js versions
2. `npm install -g electron webpack`
3. `go get -v github.com/elliotmr/hexalator/...`
4. `cd $GOPATH/src/github.com/elliotmr/hexalator/hl && go build`
5. `cd .. && npm install`
6. `webpack`
7. `electron .`