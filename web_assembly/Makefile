hello:
	echo "Hallo, World!"

main: main.o
	cc main.o -o main

main.o: main.c
	cc -c main.c -o main.o

clean:
	rm -f main.o main