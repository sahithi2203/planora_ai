import React from 'react';
import { GroundingChunk } from '../types';
import { MapPinIcon, LinkIcon } from './Icons';

interface GroundingResultsProps {
  chunks: GroundingChunk[];
  type: 'map' | 'search';
}

const GroundingResults: React.FC<GroundingResultsProps> = ({ chunks, type }) => {
  if (!chunks || chunks.length === 0) return null;

  if (type === 'map') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full">
        {chunks.map((chunk, index) => {
          if (!chunk.maps) return null;
          const { title, uri, placeAnswerSources } = chunk.maps;
          const review = (placeAnswerSources as any)?.[0]?.reviewSnippets?.[0]?.reviewText;

          return (
            <a 
              key={index} 
              href={uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group relative p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-amber-500/50 rounded-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                     <MapPinIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">{title}</h3>
                </div>
              </div>
              {review && (
                <p className="mt-3 text-sm text-slate-400 line-clamp-2 italic">"{review}"</p>
              )}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                <LinkIcon />
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // Search Results
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {chunks.map((chunk, index) => {
        if (!chunk.web) return null;
        return (
          <a 
            key={index}
            href={chunk.web.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-indigo-900/30 border border-slate-700 hover:border-indigo-500/50 rounded-full text-xs text-slate-300 hover:text-indigo-300 transition-all"
          >
            <LinkIcon className="w-3 h-3" />
            <span className="truncate max-w-[200px]">{chunk.web.title}</span>
          </a>
        );
      })}
    </div>
  );
};

export default GroundingResults;