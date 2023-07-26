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

class Window {
  public: 
    static void init();
    static void finish();
    static void showOptions(shared_ptr<vector<Option>>);
    static void watchKeyboard(shared_ptr<vector<Option>>);
};
