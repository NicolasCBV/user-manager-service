cmake_minimum_required(VERSION 3.5)
project(init CXX)

add_compile_options(-Wall -Werror -Wextra -Wpedantic -g)

set(CMAKE_CXX_STANDARD 20)
message(STATUS "use c++20")

find_package(Curses REQUIRED)
include_directories(${CURSES_INCLUDE_DIR})

add_executable(${PROJECT_NAME} src/main.cc)

aux_source_directory(src/views VIEWS_SRC)
aux_source_directory(src/views/mainMenu MAIN_MENU_VIEW_SRC)
aux_source_directory(src/views/actionsMenu ACTIONS_MENU_VIEW_SRC)
aux_source_directory(src/views/ormMenu ORM_MENU_VIEW_SRC)
aux_source_directory(src/views/loading LOADING_VIEW_SRC)
aux_source_directory(src/window WINDOW_SRC)

target_sources(
  ${PROJECT_NAME} 
  PRIVATE 
  ${WINDOW_SRC}
  ${ACTIONS_MENU_VIEW_SRC}
  ${VIEWS_SRC}
  ${LOADING_VIEW_SRC}
  ${MAIN_MENU_VIEW_SRC}
  ${ORM_MENU_VIEW_SRC}
)

target_link_libraries(${PROJECT_NAME} ${CURSES_LIBRARIES})

