#include "./header.hpp"
#include <cstdint>

bool Check::actionFlag(int argc, char* argv[]) {
  for(uint8_t index=0; index < argc; index++) {
    if(std::string(argv[index]) == "-actions")
      return true;
  }

  return false;
}
