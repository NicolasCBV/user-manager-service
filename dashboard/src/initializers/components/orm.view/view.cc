#include "view.hpp"
#include "../../../checks/header.hpp"
#include <chrono>
#include <cstring>
#include <fstream>
#include <thread>
#include <ncurses.h>

void defineOrm(std::shared_ptr<OrmView> ormView, bool&& isPrisma) {
  int ymax, xmax;
  getmaxyx(stdscr, ymax, xmax);

  clear();
  const char* msg = "Loading files...";
  mvprintw((ymax/2), (xmax/2 - std::strlen(msg)/2), "%s", msg);
  refresh();
  std::this_thread::sleep_for(std::chrono::milliseconds(1000));

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
  ) {
    clear();
    const char* msg = "Unable to open required files. Stopping operation.";
    mvprintw((ymax/2), (xmax/2 - std::strlen(msg)/2), "%s", msg);
    refresh();
    std::this_thread::sleep_for(std::chrono::milliseconds(2500));

    ormView->lifecycle();
    return;
  }

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

  ormView->lifecycle();
}

OrmComponentReturn OrmComponent::init(std::shared_ptr<AbstractView> abstractMenu) {
  std::shared_ptr<OrmView> ormView = std::make_shared<OrmView>();

  ormView->options->insert(
    ormView->options->end(),
    {
      {
        "Undo", 
        false, 
        [abstractMenu, ormView](){
          ormView->life = false;
          abstractMenu->lifecycle();
        }
      },
      { 
        "Prisma", 
        false, 
        [ormView](){
          defineOrm(ormView, true);
        }
      },
      { 
        "TypeORM (default)", 
        true, 
        [ormView](){
          defineOrm(ormView, false);
        }
      }
    }
  );
  
  struct OrmComponentReturn container {
    ormView
  };
  return container;
}
