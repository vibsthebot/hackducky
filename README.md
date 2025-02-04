# HackDucky - WIP

the hackclub themed USB rubber ducky ! - Check out [hackducky](https://hackclub.slack.com/archives/C08B8HZBC85)

# What is this?

Hackducky is hackclubs own version of making a USB rubber ducky built by hackclubers.A usb rubber ducky is basically something that looks like a USB but is actually a trojan. It pretends to be a keyboard to the computer allowing you to basically take control of the computer you plug it into

## What you get

- Hackducky Board
    -  Includes MicroSD card slot (connected via SPI)
    -  Dual USB ports (USB-A and USB-C)
    -  LED for the status - you can use it for other things if you like !
    -  Button for any extra features you may want to add !
    -  Buzzer. - Maybe ?
- Micro SD Card


## Getting Started

1. Format your MicroSD card as FAT32
2. Create a script file with `.txt` extension (e.g., `payload.txt`) - this will be your main attack script
3. Write your DuckyScript commands in the file – check out [tutorial.md](tutorial.md) for more info on how to make a DuckyScript.
4. Insert the MicroSD card into the HackDucky with your file loaded
5. Connect to target computer using either USB port and watch the computer be taken over ! ( ethically ofc)

# Submission Criteria  

## 1. Time Requirement  
- **HackDucky Light:** Minimum of **3-4 hours** of development.  
- **HackDucky Pro:** Minimum of **5-6 hours** of development.  
- **Tracking:** Use **WakaTime** to track your development hours.  

## 2. Core Features (Must have 3)  
- Not just simple actions—core features should be impactful and unique.  
- **Examples:**  
  1. Open Notepad, start typing gibberish, and change the desktop background.  
  2. Open the terminal, run commands, and create pop-ups to scare the user.  
  3. Fake a system crash by downloading a **blue screen image** and freezing the mouse.  

## 3. Additional Features (Must have 5-7)  
- Include **at least 5-7 normal features** outside of the core features.  
- The more features, the better!  

## 4. Originality  
- Your project must be an **original idea** and not a direct copy from a tutorial.  
- Tutorials can be referenced, but your submission should be your own creation.  

## 5. Submission Limit  
- You can submit **multiple projects**, but you can only receive **one HackDucky** (either Pro or Light).  


## What the LED indicators mean

- Triple blink: Error occurred with your script
- Double blink: Success ! your script worked
- Single blink: Working/Processing - running
- Rapid blinking: SD card error  - oh no something broke


## Troubleshooting the LED's

1. LED rapidly blinking at startup:
   - Check if MicroSD card is properly inserted
   - Verify card is formatted as FAT32
   - Ensure script file has .txt extension

2. Script not running:
   - Check script syntax
   - Verify file is properly saved
   - Try reformatting MicroSD card

3. Keyboard not recognized:
   - Try different USB port
   - Check USB connection
   - Verify target system supports USB HID

## Safety Notes

- pls dont hack people with this pls - its only ethical
