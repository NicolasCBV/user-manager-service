#pragma once

#include "../window/window-flow.h"
#include <cstdlib>
#include <initializer_list>
#include <memory>
#include <vector>

using std::vector;
using std::shared_ptr;

class AbstractView {
  public:
    virtual void spawn() = 0;
    virtual void lifeCycle() = 0; 

    virtual void remove() = 0;
};
