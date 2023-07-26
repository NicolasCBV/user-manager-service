#pragma once

#include "../../window/window.hpp"
#include "../abstractView.hpp"
#include <cstdlib>
#include <initializer_list>
#include <iostream>
#include <memory>
#include <thread>
#include <vector>

using std::vector;
using std::shared_ptr;
using std::make_shared;
using std::initializer_list;
using std::system;

class MainView : public AbstractView {
  public:
    shared_ptr<vector<Option>> options = make_shared<vector<Option>>();

    bool life = false;
    void lifecycle();
};
