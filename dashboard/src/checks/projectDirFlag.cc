#include "header.hpp"
#include <cstdint>
#include <filesystem>
#include <stdexcept>

void Check::projectDirFlag(int argc, char* argv[]){
  for(uint8_t index=0; index < argc; index++) {
    if(index > 0 && std::filesystem::exists(argv[index])) {
      Check::uriProject = argv[index];
      return;
    }
  }

  throw std::invalid_argument("The directory must exist.");
}
