#include "mainMenu.view.h"

void MainMenu::lifeCycle() {

  while(this->life) {
    this->showOptions(this->options);
    this->watchKeyboard(this->options);
  }
}
