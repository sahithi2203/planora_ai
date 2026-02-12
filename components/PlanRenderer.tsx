import React from 'react';
import { Itinerary, Activity } from '../types';
import { ClockIcon, MapPinIcon } from './Icons';

const ActivityCard: React.FC<{ activity: Activity, isLast: boolean }> = ({ activity, isLast }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'food': return 'bg-orange-500/20 text-orange-300 border-orange-500/20';
      case 'sightseeing': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20';
      case 'travel': return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
      case 'leisure': return 'bg-purple-500/20 text-purple-300 border-purple-500/20';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  return (
    <div className="relative pl-8 pb-8">
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-800"></div>
      )}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center z-10`}>
        <div className={`w-2 h-2 rounded-full ${activity.category === 'food' ? 'bg-orange-400' : 'bg-emerald-400'}`}></div>
      </div>
      
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/60 transition-colors">
        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
          <h4 className="font-semibold text-slate-200 text-lg">{activity.activity}</h4>
          <span className={`text-xs px-2 py-1 rounded-md border ${getCategoryColor(activity.category)} uppercase tracking-wider font-bold`}>
            {activity.category}
          </span>
        </div>
        
        {activity.description && (
          <p className="text-slate-400 text-sm mb-3">{activity.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <ClockIcon />
            {activity.time}
          </div>
          {activity.location && (
            <div className="flex items-center gap-1 text-slate-400">
              <MapPinIcon className="w-3.5 h-3.5" />
              {activity.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlanRenderer: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  return (
    <div className="w-full mt-4 bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900/40 p-6 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold text-white mb-2">{itinerary.title}</h2>
        <p className="text-emerald-100/80 text-sm leading-relaxed">{itinerary.summary}</p>
      </div>

      <div className="p-6">
        {itinerary.days.map((day, dIndex) => (
          <div key={dIndex} className="mb-10 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700 text-emerald-400 font-bold">
                {day.day}
              </div>
              {day.theme && (
                <span className="text-slate-400 text-sm italic border-l border-slate-700 pl-4">
                  {day.theme}
                </span>
              )}
            </div>

            <div>
              {day.activities.map((act, aIndex) => (
                <ActivityCard 
                  key={aIndex} 
                  activity={act} 
                  isLast={aIndex === day.activities.length - 1} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanRenderer;
