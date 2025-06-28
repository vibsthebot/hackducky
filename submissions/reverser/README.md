# 🦆 Rubber Ducky Reverse Shell

**Author**: Aarav J  
**Payload**: Windows PowerShell Reverse Shell  
**Use**: For testing and educational use only.

---

## 💻 What it does

This script opens a **reverse shell** from the target computer to your listener using **PowerShell**.

Once plugged in, it:
- Hides the PowerShell window  
- Connects to your IP and port  
- Gives full remote shell access

---

## 🔧 How to use

1. **Start a listener** on your computer:
   ```
     nc -lvnp 4444
   ```


2. **Edit the payload**:  
   Replace `192.168.1.100` in the script with your local IP.

3. **Copy** the `.txt` file to the hackducky  

4. **Plug it into the target** and wait for the shell to connect back heheheh.

---

## ⚠️ Warning

This is for **educational use only**.  
Do **not** use this on any device you don’t own or have permission to test.

---
