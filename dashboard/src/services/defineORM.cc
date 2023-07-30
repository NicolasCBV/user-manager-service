#include "./defineORM.hpp"
#include "../checks/header.hpp"
#include <chrono>
#include <cstring>
#include <ios>
#include <fstream>
#include <thread>

void DefineORM::exec(bool isPrisma) {
  std::string baseFile = isPrisma 
      ? "prismaORM.clone.txt"
      : "typeORM.clone.txt";
  std::ifstream databaseModuleClone(
    std::string(PROJECT_DIR) +
    "/src/views/orm.view/" +
    baseFile  
  );
  std::ofstream writeDatabaseModule(Check::uriProject + "/src/infra/storages/db/database.module.ts");
  std::ofstream writeTsconfig(Check::uriProject + "/tsconfig-excludes.json");
  std::ofstream writeEslintIgnore(Check::uriProject + "/.eslintignore");

  if(
    !databaseModuleClone.is_open() ||
    !writeTsconfig.is_open() || 
    !writeDatabaseModule.is_open() ||
    !writeEslintIgnore.is_open()
  )
    throw std::ios_base::failure("Could not open files");

  std::string line;
  while(std::getline(databaseModuleClone, line))
    writeDatabaseModule << line << std::endl;

  writeTsconfig << "{\n";
  writeTsconfig << "  \"exclude\": [\n";
  writeTsconfig << "    \"node_modules\",\n";
  writeTsconfig << "    \"dist\",\n";

  writeEslintIgnore << "**/*.js\n";

  if (isPrisma) {
    writeTsconfig << "    \"**/*typeorm*\",\n";
    writeTsconfig << "    \"ormconfig.ts\"\n";

    writeEslintIgnore << "**/*typeorm*\n";
    writeEslintIgnore << "ormconfig.ts\n";
  } else {
    writeTsconfig << "    \"**/*prisma*\"\n";

    writeEslintIgnore << "**/*prisma*\n";
  }

  writeTsconfig << "  ]\n";
  writeTsconfig << "}";

  databaseModuleClone.close();
  writeEslintIgnore.close();
  writeTsconfig.close();
  writeDatabaseModule.close();
}

