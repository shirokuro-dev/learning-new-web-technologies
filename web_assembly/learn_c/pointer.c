// Strings
// Dynamic memory allocation
// Sending function arguments by reference
// Building complicated data structures
// Pointing to functions
// Building special data structures (i.e. Tree, Tries, etc...)

// A pointer is essentially a simple integer variable which holds a memory address that points to a value, instead of holding the actual value itself.

// typecasting (int*) pointer variable
// array[i] === *(array + i)
// ? int function(int ** variable)
// ((char*)&theInt)[0]

#include <stdio.h>

void changePointer(int **ptr) {
    static int y = 20;
    *ptr = &y; 
}

void changeValue(int *ptr) {
    *ptr = 10;
}

int main() {
    int x = 5;
    int *p = &x;
    
    printf("Before: *p = %d\n", *p);  // Output: *p = 5
    
    changePointer(&p);
    
    printf("After: *p = %d %d\n", *p, x);   // Output: *p = 20

    changeValue(&x);

    printf("Value of x: %d\n", x);
    return 0;
}