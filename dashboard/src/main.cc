#include "views/actionsMenu/actionsMenu.view.h"
#include "views/mainMenu/mainMenu.view.h"
#include "views/ormMenu/ormMenu.view.h"
#include "window/window-flow.h"
#include <cstdlib>
#include <functional>
#include <iostream>
#include <ncurses.h>
#include <string>
#include <vector>

int main(int argc, char* argv[]) {
  std::system("clear");

  ActionsMenu actionMenu;
  OrmMenu ormMenu;

  actionMenu.options->insert(
    actionMenu.options->begin() + 1,
    { 
      "Select ORM", 
      false, 
      [&ormMenu, &actionMenu](){
        actionMenu.remove();
  
        ormMenu.spawn();
        ormMenu.lifeCycle();
      } 
    }
  );
  
  ormMenu.options->insert(
    ormMenu.options->begin(),
    { 
      "Undo", 
      false, 
      [&ormMenu, &actionMenu](){
        ormMenu.remove();
  
        actionMenu.spawn();
        actionMenu.lifeCycle();
      } 
    }
  );

  if(argc != 2 || argv[1] != std::string("actions")) {
    MainMenu mainMenu;

    mainMenu.spawn();
    mainMenu.lifeCycle();
  } else {
    actionMenu.spawn();
    actionMenu.lifeCycle();
  }

  return 0;
}
