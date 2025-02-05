# mm you got a hackducky? - lets program it!

Welcome, you want to make a bad usb I see,k. Well, you're in luck! this is the perfect ysws for you !

---

## 🛠️ Step 1: Understanding the Basics
The hackducky uses a scripting language similar to duckyscript called hackscript. Its not really much of a difference, aside from hackscript having a few more features allowing you to control your hackducky more.

Every script follows a basic structure:
- **REM**: Comments for humans, ignored by the duck.
- **DEFAULT_DELAY**: Controls the speed of execution.
- **DELAY**: Pauses between actions (milliseconds).
- **STRING**: Types out text like a human.
- **GUI, CTRL, ALT**: Modifier keys for shortcuts.
- **ENTER**: Simulates pressing Enter.

Let's see it in action. This simple script opens Notepad, types a message, and saves the file:

```ducky
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
```

💡 **What’s happening here?**
- `GUI r` opens the Run dialog.
- `STRING notepad` types “notepad” and hits Enter.
- `STRING Hello from HackDucky!` types a message.
- `CTRL s` saves the file as "test.txt".
- `ALT F4` closes Notepad.

Boom! You just automated opening Notepad and saving a file. 🎉

---

## 🔢 Step 2: Variables and Loops
Want to make your scripts smarter? Use **variables** and **loops**!

### 🔄 Example: Counting to 5
```ducky
VAR counter 0
WHILE $counter < 5
    SET counter $counter + 1
    STRING Count: $counter
    ENTER
END_WHILE
```

💡 **What’s happening?**
- `VAR counter 0` creates a variable.
- `WHILE $counter < 5` loops while counter is less than 5.
- `SET counter $counter + 1` increases the counter.
- `STRING Count: $counter` types the current count.

Run this, and watch it type "Count: 1", "Count: 2"... up to 5! 🚀

---

## 🛠️ Step 3: Using Functions
Want to reuse some code? Functions make it easy.

### 📢 Example: Printing a Header
```ducky
FUNCTION PRINT_HEADER
    STRING ==================
    ENTER
    STRING = System Report =
    ENTER
    STRING ==================
    ENTER
END_FUNCTION

CALL PRINT_HEADER
```

💡 **What’s happening?**
- `FUNCTION PRINT_HEADER` creates a reusable block of code.
- `CALL PRINT_HEADER` runs it whenever needed.
- This prints a neat section header for reports.

---

## 🎯 What’s Next?  

Now you know the basics—time to experiment! Try making:  

✅ **A script that opens a website and types a message**  
✅ **A prank script that rickroles someone as soon as you plug in the usb**  
✅ **A function that automates logins**  
✅ **A script that runs Doom in the terminal!** – *Interesting, I see.*  


### ⚡ Pro Tips:
- Start simple, then add more features.
- Use `DELAY` wisely—too fast and your computer might miss keystrokes.
- Have fun!

Drop your creations in the #hackducky channel on the hack club slack, and let's see what you build! 🛠️🔥

