'use client';

export default function Submit() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] font-mono text-[#39ff14] flex flex-col overflow-hidden">
      <div className="m-5 p-5 bg-[#1a1a1a] rounded flex-grow overflow-y-auto shadow-[0_0_10px_rgba(57,255,20,0.3)]">
        <iframe
          src="https://forms.hackclub.com/t/cAEHXgvZhWus"
          className="w-full h-full min-h-[800px] border-none"
          title="HackDucky Submission Form"
        />
      </div>
    </main>
  );
}