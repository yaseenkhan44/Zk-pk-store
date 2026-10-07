import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BlogPost } from '../types';
import { Search, ArrowRight, Clock, User, Calendar, Tag } from 'lucide-react';

interface BlogPageProps {
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectPost }) => {
  const { blogPosts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const allTags = ['All', 'Buying Guides', 'Style Advice', 'Education', 'Wedding Style', 'Care & Maintenance', 'Buyer Protection'];

  const filteredPosts = blogPosts.filter(post => {
    if (selectedTag !== 'All' && post.category !== selectedTag && !post.tags.includes(selectedTag)) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">The Watchmaker's Notebook</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-luxury text-stone-900">ZK.pk Horology Journal</h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Comprehensive buying guides, movement comparisons, wedding watch etiquette, and care protocols written specifically for the Pakistani climate and lifestyle.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedTag === tag
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-stone-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-16/9 bg-stone-100 overflow-hidden">
                <img
                  src={post.image || '/images/watch-01.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="text-amber-800 font-bold">{post.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{post.date}</span>
                <span className="font-bold text-stone-900 group-hover:text-amber-800 inline-flex items-center gap-1 transition-colors">
                  Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
