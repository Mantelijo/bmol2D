#include <stdlib.h>
#include <string.h>

#include "utils/basic.h"
#include "utils/structure.h"
#include "naview.h"

typedef struct {
  float X;  /* X coords */
  float Y;  /* Y coords */
} COORDINATE;

// This function must be exported when compiling to wasm structure is
// provided as a dot-braket string. Result is flattened array of X,Y
// coordinate pairs
COORDINATE* secondaryStructureFromPairTable(short *table){
  int i;
  short length = table[0];
  
  // Print out the table structure
  // printf("pair table from pair table:\n[");
  // for(int i=0;i<length;i++){
  //   printf("%hu,", table[i]);
  // }
  // printf("]\n");

    COORDINATE *coords = (COORDINATE *) vrna_alloc((length+1)*sizeof(COORDINATE));
    float *X = (float *) vrna_alloc((length+1)*sizeof(float));
    float *Y = (float *) vrna_alloc((length+1)*sizeof(float));

    naview_xy_coordinates(table, X, Y);

    for(i=0;i<=length;i++){
      coords[i].X = X[i];
      coords[i].Y = Y[i];
    }

    free(table);
    free(X);
    free(Y);

    return coords;
}

COORDINATE* secondaryStructureFromDotBraket(char *structure){
  int i;
  short *table = vrna_ptable(structure);
  short length = (short) strlen(structure);

  // Print out the table structure
  // printf("pair table from dot braket:\n["); 
  // for(int i=0;i<length;i++){
  //   printf("%hu,", table[i]);
  // }
  // printf("]\n");


  COORDINATE *coords = (COORDINATE *) vrna_alloc((length+1)*sizeof(COORDINATE));
  float *X = (float *) vrna_alloc((length+1)*sizeof(float));
  float *Y = (float *) vrna_alloc((length+1)*sizeof(float));

  naview_xy_coordinates(table, X, Y);

  for(i=0;i<=length;i++){
    coords[i].X = X[i];
    coords[i].Y = Y[i];
  }
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

  COORDINATE* c = secondaryStructureFromDotBraket(dot);
  
  for (int i=1; i<len;i++){
    printf("x:%f y:%f \n", c[i].X, c[i].Y);
  }
  // for (int i=1; i<len*2;i+=2){ printf("x:%f y:%f \n", c[i-1], c[i]);
  // }

  return 0;
}

