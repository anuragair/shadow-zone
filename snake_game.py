#!/usr/bin/env python3

import curses
import random
import time

def main(stdscr):
    # Initialize colors
    curses.start_color()
    curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)  # Snake color
    curses.init_pair(2, curses.COLOR_RED, curses.COLOR_BLACK)    # Food color
    curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK) # Text color
    
    # Hide cursor
    curses.curs_set(0)
    
    # Get screen dimensions
    screen_height, screen_width = stdscr.getmaxyx()
    
    # Create a new window for the game
    win = curses.newwin(screen_height, screen_width, 0, 0)
    win.keypad(True)  # Enable special keys (like arrow keys)
    win.timeout(100)  # Refresh rate in milliseconds
    
    # Initial snake position (center of screen)
    snake_x = screen_width // 4
    snake_y = screen_height // 2
    
    # Initial snake body (3 horizontal segments)
    snake = [
        [snake_y, snake_x],
        [snake_y, snake_x - 1],
        [snake_y, snake_x - 2]
    ]
    
    # Initial food position (random)
    food = [random.randint(1, screen_height - 2), random.randint(1, screen_width - 2)]
    win.addch(food[0], food[1], '●', curses.color_pair(2))
    
    # Initial direction: right
    key = curses.KEY_RIGHT
    
    # Score
    score = 0
    
    # Game loop
    while True:
        # Check if terminal was resized
        new_height, new_width = stdscr.getmaxyx()
        if new_height != screen_height or new_width != screen_width:
            screen_height, screen_width = new_height, new_width
            win.resize(screen_height, screen_width)
            
            # Make sure food is within new boundaries
            if food[0] >= screen_height or food[1] >= screen_width:
                food = [random.randint(1, screen_height - 2), random.randint(1, screen_width - 2)]
                
            # Check if snake is still within bounds
            for segment in snake:
                if segment[0] >= screen_height or segment[1] >= screen_width:
                    return play_again(stdscr, score)
        
        # Display game information
        win.border(0)
        win.addstr(0, 2, f" Snake Game | Score: {score} ", curses.color_pair(3))
        win.addstr(screen_height - 1, 2, " Q: Quit ", curses.color_pair(3))
        
        # Get next key press (non-blocking)
        next_key = win.getch()
        key = key if next_key == -1 else next_key
        
        # Quit the game if 'q' or 'Q' is pressed
        if key == ord('q') or key == ord('Q'):
            return play_again(stdscr, score)
        
        # Calculate new snake head based on direction
        new_head = [snake[0][0], snake[0][1]]
        
        # Update snake head position based on key
        if key == curses.KEY_DOWN:
            new_head[0] += 1
        elif key == curses.KEY_UP:
            new_head[0] -= 1
        elif key == curses.KEY_LEFT:
            new_head[1] -= 1
        elif key == curses.KEY_RIGHT:
            new_head[1] += 1
        
        # Insert new head
        snake.insert(0, new_head)
        
        # Check if snake hits the border
        if (
            snake[0][0] <= 0 or snake[0][0] >= screen_height - 1 or
            snake[0][1] <= 0 or snake[0][1] >= screen_width - 1
        ):
            return play_again(stdscr, score)
        
        # Check if snake runs into itself
        if snake[0] in snake[1:]:
            return play_again(stdscr, score)
        
        # Check if snake eats the food
        if snake[0] == food:
            # Increase score
            score += 1
            
            # Create new food
            food = None
            while food is None:
                new_food = [
                    random.randint(1, screen_height - 2),
                    random.randint(1, screen_width - 2)
                ]
                # Make sure food doesn't appear on the snake
                food = new_food if new_food not in snake else None
            
            win.addch(food[0], food[1], '●', curses.color_pair(2))
        else:
            # Remove snake's tail
            tail = snake.pop()
            win.addch(tail[0], tail[1], ' ')
        
        # Draw snake head
        try:
            win.addch(snake[0][0], snake[0][1], '■', curses.color_pair(1))
        except curses.error:
            # Handle potential error when drawing at bottom-right corner
            pass

def show_instructions(stdscr):
    """
    Display game instructions to the player
    """
    stdscr.clear()
    h, w = stdscr.getmaxyx()
    
    title = "SNAKE GAME INSTRUCTIONS"
    instructions = [
        "Use arrow keys to move the snake",
        "Eat the red food (●) to grow and earn points",
        "Avoid hitting the walls or yourself",
        "Press 'Q' anytime to quit the game",
        "",
        "Press any key to start the game..."
    ]
    
    # Display title
    x = w//2 - len(title)//2
    stdscr.addstr(2, x, title, curses.A_BOLD | curses.A_UNDERLINE)
    
    # Display instructions
    for i, line in enumerate(instructions):
        x = w//2 - len(line)//2
        stdscr.addstr(4 + i, x, line)
    
    stdscr.refresh()
    stdscr.getch()  # Wait for user input

def play_again(stdscr, score):
    """
    Display game over screen and ask if the player wants to play again
    """
    stdscr.clear()
    h, w = stdscr.getmaxyx()
    
    # Display game over message
    game_over = "GAME OVER"
    stdscr.addstr(h//2 - 2, w//2 - len(game_over)//2, game_over, curses.A_BOLD)
    
    # Display score
    score_text = f"Your score: {score}"
    stdscr.addstr(h//2, w//2 - len(score_text)//2, score_text)
    
    # Ask to play again
    play_again = "Play again? (Y/N)"
    stdscr.addstr(h//2 + 2, w//2 - len(play_again)//2, play_again)
    
    stdscr.refresh()
    
    # Wait for Y or N
    while True:
        key = stdscr.getch()
        if key in [ord('y'), ord('Y')]:
            return True
        elif key in [ord('n'), ord('N')]:
            return False

if __name__ == "__main__":
    # Initialize curses
    try:
        # Start the game loop
        play = True
        while play:
            # Reset and initialize the screen
            stdscr = curses.initscr()
            curses.noecho()  # Don't echo key presses
            curses.cbreak()  # React to keys instantly without Enter key
            
            # Show instructions first
            show_instructions(stdscr)
            
            # Start the main game
            play = curses.wrapper(main)
        
    except Exception as e:
        # In case of any errors, make sure to restore terminal settings
        curses.endwin()
        print(f"An error occurred: {e}")
    finally:
        # Always restore terminal to normal state
        curses.endwin()

