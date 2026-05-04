import CLIPortfolio from './CLIPortfolio';

export default function TerminalPreview() {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden border border-gray-800 relative">
      <div className="absolute inset-x-0 top-0 h-8 bg-gray-900 border-b border-gray-800 flex items-center px-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="mx-auto text-xs font-mono text-gray-500 flex items-center gap-2">
          <span>bash</span>
        </div>
      </div>

      <div className="h-full pt-8">
        <CLIPortfolio />
      </div>
    </div>
  );
}
