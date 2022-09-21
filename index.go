package main

import (
	"errors"
	"fmt"
)

func main() {
	defer fmt.Println("hello!")
	panic(errors.New("errror"))
}
