#include <cstdint>
#include <cstring>
#include <memory>
#include <ncurses.h>
#include <string>
#include "./window-flow.h"

using std::string;
using std::vector;
using std::shared_ptr;

string createPadding(
  shared_ptr<vector<Option>> options,
  const std::string_view item
) {
  size_t maximumLength = 0;
  for(const Option& option : *options) {
    const std::size_t stringSize = option.name.size();

    if(maximumLength < stringSize)
      maximumLength = stringSize;
  }

  string padding = "  ";

  for(uint8_t index=0; index < maximumLength - item.size(); index ++) {
    padding = padding + " ";
  }

  return padding;
}

void WindowFlow::showOptions(shared_ptr<vector<Option>> options) {
  int ymax, xmax;
  getmaxyx(stdscr, ymax, xmax);

  uint8_t index=0;
  for(Option& option: *options) {
    const string selection = option.enabled
      ? "[X]."
      : "[ ].";
    const string phrase = selection 
      + createPadding(options, option.name) 
      + option.name;

    const char* chars = phrase.c_str();
    mvprintw((ymax/2 - (index * 2)), (xmax/2 - std::strlen(chars)/2), "%s", chars);

    index++;
  }
}
