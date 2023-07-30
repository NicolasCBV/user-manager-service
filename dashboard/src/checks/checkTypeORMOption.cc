#include "./header.hpp"
#include "../services/defineORM.hpp"

#include <cstdint>
#include <cstdlib>

void Check::typeORMOption(int argc, char* argv[]){
  for(uint8_t index=0; index < argc; index++) {
    if(std::string(argv[index]) == "-setORM=typeorm") {
      DefineORM::exec(false);
      return std::exit(0);
    }
  }
}
