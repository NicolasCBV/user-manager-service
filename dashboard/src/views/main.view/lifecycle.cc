#include "view.hpp"

void MainView::lifecycle() {
  this->life = true;
  while(this->life) {
    Window::showOptions(this->options);
    Window::watchKeyboard(this->options);
  }
}
