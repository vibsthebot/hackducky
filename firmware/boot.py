import board
import digitalio
import storage
import usb_cdc
import usb_hid
import time

program_pin = digitalio.DigitalInOut(board.GP25)
program_pin.direction = digitalio.Direction.INPUT
program_pin.pull = digitalio.Pull.UP

print("Boot.py: Starting...")

if not program_pin.value:
    print("Boot.py: Entering programming mode")
    storage.remount("/", readonly=False)
    storage.enable_usb_drive()
    usb_hid.disable()
else:
    print("Boot.py: Entering payload mode")
    storage.disable_usb_drive()
    
    try:
        print("Boot.py: Configuring USB HID")
        usb_hid.enable((usb_hid.Device.KEYBOARD,))
        usb_cdc.disable()
        
        time.sleep(0.5)
        
        if usb_hid.devices:
            print("Boot.py: HID keyboard enabled successfully")
        else:
            print("Boot.py: WARNING - No HID devices available after enable")
    except Exception as e:
        print(f"Boot.py: Error enabling HID: {str(e)}")

print("Boot.py: Completed") 