import board
import digitalio
import time
import usb_hid
import os
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

print("Main.py: Starting up...")
time.sleep(1)  # Reduced delay for testing

# Setup LED
status_led = digitalio.DigitalInOut(board.LED)
status_led.direction = digitalio.Direction.OUTPUT

def flash_error():
    while True:
        status_led.value = True
        time.sleep(0.1)
        status_led.value = False
        time.sleep(0.1)

# Initialize keyboard right away if we're in payload mode
try:
    print("Main.py: Checking USB HID devices...")
    if not usb_hid.devices:
        print("Main.py: No USB HID devices found!")
        flash_error()
    
    print(f"Main.py: Found {len(usb_hid.devices)} HID devices")
    kbd = Keyboard(usb_hid.devices)
    print("Main.py: Keyboard initialized successfully")
    
    # Test keyboard initialization
    kbd.release_all()
    print("Main.py: Keyboard test successful")
    
except Exception as e:
    print(f"Main.py: Failed to initialize keyboard: {str(e)}")
    flash_error()

def flash_status():
    """Flash the onboard LED for visual feedback"""
    status_led.value = True
    time.sleep(0.1)
    status_led.value = False

def send_string(text):
    """Send a string as keyboard input"""
    print(f"Sending string: {text}")
    for char in text:
        try:
            if char == '"':
                print("Sending double quote")
                kbd.press(Keycode.SHIFT)
                kbd.press(Keycode.QUOTE)
                kbd.release_all()
            elif char == "'":
                print("Sending single quote")
                kbd.press(Keycode.QUOTE)
                kbd.release_all()
            elif char.isupper():
                print(f"Sending uppercase {char}")
                kbd.press(Keycode.SHIFT)
                kbd.press(getattr(Keycode, char.upper()))
                kbd.release_all()
            elif char.isalpha():
                print(f"Sending lowercase {char}")
                kbd.press(getattr(Keycode, char.upper()))
                kbd.release_all()
            elif char.isdigit():
                print(f"Sending digit {char}")
                kbd.press(getattr(Keycode, f"N{char}"))
                kbd.release_all()
            elif char == ' ':
                print("Sending space")
                kbd.press(Keycode.SPACE)
                kbd.release_all()
            elif char == '.':
                print("Sending period")
                kbd.press(Keycode.PERIOD)
                kbd.release_all()
            elif char == '!':
                print("Sending exclamation")
                kbd.press(Keycode.SHIFT)
                kbd.press(Keycode.ONE)
                kbd.release_all()
            else:
                print(f"Skipping unsupported character: {char}")
            time.sleep(0.1)  # Delay between keystrokes
        except Exception as e:
            print(f"Error sending character '{char}': {str(e)}")
            continue

def interpret_ducky_script(filename):
    """Interpret a DuckyScript file and execute commands"""
    try:
        with open(filename, 'r', encoding='utf-8-sig') as file:
            for line in file:
                try:
                    line = line.strip()
                    if not line or line.startswith('REM'):
                        continue

                    print(f"Processing line: {line}")
                    parts = line.split(' ', 1)
                    command = parts[0].upper()
                    
                    if command == 'STRING' and len(parts) > 1:
                        print(f"Found STRING command with text: {parts[1]}")
                        # Add delay before typing
                        time.sleep(0.5)
                        send_string(parts[1])
                        flash_status()
                    elif command == 'DELAY' and len(parts) > 1:
                        delay_time = float(parts[1]) / 1000.0
                        print(f"Delaying for {delay_time} seconds")
                        time.sleep(delay_time)
                    elif command == 'GUI' and len(parts) > 1:
                        second_part = parts[1].upper()
                        print(f"Processing GUI command with {second_part}")
                        if second_part == 'SPACE':
                            kbd.press(Keycode.GUI)
                            time.sleep(0.1)
                            kbd.press(Keycode.SPACE)
                            time.sleep(0.1)
                            kbd.release_all()
                            # Add delay after GUI command
                            time.sleep(0.5)
                        elif second_part in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
                            kbd.press(Keycode.GUI)
                            time.sleep(0.1)
                            kbd.press(getattr(Keycode, second_part))
                            time.sleep(0.1)
                            kbd.release_all()
                            # Add delay after GUI command
                            time.sleep(0.5)
                        flash_status()
                    elif command == 'ENTER':
                        print("Sending ENTER")
                        kbd.press(Keycode.ENTER)
                        time.sleep(0.1)
                        kbd.release_all()
                        # Add delay after ENTER
                        time.sleep(0.5)
                        flash_status()
                    time.sleep(0.2)  # Increased delay between commands
                except Exception as line_error:
                    print(f"Error processing line '{line}': {str(line_error)}")
                    continue
    except Exception as e:
        print(f"Error reading file {filename}: {str(e)}")

# Main execution
print("Looking for ducky scripts...")
try:
    # Check for ducks directory in a CircuitPython-compatible way
    try:
        os.listdir('/ducks')
    except OSError:
        print("Creating /ducks directory")
        os.mkdir('/ducks')
    
    files = os.listdir('/ducks')
    ducky_files = sorted(['/ducks/' + f for f in files if f.endswith('.ducky')])
    
    if not ducky_files:
        print("No ducky scripts found")
        # Flash LED pattern to indicate no scripts
        for _ in range(3):
            flash_status()
            time.sleep(0.5)
    else:
        print(f"Found scripts: {ducky_files}")
        for script in ducky_files:
            print(f"Executing {script}")
            flash_status()
            try:
                interpret_ducky_script(script)
                time.sleep(1)
                print(f"Successfully executed {script}")
            except Exception as script_error:
                print(f"Error executing {script}: {str(script_error)}")
                # Flash error pattern but continue with next script
                for _ in range(2):
                    flash_status()
                    time.sleep(0.2)
except Exception as e:
    print(f"Fatal error: {str(e)}")
    while True:
        # Distinct error pattern
        for _ in range(3):
            flash_status()
            time.sleep(0.1)
        time.sleep(1)

print("Execution complete") 