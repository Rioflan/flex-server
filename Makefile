compile-go:
	go build -buildmode=c-shared -o crypto.so crypto-go/golang/crypto.go

build: compile-go
	npm run build:go