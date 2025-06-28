const tutorialContent = `Welcome to HackDucky! 🦆

Want to get your own rubber ducky? You're in the right place! Let's get started with HackScript.

What is HackDucky?

HackDucky is a programmable USB device that uses HackScript - an enhanced version of DuckyScript. While it's similar to DuckyScript, HackScript offers additional features for better control and automation.

---

🛠️ Step 1: Understanding the Basics

Every HackScript follows a basic structure with these essential commands:

### Core Commands
- REM - Comments that help explain your code (ignored by the duck)
- DEFAULT_DELAY - Sets the timing between commands
- DELAY - Adds a pause in milliseconds
- STRING - Types text exactly as written
- GUI, CTRL, ALT - Modifier keys for shortcuts
- ENTER - Simulates pressing the Enter key

Example Script

Let's look at a simple example that opens Notepad and saves a file:

REM Basic example script
DEFAULT_DELAY 200

REM Open Run dialog
GUI r
DELAY 500

REM Launch Notepad
STRING notepad
ENTER
DELAY 1000

REM Type some text
STRING Hello from HackDucky!
ENTER

REM Save the file
CTRL s
STRING test.txt
ENTER
ALT F4


💡 Understanding the Script

Let's break down what each part does:

1. GUI r - Opens the Run dialog (Windows key + R)
2. STRING notepad - Types "notepad" into the Run dialog
3. STRING Hello from HackDucky! - Types our message
4. CTRL s - Uses the save shortcut
5. ALT F4 - Closes Notepad when we're done

This is just an example script to get you started. Ready to write your own script? Type "write" to open the editor!`;

export default tutorialContent; 