/**
 * WTCmart TechHub Content & Hardware Guide Section
 * High-authority hardware reviews, PC building guides, and Bangladesh tech market insights
 */

import { BookOpen, Calendar, Clock, ChevronRight, User } from 'lucide-react';
import { WTCTechArticle } from '../types';

interface TechHubSectionProps {
  articles: WTCTechArticle[];
}

export function TechHubSection({ articles }: TechHubSectionProps) {
  return (
    <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 rounded-3xl my-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 font-bold text-xs uppercase tracking-wider rounded-md">
                WTC TechHub Editorial
              </span>
              <span className="text-xs text-slate-400">Expert Reviews &amp; Hardware Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              WTC TechHub Hardware Knowledge Base
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Stay updated with benchmark comparisons, gaming PC component pairings, and warranty advice verified by WTCmart engineers.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(article => (
            <article
              key={article.id}
              className="bg-slate-800/80 rounded-2xl border border-slate-700/60 overflow-hidden hover:border-cyan-500/60 transition-all duration-200 flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-950/80 backdrop-blur-xs text-cyan-300 rounded text-[10px] font-bold uppercase">
                  {article.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">By {article.author}</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1 text-[11px] group-hover:translate-x-1 transition-transform">
                    Read Guide <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
