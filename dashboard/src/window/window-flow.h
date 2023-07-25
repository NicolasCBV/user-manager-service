#pragma once

#include <functional>
#include <memory>
#include <string>
#include <vector>
#include <ncurses.h>

using std::vector;
using std::shared_ptr;

struct Option {
  std::string name;
  bool enabled;
  std::function<void()> action;
};

class WindowFlow {
  public: 
    void init();
    void finish();
    void showOptions(shared_ptr<vector<Option>>);
    void watchKeyboard(shared_ptr<vector<Option>>);
};
