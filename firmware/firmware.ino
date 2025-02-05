#include <SPI.h>
#include <SD.h>
#include "Adafruit_TinyUSB.h"
#include <vector>
#include <map>

#define SD_CS_PIN   5    
#define SD_SCK_PIN  2    
#define SD_MOSI_PIN 3    
#define SD_MISO_PIN 4    

#define LED_PIN     25   

#define BUTTON_PIN  28   

Adafruit_USBD_HID usb_hid1;  // USB C
Adafruit_USBD_HID usb_hid2;  // USB A
File scriptFile;

#define KEY_GUI KEY_LEFTGUI
#define KEY_WINDOWS KEY_GUI

#define MAX_VARIABLES 10
#define MAX_FUNCTIONS 5

#define USB_MODE_HID 1
#define USB_MODE_STORAGE 2
#define USB_MODE_BOTH 3

#define ERROR_LED_PATTERN 3
#define SUCCESS_LED_PATTERN 2
#define WORKING_LED_PATTERN 1

struct KeyboardState {
  bool capsLock = false;
  bool numLock = false;
  bool scrollLock = false;
  uint32_t defaultDelay = 0;
  String lastCommand = "";
  
  std::map<String, String> variables;
  
  struct Function {
    String name;
    std::vector<String> commands;
  };
  std::vector<Function> functions;
  
  bool inIfBlock = false;
  bool ifCondition = false;
  bool skipBlock = false;
  
  int loopCount = 0;
  int currentLoop = 0;
  std::vector<String> loopCommands;
  bool inLoop = false;
  
  uint8_t currentMode = USB_MODE_HID;
  String currentLocale = "US";
} kbState;

bool exfilModeEnabled = false;
File lootFile;

long randomSeed = 0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  SPI.setRX(SD_MISO_PIN);
  SPI.setTX(SD_MOSI_PIN);
  SPI.setSCK(SD_SCK_PIN);
  
  if (!usb_hid1.begin() || !usb_hid2.begin()) {
    digitalWrite(LED_PIN, HIGH);  
    while(1) delay(1); 
  }

  usb_hid1.setPollInterval(1);
  usb_hid2.setPollInterval(1);
  
  if (!SD.begin(SD_CS_PIN)) {
    while(1) {
      digitalWrite(LED_PIN, HIGH);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      delay(100);
    }
  }
  
  Serial.begin(115200);
  
  Serial.println("SD Card Initialized!");

  File dir = SD.open("/");
  if (!dir) {
    Serial.println("Failed to open directory");
    return;
  }

  String scriptFilename = "";
  while (true) {
    File entry = dir.openNextFile();
    if (!entry) {
      Serial.println("No .txt file found on the SD card");
      break;
    }

    if (entry.isFile() && entry.name()[strlen(entry.name()) - 4] == '.') {
      String filename = entry.name();
      if (filename.endsWith(".txt")) {
        scriptFilename = filename;
        break;
      }
    }
    entry.close();
  }

  if (scriptFilename == "") {
    Serial.println("No .txt script file found.");
    return;
  }

  scriptFile = SD.open(scriptFilename);
  if (!scriptFile) {
    Serial.println("Failed to open the script file");
    return;
  }
  Serial.println("Running script: " + scriptFilename);
  
  if (!SD.exists("/loot.bin")) {
    lootFile = SD.open("/loot.bin", FILE_WRITE);
    lootFile.close();
  }
  
  runScript();
}

void loop() {
}

void runScript() {
  String line = "";
  while (scriptFile.available()) {
    char c = scriptFile.read();
    
    if (c == '\n') {
      parseDuckyScript(line);
      line = "";
    } else {
      line += c;
    }
  }
  usb_hid1.keyboardReleaseAll();  
  usb_hid2.keyboardReleaseAll();  
  scriptFile.close();  
}

void handleError(const char* error) {
  Serial.print("ERROR: ");
  Serial.println(error);
  
  for(int i = 0; i < 3; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  }
}

void parseDuckyScript(String line) {
  line.trim();
  
  if (line.length() == 0 || line.startsWith("REM")) {
    return;
  }

  if (line.length() > 256) {
    handleError("Command too long");
    return;
  }

  try {
    if (kbState.defaultDelay > 0) {
      delay(kbState.defaultDelay);
    }

    if (line.startsWith("DEFINE")) {
      int firstSpace = line.indexOf(' ');
      int secondSpace = line.indexOf(' ', firstSpace + 1);
      if (firstSpace < 0 || secondSpace < 0) {
        handleError("Invalid DEFINE syntax");
        return;
      }
      String constName = line.substring(firstSpace + 1, secondSpace);
      if (constName.length() == 0) {
        handleError("Empty constant name");
        return;
      }
      String constValue = line.substring(secondSpace + 1);
      kbState.variables[constName] = constValue;
      return;
    }

    if (line.startsWith("VAR")) {
      int firstSpace = line.indexOf(' ');
      if (firstSpace < 0) {
        handleError("Invalid VAR syntax");
        return;
      }
      String varName = line.substring(firstSpace + 1);
      int secondSpace = varName.indexOf(' ');
      String varValue = "";
      if (secondSpace > 0) {
        varValue = evaluateExpression(varName.substring(secondSpace + 1));
        varName = varName.substring(0, secondSpace);
      }
      if (varName.length() == 0) {
        handleError("Empty variable name");
        return;
      }
      if (kbState.variables.size() >= MAX_VARIABLES) {
        handleError("Too many variables");
        return;
      }
      kbState.variables[varName] = varValue;
      return;
    }

    if (line.startsWith("STRING")) {
      bool addNewline = line.startsWith("STRINGLN");
      if (line.length() < (addNewline ? 9 : 7)) {
        handleError("Invalid STRING syntax");
        return;
      }
      String text = line.substring(addNewline ? 9 : 7);
      
      while (text.indexOf("$") >= 0) {
        int start = text.indexOf("$");
        int end = text.indexOf(" ", start);
        if (end < 0) end = text.length();
        String varName = text.substring(start + 1, end);
        if (kbState.variables.count(varName) == 0) {
          handleError("Undefined variable: " + varName);
          return;
        }
        String value = kbState.variables[varName];
        text = text.substring(0, start) + value + text.substring(end);
      }
      
      typeString(text);
      if (addNewline) {
        usb_hid1.keyboardPress(KEY_ENTER);
        usb_hid2.keyboardPress(KEY_ENTER);
        delay(50);
        usb_hid1.keyboardReleaseAll();
        usb_hid2.keyboardReleaseAll();
      }
      return;
    }

    if (line.startsWith("REPEAT")) {
      if (kbState.lastCommand.length() == 0) {
        handleError("No command to repeat");
        return;
      }
      int count = line.substring(7).toInt();
      if (count <= 0 || count > 100) {
        handleError("Invalid repeat count");
        return;
      }
      for (int i = 0; i < count; i++) {
        parseDuckyScript(kbState.lastCommand);
        delay(50);
      }
      return;
    }

    if (!handleKeyCommand(line)) {
      handleError("Invalid key command");
      return;
    }

  } catch (...) {
    handleError("Unknown error processing command");
    return;
  }
}

bool handleKeyCommand(String line) {
  String keys[5];
  int keyCount = 0;
  
  int start = 0;
  int space;
  while ((space = line.indexOf(' ', start)) != -1 && keyCount < 5) {
    keys[keyCount++] = line.substring(start, space);
    start = space + 1;
  }
  if (start < line.length()) {
    keys[keyCount++] = line.substring(start);
  }

  if (keyCount == 0) return false;

  bool shift = false, ctrl = false, alt = false, gui = false;
  int lastMod = 0;

  for (int i = 0; i < keyCount - 1; i++) {
    String key = keys[i];
    if (key == "CTRL" || key == "CONTROL") ctrl = true;
    else if (key == "SHIFT") shift = true;
    else if (key == "ALT") alt = true;
    else if (key == "GUI" || key == "WINDOWS") gui = true;
    else return false; 
    lastMod = i;
  }

  String finalKey = keys[lastMod + 1];
  uint8_t keycode = getKeycode(finalKey);
  if (keycode == 0) return false;

  if (shift) {
    usb_hid1.keyboardPress(KEY_LEFTSHIFT);
    usb_hid2.keyboardPress(KEY_LEFTSHIFT);
  }
  if (ctrl) {
    usb_hid1.keyboardPress(KEY_LEFTCTRL);
    usb_hid2.keyboardPress(KEY_LEFTCTRL);
  }
  if (alt) {
    usb_hid1.keyboardPress(KEY_LEFTALT);
    usb_hid2.keyboardPress(KEY_LEFTALT);
  }
  if (gui) {
    usb_hid1.keyboardPress(KEY_GUI);
    usb_hid2.keyboardPress(KEY_GUI);
  }

  usb_hid1.keyboardPress(keycode);
  usb_hid2.keyboardPress(keycode);
  delay(50);
  usb_hid1.keyboardReleaseAll();
  usb_hid2.keyboardReleaseAll();
  delay(50);

  return true;
}

void typeString(String text) {
  if (kbState.currentLocale == "DE") {
    // German keyboard mappings - TBD
  }
  else if (kbState.currentLocale == "FR") {
    // French keyboard mappings - TBD
  }
  for (unsigned int i = 0; i < text.length(); i++) {
    char c = text.charAt(i);
    
    if (isUpperCase(c)) {
      usb_hid1.keyboardPress(KEY_LEFTSHIFT);
      usb_hid2.keyboardPress(KEY_LEFTSHIFT);
      usb_hid1.keyboardPress(toLowerCase(c));
      usb_hid2.keyboardPress(toLowerCase(c));
      delay(50);
      usb_hid1.keyboardReleaseAll();
      usb_hid2.keyboardReleaseAll();
    }
    else if (strchr("!@#$%^&*()_+{}|:\"<>?~", c)) {
      usb_hid1.keyboardPress(KEY_LEFTSHIFT);
      usb_hid2.keyboardPress(KEY_LEFTSHIFT);
      switch(c) {
        case '!': 
          usb_hid1.keyboardPress('1');
          usb_hid2.keyboardPress('1');
          break;
        case '@': 
          usb_hid1.keyboardPress('2');
          usb_hid2.keyboardPress('2');
          break;
        case '#': 
          usb_hid1.keyboardPress('3');
          usb_hid2.keyboardPress('3');
          break;
        case '$': 
          usb_hid1.keyboardPress('4');
          usb_hid2.keyboardPress('4');
          break;
        case '%': 
          usb_hid1.keyboardPress('5');
          usb_hid2.keyboardPress('5');
          break;
        case '^': 
          usb_hid1.keyboardPress('6');
          usb_hid2.keyboardPress('6');
          break;
        case '&': 
          usb_hid1.keyboardPress('7');
          usb_hid2.keyboardPress('7');
          break;
        case '*': 
          usb_hid1.keyboardPress('8');
          usb_hid2.keyboardPress('8');
          break;
        case '(': 
          usb_hid1.keyboardPress('9');
          usb_hid2.keyboardPress('9');
          break;
        case ')': 
          usb_hid1.keyboardPress('0');
          usb_hid2.keyboardPress('0');
          break;
        case '_': 
          usb_hid1.keyboardPress('-');
          usb_hid2.keyboardPress('-');
          break;
        case '+': 
          usb_hid1.keyboardPress('=');
          usb_hid2.keyboardPress('=');
          break;
        case '{': 
          usb_hid1.keyboardPress('[');
          usb_hid2.keyboardPress('[');
          break;
        case '}': 
          usb_hid1.keyboardPress(']');
          usb_hid2.keyboardPress(']');
          break;
        case '|': 
          usb_hid1.keyboardPress('\\');
          usb_hid2.keyboardPress('\\');
          break;
        case ':': 
          usb_hid1.keyboardPress(';');
          usb_hid2.keyboardPress(';');
          break;
        case '"': 
          usb_hid1.keyboardPress('\'');
          usb_hid2.keyboardPress('\'');
          break;
        case '<': 
          usb_hid1.keyboardPress(',');
          usb_hid2.keyboardPress(',');
          break;
        case '>': 
          usb_hid1.keyboardPress('.');
          usb_hid2.keyboardPress('.');
          break;
        case '?': 
          usb_hid1.keyboardPress('/');
          usb_hid2.keyboardPress('/');
          break;
        case '~': 
          usb_hid1.keyboardPress('`');
          usb_hid2.keyboardPress('`');
          break;
      }
      delay(50);
      usb_hid1.keyboardReleaseAll();
      usb_hid2.keyboardReleaseAll();
    }
    else {
      usb_hid1.keyboardPress(c);
      usb_hid2.keyboardPress(c);
      delay(50);
      usb_hid1.keyboardReleaseAll();
      usb_hid2.keyboardReleaseAll();
    }
    delay(50);
  }
}

void handleAttackMode(String line) {
  if (line == "ATTACKMODE HID") {
    kbState.currentMode = USB_MODE_HID;
    usb_hid1.begin();
    usb_hid2.begin();
    usb_hid1.setPollInterval(1);
    usb_hid2.setPollInterval(1);
  }
  else if (line == "ATTACKMODE STORAGE") {
    kbState.currentMode = USB_MODE_STORAGE;
    usb_hid1.end();
    usb_hid2.end();
    if (!SD.begin(SD_CS_PIN)) {
      Serial.println("Storage mode failed!");
      return;
    }
  }
  else if (line == "ATTACKMODE HID STORAGE") {
    kbState.currentMode = USB_MODE_BOTH;
    usb_hid1.begin();
    usb_hid2.begin();
    usb_hid1.setPollInterval(1);
    usb_hid2.setPollInterval(1);
    if (!SD.begin(SD_CS_PIN)) {
      Serial.println("Storage mode failed!");
      return;
    }
  }
  
  delay(1000);
}

void handleHoldKey(String key) {
  uint8_t keycode = getKeycode(key);
  if (keycode) {
    usb_hid1.keyboardPress(keycode);
    usb_hid2.keyboardPress(keycode);
  }
}

void handleReleaseKey(String key) {
  uint8_t keycode = getKeycode(key);
  if (keycode) {
    usb_hid1.keyboardRelease(keycode);
    usb_hid2.keyboardRelease(keycode);
  }
}

void handleExfiltration(String line) {
  if (exfilModeEnabled) {
    lootFile = SD.open("/loot.bin", FILE_WRITE);
    if (lootFile) {
      lootFile.write((uint8_t*)line.c_str(), line.length());
      lootFile.close();
    }
  }
}

void waitForButtonPress() {
  while (digitalRead(BUTTON_PIN) == HIGH) {
    delay(50);
  }
  delay(50);
}

void setLED(uint8_t state) {
  const int LED_R = 13; 
  const int LED_G = 12;
  const int LED_B = 11;
  
  switch(state) {
    case 0:  
      digitalWrite(LED_R, LOW);
      digitalWrite(LED_G, LOW);
      digitalWrite(LED_B, LOW);
      break;
    case 1:  
      digitalWrite(LED_R, HIGH);
      digitalWrite(LED_G, LOW);
      digitalWrite(LED_B, LOW);
      break;
    case 2: 
      digitalWrite(LED_R, LOW);
      digitalWrite(LED_G, HIGH);
      digitalWrite(LED_B, LOW);
      break;
  }
}

long random(long min, long max) {
  randomSeed = (randomSeed * 1103515245 + 12345) & 0x7fffffff;
  return min + (randomSeed % (max - min + 1));
}

String evaluateExpression(String expr) {
  expr.trim();
  
  if (expr.indexOf("*") >= 0) {
    int opIndex = expr.indexOf("*");
    String left = evaluateExpression(expr.substring(0, opIndex));
    String right = evaluateExpression(expr.substring(opIndex + 1));
    return String(left.toInt() * right.toInt());
  }
  
  if (expr.indexOf("/") >= 0) {
    int opIndex = expr.indexOf("/");
    String left = evaluateExpression(expr.substring(0, opIndex));
    String right = evaluateExpression(expr.substring(opIndex + 1));
    if (right.toInt() != 0) {
      return String(left.toInt() / right.toInt());
    }
    return "0"; 
  }
  
  if (expr.indexOf("%") >= 0) {
    int opIndex = expr.indexOf("%");
    String left = evaluateExpression(expr.substring(0, opIndex));
    String right = evaluateExpression(expr.substring(opIndex + 1));
    if (right.toInt() != 0) {
      return String(left.toInt() % right.toInt());
    }
    return "0"; 
  }
  
  if (expr.indexOf("-") >= 0) {
    int opIndex = expr.indexOf("-");
    String left = evaluateExpression(expr.substring(0, opIndex));
    String right = evaluateExpression(expr.substring(opIndex + 1));
    return String(left.toInt() - right.toInt());
  }
  
  if (expr.startsWith("$")) {
    String varName = expr.substring(1);
    if (kbState.variables.count(varName) > 0) {
      return kbState.variables[varName];
    }
    return "";
  }
  
  if (expr.indexOf("+") >= 0) {
    int opIndex = expr.indexOf("+");
    String left = evaluateExpression(expr.substring(0, opIndex));
    String right = evaluateExpression(expr.substring(opIndex + 1));
    return String(left.toInt() + right.toInt());
  }
  
  if (expr.startsWith("RANDOM")) {
    int start = expr.indexOf("(");
    int end = expr.indexOf(")");
    if (start >= 0 && end >= 0) {
      String params = expr.substring(start + 1, end);
      int comma = params.indexOf(",");
      if (comma >= 0) {
        long min = params.substring(0, comma).toInt();
        long max = params.substring(comma + 1).toInt();
        return String(random(min, max));
      }
    }
  }
  
  return expr;
}

bool evaluateCondition(String condition) {
  condition.trim();
  
  if (condition.indexOf("==") >= 0) {
    int opIndex = condition.indexOf("==");
    String left = evaluateExpression(condition.substring(0, opIndex));
    String right = evaluateExpression(condition.substring(opIndex + 2));
    return left == right;
  }
  
  if (condition.indexOf("!=") >= 0) {
    int opIndex = condition.indexOf("!=");
    String left = evaluateExpression(condition.substring(0, opIndex));
    String right = evaluateExpression(condition.substring(opIndex + 2));
    return left != right;
  }

  if (condition.indexOf(">=") >= 0) {
    int opIndex = condition.indexOf(">=");
    String left = evaluateExpression(condition.substring(0, opIndex));
    String right = evaluateExpression(condition.substring(opIndex + 2));
    return left.toInt() >= right.toInt();
  }

  if (condition.indexOf("<=") >= 0) {
    int opIndex = condition.indexOf("<=");
    String left = evaluateExpression(condition.substring(0, opIndex));
    String right = evaluateExpression(condition.substring(opIndex + 2));
    return left.toInt() <= right.toInt();
  }
  
  if (condition.indexOf(">") >= 0) {
    int opIndex = condition.indexOf(">");
    String left = evaluateExpression(condition.substring(0, opIndex));
    String right = evaluateExpression(condition.substring(opIndex + 1));
    return left.toInt() > right.toInt();
  }

  if (condition.indexOf("<") >= 0) {
    int opIndex = condition.indexOf("<");
    String left = evaluateExpression(condition.substring(0, opIndex));
    String right = evaluateExpression(condition.substring(opIndex + 1));
    return left.toInt() < right.toInt();
  }
  
  return false;
}

uint8_t getKeycode(String key) {
  if (key.length() == 1) {
    return key.charAt(0);
  }

  if (key.startsWith("F") && key.length() <= 3) {
    int fNum = key.substring(1).toInt();
    if (fNum >= 1 && fNum <= 12) {
      return KEY_F1 + (fNum - 1);
    }
  }

  if (key == "ENTER") return KEY_ENTER;
  if (key == "ESCAPE" || key == "ESC") return KEY_ESC;
  if (key == "BACKSPACE") return KEY_BACKSPACE;
  if (key == "DELETE") return KEY_DELETE;
  if (key == "TAB") return KEY_TAB;
  if (key == "SPACE") return ' ';
  if (key == "CAPSLOCK") return KEY_CAPS_LOCK;
  if (key == "PRINTSCREEN") return KEY_PRINT;
  if (key == "SCROLLLOCK") return KEY_SCROLLLOCK;
  if (key == "PAUSE") return KEY_PAUSE;
  if (key == "INSERT") return KEY_INSERT;
  if (key == "HOME") return KEY_HOME;
  if (key == "PAGEUP") return KEY_PAGE_UP;
  if (key == "PAGEDOWN") return KEY_PAGE_DOWN;
  if (key == "END") return KEY_END;
  if (key == "RIGHT" || key == "RIGHTARROW") return KEY_RIGHT_ARROW;
  if (key == "LEFT" || key == "LEFTARROW") return KEY_LEFT_ARROW;
  if (key == "DOWN" || key == "DOWNARROW") return KEY_DOWN_ARROW;
  if (key == "UP" || key == "UPARROW") return KEY_UP_ARROW;
  if (key == "MENU") return KEY_MENU;
  if (key == "APP") return KEY_MENU;

  if (key == "NUMLOCK") return KEY_NUM_LOCK;
  if (key == "KP_SLASH") return KEY_KP_SLASH;
  if (key == "KP_ASTERISK") return KEY_KP_ASTERISK;
  if (key == "KP_MINUS") return KEY_KP_MINUS;
  if (key == "KP_PLUS") return KEY_KP_PLUS;
  if (key == "KP_ENTER") return KEY_KP_ENTER;

  if (key == "BREAK" || key == "PAUSE") return KEY_PAUSE;
  
  if (key == "NUMPAD_0") return KEY_KP_0;
  if (key == "NUMPAD_1") return KEY_KP_1;
  if (key == "NUMPAD_2") return KEY_KP_2;
  if (key == "NUMPAD_3") return KEY_KP_3;
  if (key == "NUMPAD_4") return KEY_KP_4;
  if (key == "NUMPAD_5") return KEY_KP_5;
  if (key == "NUMPAD_6") return KEY_KP_6;
  if (key == "NUMPAD_7") return KEY_KP_7;
  if (key == "NUMPAD_8") return KEY_KP_8;
  if (key == "NUMPAD_9") return KEY_KP_9;
  if (key == "NUMPAD_DOT") return KEY_KP_DOT;
  if (key == "NUMPAD_PLUS") return KEY_KP_PLUS;
  if (key == "NUMPAD_MINUS") return KEY_KP_MINUS;
  if (key == "NUMPAD_MULTIPLY") return KEY_KP_MULTIPLY;
  if (key == "NUMPAD_DIVIDE") return KEY_KP_DIVIDE;
  if (key == "NUMPAD_ENTER") return KEY_KP_ENTER;

  return 0;
}
