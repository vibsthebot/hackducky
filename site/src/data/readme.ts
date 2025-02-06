const readmeContent = `# HackDucky

A versatile USB rubber ducky built on the RP2040 platform that supports the full HackScript language.

## Overview

HackDucky is a programmable USB device that can automate keyboard inputs. It's built on the powerful RP2040 microcontroller and supports an extended version of DuckyScript called HackScript.

## Getting Started

1. **Hardware Setup**
   - Connect your HackDucky to a MicroSD card
   - Insert the MicroSD card into the device
   - Connect to your computer via USB

2. **Creating Scripts**
   - Create a new text file with \`.txt\` extension
   - Write your HackScript commands
   - Save to the MicroSD card
   - Test in a safe environment

## Basic Commands

### Essential Commands
- \`REM\` - Add comments to your script
- \`STRING\` - Type text
- \`DELAY\` - Wait for specified milliseconds
- \`DEFAULT_DELAY\` - Set delay between all commands

### Keyboard Commands
- \`ENTER\`, \`SPACE\`, \`TAB\`, \`ESCAPE\`
- \`UP\`, \`DOWN\`, \`LEFT\`, \`RIGHT\`
- \`F1\`-\`F12\` function keys
- Modifiers: \`CTRL\`, \`SHIFT\`, \`ALT\`, \`GUI\`

## LED Status Indicators

**Single Blink**: Working/Processing  
**Double Blink**: Success  
**Triple Blink**: Error Occurred  
**Rapid Blink**: SD Card Error  

## Advanced Features

### Variables & Math
\`\`\`ducky
VAR counter 0
WHILE $counter < 5
    SET counter $counter + 1
    STRING Count: $counter
    ENTER
END_WHILE
\`\`\`

### Functions
\`\`\`ducky
FUNCTION PRINT_HEADER
    STRING ==================
    ENTER
    STRING = System Report =
    ENTER
    STRING ==================
    ENTER
END_FUNCTION

CALL PRINT_HEADER
\`\`\`

## Troubleshooting

### Common Issues
1. **Script Not Running**
   - Verify script syntax
   - Check file extension
   - Ensure proper SD card formatting

2. **Device Not Recognized**
   - Try different USB port
   - Check USB connection
   - Verify system compatibility

## Safety Guidelines

- **Always test scripts** in a safe environment
- Keep backups of your scripts
- Use with caution and responsibility
- Not for malicious purposes

## Contributing

We welcome contributions! Feel free to:
- Submit bug reports
- Suggest new features
- Create pull requests
- Share example scripts

## License

This project is open source under the MIT License.`;

export default readmeContent;