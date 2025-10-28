/**
 * Chart display component for rendering show_media tool outputs.
 */

import { parseShowMediaTool } from '@/lib/mix-streaming';
import { BarChart3 } from 'lucide-react';

interface ChartDisplayProps {
  tool: any;
}

export function ChartDisplay({ tool }: ChartDisplayProps) {
  const outputs = parseShowMediaTool(tool);

  if (outputs.length === 0) return null;

  return (
    <div className="space-y-4">
      {outputs.map((output, index) => (
        <div
          key={index}
          className="bg-card rounded-lg overflow-hidden border border-border"
        >
          <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">{output.title}</h3>
          </div>

          <div className="p-6">
            {output.description && (
              <p className="text-sm text-muted-foreground mb-4">{output.description}</p>
            )}

            {output.path && (
              <div className="bg-muted rounded-lg p-4">
                <img
                  src={output.path}
                  alt={output.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
