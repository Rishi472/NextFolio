import { Settings, Palette, Layout, Type } from 'lucide-react';
import { useUIStore } from '../store';
import Button from '../components/Button';

export default function DesignPanel() {
  const {
    theme, setTheme,
    colorPalette, setColorPalette,
    layoutStyle, setLayoutStyle,
  } = useUIStore();

  const themes = ['default', 'modern', 'classic'];
  const palettes = ['default', 'blue', 'purple', 'green', 'rose'];
  const layouts = ['default', 'standard', 'compact', 'grid'];

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-4 border-b border-indigo-100 flex items-center gap-2">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="font-bold text-lg text-brand-dark">Design Panel</h2>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Theme Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Layout className="w-4 h-4" /> Theme Style
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map(t => (
              <Button
                key={t}
                variant={theme === t ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTheme(t)}
                className={`capitalize ${theme !== t ? 'border border-gray-200' : ''}`}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Palette Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Palette className="w-4 h-4" /> Color Palette
          </div>
          <div className="flex gap-2 flex-wrap">
            {palettes.map(p => (
              <button
                key={p}
                title={`${p} palette`}
                onClick={() => setColorPalette(p)}
                className={`w-8 h-8 rounded-full transition-all ${
                  p === 'default' ? 'bg-gradient-to-br from-indigo-500 via-cyan-500 to-purple-500' :
                  p === 'blue' ? 'bg-blue-500' :
                  p === 'purple' ? 'bg-purple-500' :
                  p === 'green' ? 'bg-green-500' : 'bg-rose-500'
                } ${colorPalette === p ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Layout Style Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Type className="w-4 h-4" /> Layout Style
          </div>
          <div className="grid grid-cols-1 gap-2">
            {layouts.map(l => (
              <Button
                key={l}
                variant={layoutStyle === l ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setLayoutStyle(l)}
                className={`capitalize ${layoutStyle !== l ? 'border border-gray-200' : ''}`}
              >
                {l} Layout
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
