#include <stdlib.h>
#include <string.h>

#include "utils/basic.h"
#include "utils/structure.h"
#include "naview.h"

typedef struct {
  float X;  /* X coords */
  float Y;  /* Y coords */
} COORDINATE;

// This function must be exported when compiling to wasm
// structure is provided as a dot-braket string. Result is flattened array
// of X,Y coordinate pairs
COORDINATE* secondaryStructure(char *structure){
    int i;
    short *table = vrna_ptable(structure);
    short length = (short) strlen(structure);

    COORDINATE *coords = (COORDINATE *) vrna_alloc((length+1)*sizeof(COORDINATE));
    float *X = (float *) vrna_alloc((length+1)*sizeof(float));
    float *Y = (float *) vrna_alloc((length+1)*sizeof(float));
    float* returnCoords = malloc(sizeof(float) * 2 * length); 
    returnCoords[0] = 12312.23;
    printf("this is some great test! %f %p \n", returnCoords[0], returnCoords);

    naview_xy_coordinates(table, X, Y);

    for(i=0;i<=length;i++){
      coords[i].X = X[i];
      coords[i].Y = Y[i];
    }

    // Here we pack coordinates into one dimensional array. X is first, Y
    // is second.
    // float* returnCoords = malloc(sizeof(float) * 2 * length); 
    // for(i=1;i<=length*2;i+=2){
    //   returnCoords[i-1] =  X[(i-1)/2];
    //   returnCoords[i] = Y[(i-1)/2];
    // }
    free(table);
    free(X);
    free(Y);

    return coords;
}


// Just a test example with 3q1q B chain
int main(){
  printf("terstas\n");
  char* dot = "((((((((((..(((((..((((((((((....))))).))))).............((((......((((((((((.....)))))(((((....)))))((...(((((.............(((((((((((....)))))))))..)).......((((((.......))))))..(((((((....)))))))....)))..)))))))))))))...((((.....((((...(((........)))....)))).....))))......((((((((....))))))))...........))))).....................))))))))))....";
  size_t len = strlen(dot);

  COORDINATE* c = secondaryStructure(dot);
  
  for (int i=1; i<len;i++){
    printf("x:%f y:%f \n", c[i].X, c[i].Y);
  }
  // for (int i=1; i<len*2;i+=2){
  //   printf("x:%f y:%f \n", c[i-1], c[i]);
  // }

  return 0;
}

