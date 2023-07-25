#!/bin/sh

/usr/bin/clear

GREEN='\033[0;32m';
RED='\033[0;31m';
CYAN='\033[0;36m';
RESET='\033[0m';

ERRIV="${RED}Invalid response.${RESET}";

end() {
    /bin/echo -e -n "\n${CYAN}Type something:${RESET} ";
    read NEXT;
    menu;
}

main() {
    /usr/bin/clear;
    case $RESPONSE in
        1) 
            /bin/echo "WARN: to start server with prisma, run some migration";
            /bin/echo "Initializing app in zsh.   :)";
            /usr/bin/zsh;
            menu;
        ;;

        2)  
            /bin/echo "Exiting...";
            exit 0
        ;;

        *)
            /bin/echo -e $ERRIV;
            exit 1;
        ;;
    esac
}

menu() {
    /usr/bin/clear;
    # EXECUTION:
    /bin/echo -e -n "${CYAN}######${RESET} ${GREEN}WELCOME TO USER SERVICE${RESET} ${CYAN}######${RESET} \nChose what you wanna do:
    ${CYAN}1.${RESET} Run zsh 
    ${CYAN}2.${RESET} To exit
    \nType your answer: ";

    read RESPONSE;
    main $RESPONSE;
    if [ -z $RESPONSE ]; then
        /bin/echo -e "${RED}Expected an input.${RESET}";
        exit 1;
    fi
}

menu;
