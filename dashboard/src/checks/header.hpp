#pragma once

#include <string>

namespace Check {
  inline std::string uriProject;

  bool actionFlag(int argc, char* argv[]);
  void projectDirFlag(int argc, char* argv[]);
  void prismaOption(int argc, char* argv[]);
  void typeORMOption(int argc, char* argv[]);
}
