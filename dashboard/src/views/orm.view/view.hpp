#pragma once

#include "../../window/window.hpp"
#include "../abstractView.hpp"
#include <chrono>
#include <cstdlib>
#include <initializer_list>
#include <ios>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <vector>
#include <fstream>
#include <ncurses.h>

using std::vector;
using std::shared_ptr;
using std::make_shared;

class OrmView : public AbstractView {
  public:
    shared_ptr<vector<Option>> options = make_shared<vector<Option>>();

    bool life = false;
    void lifecycle() override;
};
