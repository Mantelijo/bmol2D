#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>

void *vrna_alloc(unsigned size)
{
  void *pointer;

  if ((pointer = (void *)calloc(1, (size_t)size)) == NULL) {
    #ifdef EINVAL
    if (errno == EINVAL) {
      fprintf(stderr, "vrna_alloc: requested size: %d\n", size);
      fprintf(stderr, "Memory allocation failure -> EINVAL");
    }

    if (errno == ENOMEM)
    #endif
    fprintf(stderr, "Memory allocation failure -> no memory");
  }

  return pointer;
}

void vrna_message_warning(const char *format, ...)
{
  va_list args;

  va_start(args, format);
  fprintf(stderr, format, args);
  va_end(args);
}

void vrna_message_error(const char *format,
                   ...){

                   }