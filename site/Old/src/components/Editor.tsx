'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Editor: React.FC = () => {
    const [script, setScript] = useState('');
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lineCount, setLineCount] = useState(1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const count = (script.match(/\n/g) || []).length + 1;
        setLineCount(count);
    }, [script]);

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const runScript = () => {
        const lines = script.split('\n');
        const newOutput: string[] = [];
        let hasError = false;

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('REM')) {
                newOutput.push(`Line ${index + 1}: Comment - ${trimmedLine.slice(3).trim()}`);
            } else if (trimmedLine.startsWith('DELAY')) {
                const delayValue = trimmedLine.slice(5).trim();
                if (!isNaN(Number(delayValue))) {
                    newOutput.push(`Line ${index + 1}: Delay for ${delayValue} ms`);
                } else {
                    newOutput.push(`Line ${index + 1}: Error - Invalid delay value`);
                    hasError = true;
                }
            } else if (trimmedLine.startsWith('STRING')) {
                newOutput.push(`Line ${index + 1}: Type string - ${trimmedLine.slice(6).trim()}`);
            } else if (trimmedLine.startsWith('GUI')) {
                newOutput.push(`Line ${index + 1}: Press GUI key - ${trimmedLine.slice(3).trim()}`);
            } else if (trimmedLine === 'ENTER') {
                newOutput.push(`Line ${index + 1}: Press ENTER key`);
            } else if (trimmedLine) {
                newOutput.push(`Line ${index + 1}: Error - Unknown command`);
                hasError = true;
            }
        });

        setOutput(newOutput);
        setError(hasError ? 'Script contains errors. Please review the output.' : null);
    };

    const handleSubmit = () => {
        const encodedScript = encodeURIComponent(script);
        router.push(`/submit?script=${encodedScript}`);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#0a0a0a] text-[#39ff14] p-6">
            <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">HackDucky Script Editor</h1>
                    <p className="text-sm opacity-80">Write and test your DuckyScript commands here.</p>
                </div>
                <button
                    onClick={() => router.push('/documentation')}
                    className="px-4 py-2 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 rounded hover:bg-[#39ff14]/20 transition-colors"
                >
                    Documentation
                </button>
            </div>
            
            <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-lg shadow-lg border border-[#39ff14]/30 overflow-hidden">
                <div className="flex relative">
                    {/* Line numbers */}
                    <div 
                        ref={lineNumbersRef}
                        className="flex flex-col items-end py-4 px-3 bg-[#151515] border-r border-[#39ff14]/20 select-none overflow-hidden"
                        style={{ height: '400px' }}
                    >
                        {Array.from({ length: lineCount }, (_, i) => (
                            <div key={i} className="text-sm text-[#39ff14]/50 font-mono h-6 leading-6 min-w-[2ch]">
                                {(i + 1).toString().padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        onScroll={handleScroll}
                        className="w-full h-[400px] bg-transparent text-[#39ff14] p-4 font-mono text-sm resize-none focus:outline-none"
                        placeholder="// Write your HackScript here...
// Example:
REM Open notepad
GUI r
DELAY 500
STRING notepad
ENTER"
                        spellCheck="false"
                    />
                </div>
            </div>

            <div className="w-full max-w-4xl mt-4 flex justify-between items-center">
                <button
                    onClick={() => setScript('')}
                    className="px-4 py-2 text-sm bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 rounded hover:bg-[#39ff14]/20 transition-colors"
                >
                    Clear Script
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={runScript}
                        className="px-6 py-2 bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14] rounded hover:bg-[#39ff14]/30 transition-colors font-bold"
                    >
                        ▶ Run Script
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#39ff14]/30 text-[#39ff14] border border-[#39ff14] rounded hover:bg-[#39ff14]/40 transition-colors font-bold"
                    >
                        📤 Submit Script
                    </button>
                </div>
            </div>

            {error && (
                <div className="w-full max-w-4xl mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500">
                    ⚠️ {error}
                </div>
            )}

            {output.length > 0 && (
                <div className="w-full max-w-4xl mt-4">
                    <h2 className="text-lg font-bold mb-2">Output</h2>
                    <div className="bg-[#1a1a1a] p-4 border border-[#39ff14]/30 rounded-lg font-mono text-sm">
                        {output.map((line, index) => (
                            <div 
                                key={index} 
                                className={`py-1 ${line.includes('Error') ? 'text-red-500' : ''}`}
                            >
                                {line}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor; 