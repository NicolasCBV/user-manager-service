#include <algorithm>
#include <iterator>
#include <memory>
#include <ncurses.h>
#include "./window.hpp"

using std::vector;
using std::shared_ptr;

vector<Option>::iterator getPositionAndRefineOptions(
  shared_ptr<vector<Option>>& options
) {
  vector<Option>::iterator option = std::find_if(
    options->begin(), 
    options->end(), 
    [](const Option& option){
      return option.enabled == true;
    }
  );

  for(Option& option : *options) {
    option.enabled = false;
  }

  return option;
}

void up(shared_ptr<vector<Option>>& options) {
  const vector<Option>::iterator option = getPositionAndRefineOptions(options);  

  if(option == options->end()) 
    (*options)[0].enabled = true;
  else {
    const size_t index = std::distance(options->begin(), option);
  
    index >= options->size() -1
      ? (*options)[0].enabled = true
      : (*options)[index + 1].enabled = true;
  }
}

void down(shared_ptr<vector<Option>>& options) {
  const vector<Option>::iterator option = getPositionAndRefineOptions(options); 

  if(option == options->end()) 
    (*options)[0].enabled = true;
  else {
    const size_t index = std::distance(options->begin(), option);
  
    index <= 0
      ? (*options)[options->size() - 1].enabled = true
      : (*options)[index - 1].enabled = true;
  }
}

void enter(shared_ptr<vector<Option>>& options) {
  const vector<Option>::iterator option = std::find_if(
    options->begin(),
    options->end(), 
    [](const Option& option){
      return option.enabled == true;
    }
  );

  if(option != options->end())
    option->action();
}

void Window::watchKeyboard(shared_ptr<vector<Option>> options) {
  auto input = getch();

  refresh();
  if(input == '\n')
    enter(options);

  switch(input) {
    case KEY_UP:
      up(options);
      break;
    case KEY_DOWN:
      down(options);
      break;
  }
}
