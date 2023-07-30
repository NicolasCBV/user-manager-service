#include "view.hpp"

void ActionsView::lifecycle() {
  this->life = true;
  while(this->life) {
    Window::showOptions(this->options);
    Window::watchKeyboard(this->options);
  }
}
