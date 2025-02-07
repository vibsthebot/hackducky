'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import tutorialContent from '../data/tutorial';

interface TerminalProps {
    className?: string;
}

const Terminal: React.FC<TerminalProps> = ({ className }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const router = useRouter();
    const [initialized, setInitialized] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const asciiArt = [
            '██╗  ██╗ █████╗  ██████╗██╗  ██╗██████╗ ██╗   ██╗ ██████╗██╗  ██╗██╗   ██╗',
            '██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██║   ██║██╔════╝██║ ██╔╝╚██╗ ██╔╝',
            '███████║███████║██║     █████╔╝ ██║  ██║██║   ██║██║     █████╔╝  ╚████╔╝ ',
            '██╔══██║██╔══██║██║     ██╔═██╗ ██║  ██║██║   ██║██║     ██╔═██╗   ╚██╔╝  ',
            '██║  ██║██║  ██║╚██████╗██║  ██╗██████╔╝╚██████╔╝╚██████╗██║  ██╗   ██║   ',
            '╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝   ╚═╝   ',
            '',
            'HackDucky Terminal v1.0',
            'Type "help" to get started',
            ''
        ];

        setLines(asciiArt);
        setInitialized(true);

        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    const typeText = async (text: string) => {
        for (const char of text) {
            setLines(prev => {
                const lastLine = prev[prev.length - 1];
                return [...prev.slice(0, -1), lastLine + char];
            });
            await new Promise(resolve => setTimeout(resolve, 50)); 
        }
        setLines(prev => [...prev, '', '']); 
    };

    const startTutorial = async () => {
        const sections = tutorialContent.split('---').map(section => section.trim());
        
        const intro = sections[0].split('\n');
        for (const line of intro) {
            await typeText(line);
        }

        for (let i = 1; i < sections.length; i++) {
            const section = sections[i];
            const lines = section.split('\n');

            await typeText('\n');

            for (const line of lines) {
                if (line.startsWith('```') && line.endsWith('```')) continue;
                
                if (line.startsWith('```ducky')) {
                    await typeText('Example code:');
                    continue;
                }

                if (line.startsWith('#')) {
                    const formattedHeader = line.replace(/^#+\s/, '').toUpperCase();
                    await typeText('\n' + formattedHeader);
                    await typeText('=' + '='.repeat(formattedHeader.length));
                    continue;
                }

                if (line.startsWith('- ')) {
                    await typeText('  ' + line);
                    continue;
                }

                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '$1');
                
                if (formattedLine.trim()) {
                    await typeText(formattedLine);
                }
            }
        }

        await typeText('\nType "write" when you\'re ready to create your own script!\n');
    };

    const processCommand = (cmd: string) => {
        const command = cmd.toLowerCase().trim();
        
        setLines(prev => [...prev, `hackducky@terminal:~$ ${cmd}`, '']);

        switch(command) {
            case 'help':
                setLines(prev => [...prev,
                    '',  
                    'Available commands:',
                    '  help     - Show this help message',
                    '  tutorial - Learn HackScript basics',
                    '  info     - About HackDucky',
                    '  clear    - Clear terminal',
                    '  write    - Open the script editor',
                    ''
                ]);
                break;

            case 'tutorial':
                startTutorial();
                break;

            case 'info':
                setLines(prev => [...prev,
                    'HackDucky - DIY Rubber Ducky',
                    '------------------------',
                    'A keystroke injection tool built on RP2040',
                    'Type "write" to create your first script!',
                    ''
                ]);
                break;

            case 'clear':
                setLines([]);
                break;

            case 'write':
                setLines(prev => [...prev,
                    'Opening script editor...',
                    ''
                ]);
                setTimeout(() => {
                    router.push('/editor');
                }, 500);
                break;

            default:
                setLines(prev => [...prev,
                    '',  
                    `Command not found: ${cmd}`,
                    'Type "help" for available commands',
                    ''
                ]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const command = input.trim();
            if (command) {
                processCommand(command);
                setInput('');
            }
        }
    };

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
            <div 
                ref={terminalRef}
                className={`font-mono text-sm p-10 bg-[#0a0a0a] text-[#39ff14] min-h-[600px] max-h-[800px] overflow-y-auto w-full max-w-4xl ${className || ''}`}
            >
                <div className="whitespace-pre-wrap mb-2">
                    {lines.join('\n')}
                </div>
                <div className="flex items-center">
                    <span className="mr-2">hackducky@terminal:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-transparent outline-none border-none text-[#39ff14]"
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
};

export default Terminal;