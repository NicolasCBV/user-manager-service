#pragma once

#include <cstdlib>
#include <initializer_list>
#include <memory>
#include <vector>

using std::vector;
using std::shared_ptr;

class AbstractView {
  public:
    virtual void lifecycle() = 0; 
};
