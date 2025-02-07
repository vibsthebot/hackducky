'use client';

import { useRouter } from 'next/navigation';

export default function SubmitPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen h-screen bg-[#0a0a0a] text-[#39ff14] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[#39ff14]/20 flex-shrink-0">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Submit Your HackDucky Script</h1>
                    <button
                        onClick={() => router.push('/editor')}
                        className="px-4 py-2 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 rounded hover:bg-[#39ff14]/20 transition-colors"
                    >
                        Back to Editor
                    </button>
                </div>
            </div>

            {/* Embedded Form */}
            <div className="flex-1 w-full h-[calc(100vh-73px)]">
                <iframe
                    src="https://forms.hackclub.com/t/cAEHXgvZhWus"
                    className="w-full h-full border-none bg-white"
                    title="HackDucky Script Submission Form"
                />
            </div>
        </div>
    );
}