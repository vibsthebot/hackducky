'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import readmeContent from '@/data/readme';
import tutorialContent from '@/data/tutorial';

const DocumentationPage = () => {
    const [activeTab, setActiveTab] = useState<'readme' | 'tutorial'>('readme');
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#39ff14]">
            {/* Navigation Header - Fixed at top */}
            <div className="fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-[#39ff14]/20 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">HackDucky Documentation</h1>
                        <button
                            onClick={() => router.push('/editor')}
                            className="px-4 py-2 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 rounded hover:bg-[#39ff14]/20 transition-colors"
                        >
                            Back to Editor
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => setActiveTab('readme')}
                            className={`px-6 py-2 rounded-t-lg transition-colors ${
                                activeTab === 'readme' 
                                    ? 'bg-[#1a1a1a] border-t border-l border-r border-[#39ff14]' 
                                    : 'bg-[#39ff14]/10 border border-[#39ff14]/30'
                            }`}
                        >
                            README
                        </button>
                        <button
                            onClick={() => setActiveTab('tutorial')}
                            className={`px-6 py-2 rounded-t-lg transition-colors ${
                                activeTab === 'tutorial' 
                                    ? 'bg-[#1a1a1a] border-t border-l border-r border-[#39ff14]' 
                                    : 'bg-[#39ff14]/10 border border-[#39ff14]/30'
                            }`}
                        >
                            Tutorial
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Scrollable with padding for fixed header */}
            <div className="pt-32 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-[#1a1a1a] rounded-lg border border-[#39ff14]/30 p-8 shadow-lg">
                        <article className="prose prose-invert max-w-none
                            [&>h1]:text-[#39ff14] [&>h1]:text-4xl [&>h1]:mb-8
                            [&>h2]:text-[#39ff14] [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-4
                            [&>h3]:text-[#39ff14] [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-3
                            [&>p]:text-gray-300 [&>p]:leading-relaxed [&>p]:mb-4
                            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4
                            [&>ul>li]:text-gray-300 [&>ul>li]:mb-2
                            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
                            [&>ol>li]:text-gray-300 [&>ol>li]:mb-2
                            [&>pre]:bg-[#151515] [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-[#39ff14]/20 [&>pre]:mb-4
                            [&>code]:bg-[#39ff14]/10 [&>code]:text-[#39ff14] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded
                            [&>blockquote]:border-l-4 [&>blockquote]:border-[#39ff14]/30 [&>blockquote]:pl-4 [&>blockquote]:italic
                            [&>table]:w-full [&>table]:mb-4
                            [&>table>thead>tr>th]:text-[#39ff14] [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-[#39ff14]/20 [&>table>thead>tr>th]:p-2
                            [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-[#39ff14]/20 [&>table>tbody>tr>td]:p-2"
                        >
                            <ReactMarkdown>
                                {activeTab === 'readme' ? readmeContent : tutorialContent}
                            </ReactMarkdown>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentationPage; 