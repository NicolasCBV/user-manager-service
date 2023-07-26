#include "./initializers/menus/main.menu/init.hpp"
#include "./initializers/menus/actions.menu/init.hpp"
#include "checks/header.hpp"
#include "window/window.hpp"

#include <cstdint>
#include <filesystem>
#include <iostream>
#include <ncurses.h>
#include <string>

int main(int argc, char* argv[]) {
  Check::projectDirFlag(argc, argv);

  Window::init();

  if(!Check::actionFlag(argc, argv)) {
    MainMenuReturn mainMenuContainer = MainMenu::init();
    mainMenuContainer.instance->lifecycle();
  
    return 0;
  }
  
  ActionsMenuReturn actionsMenuContainer = ActionsMenu::init();
  actionsMenuContainer.actionInstance->lifecycle();

  return 0;
}
